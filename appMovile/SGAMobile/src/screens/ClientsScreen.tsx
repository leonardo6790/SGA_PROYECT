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
} from 'react-native';
import { clientesService, Cliente } from '../services/clientesService';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

export const ClientsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    Alert.alert(
      cliente.primerNombre + ' ' + cliente.primerApellido,
      `Documento: ${cliente.documento}\n` +
      `Email: ${cliente.email}\n` +
      `Teléfono: ${cliente.telefono}\n` +
      `Dirección: ${cliente.direccion}\n` +
      `Barrio: ${cliente.barrio.nombre}\n` +
      `Tipo Doc: ${cliente.tipoDocumento.nombre}`,
      [{ text: 'Cerrar' }]
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
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
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
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
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
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
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
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '300',
  },
});
