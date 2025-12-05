import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { clientesService, Cliente } from '../services/clientesService';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

export const ClientsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    filterClientes();
  }, [searchQuery, clientes]);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesService.getAll();
      setClientes(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const filterClientes = () => {
    if (!searchQuery.trim()) {
      setFilteredClientes(clientes);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClientes(
        clientes.filter(
          (cliente) =>
            cliente.primerNombre.toLowerCase().includes(query) ||
            cliente.primerApellido.toLowerCase().includes(query) ||
            cliente.documento.toString().includes(query) ||
            cliente.email.toLowerCase().includes(query)
        )
      );
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadClientes();
    setRefreshing(false);
  };

  const handleClientPress = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalVisible(true);
  };

  const handleEditCliente = () => {
    if (selectedCliente) {
      navigation.navigate('NewClient', { cliente: selectedCliente });
      setModalVisible(false);
    }
  };

  const handleDeleteCliente = () => {
    Alert.alert(
      'Eliminar Cliente',
      `¿Deseas eliminar a ${selectedCliente?.primerNombre} ${selectedCliente?.primerApellido}?`,
      [
        {
          text: 'Cancelar',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await clientesService.delete(selectedCliente!.id);
              Alert.alert('Éxito', 'Cliente eliminado correctamente');
              setModalVisible(false);
              loadClientes();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Error al eliminar cliente');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderCliente = ({ item }: { item: Cliente }) => (
    <TouchableOpacity
      style={styles.clienteCard}
      onPress={() => handleClientPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>
          {item.primerNombre.charAt(0)}{item.primerApellido.charAt(0)}
        </Text>
      </View>
      
      <View style={styles.clienteInfo}>
        <Text style={styles.clienteName}>
          {item.primerNombre} {item.segundoNombre || ''} {item.primerApellido} {item.segundoApellido || ''}
        </Text>
        
        <Text style={styles.clienteDetail}>
          📄 {item.tipoDocumento.nombre}: {item.documento}
        </Text>
        
        <Text style={styles.clienteDetail}>
          📧 {item.email}
        </Text>
        
        <Text style={styles.clienteDetail}>
          📞 {item.telefono}
        </Text>
        
        <Text style={styles.clienteDetail}>
          📍 {item.direccion}, {item.barrio.nombre}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando clientes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👥 Clientes</Text>
        <Text style={styles.subtitle}>
          {filteredClientes.length} cliente(s)
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, documento o email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredClientes}
        renderItem={renderCliente}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>👤</Text>
            <Text style={styles.emptyTitle}>No hay clientes</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'No se encontraron clientes con ese criterio'
                : 'No hay clientes registrados'}
            </Text>
          </View>
        }
      />

      {/* Modal para detalles del cliente */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCliente && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header del Modal */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Detalles del Cliente</Text>
                  <View style={{ width: 30 }} />
                </View>

                {/* Avatar grande */}
                <View style={styles.modalAvatarContainer}>
                  <Text style={styles.modalAvatar}>
                    {selectedCliente.primerNombre.charAt(0)}
                    {selectedCliente.primerApellido.charAt(0)}
                  </Text>
                </View>

                {/* Información del cliente */}
                <View style={styles.modalInfoSection}>
                  <Text style={styles.modalClienteName}>
                    {selectedCliente.primerNombre} {selectedCliente.segundoNombre || ''} {selectedCliente.primerApellido} {selectedCliente.segundoApellido || ''}
                  </Text>

                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>📄 Documento:</Text>
                    <Text style={styles.infoValue}>
                      {selectedCliente.tipoDocumento.nombre}: {selectedCliente.documento}
                    </Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>📧 Email:</Text>
                    <Text style={styles.infoValue}>{selectedCliente.email}</Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>📞 Teléfono:</Text>
                    <Text style={styles.infoValue}>{selectedCliente.telefono}</Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>📍 Dirección:</Text>
                    <Text style={styles.infoValue}>{selectedCliente.direccion}</Text>
                  </View>

                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>🏘️ Barrio:</Text>
                    <Text style={styles.infoValue}>{selectedCliente.barrio.nombre}</Text>
                  </View>
                </View>

                {/* Botones de acción */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditCliente}
              >
                    <Text style={styles.editButtonText}>✏️ Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteCliente}
                  >
                    <Text style={styles.deleteButtonText}>🗑️ Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewClient')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5ead6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5ead6',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderBottomColor: '#d4a574',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    fontSize: FONT_SIZES.lg,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    paddingVertical: SPACING.md,
    color: COLORS.text,
  },
  clearIcon: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    padding: SPACING.xs,
  },
  listContent: {
    padding: SPACING.lg,
  },
  clienteCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#d4a574',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#c99d6a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatar: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
  },
  clienteInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  clienteName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#2c2c2c',
    marginBottom: SPACING.xs,
  },
  clienteDetail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#c99d6a',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '300',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#f5ead6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: '#d4a574',
  },
  closeButton: {
    fontSize: FONT_SIZES.xl,
    color: '#2c2c2c',
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#2c2c2c',
  },
  modalAvatarContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#c99d6a',
    color: COLORS.white,
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 80,
  },
  modalInfoSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  modalClienteName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#2c2c2c',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  infoItem: {
    marginBottom: SPACING.md,
    backgroundColor: '#ffffff',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: '#d4a574',
  },
  infoLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: '#c99d6a',
    marginBottom: SPACING.xs,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: '#2c2c2c',
    fontWeight: '500',
  },
  modalActions: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  editButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
});
