import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { clientesService } from '../services/clientesService';
import { articulosService } from '../services/articulosService';
import { alquileresService } from '../services/alquileresService';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

export const NewRentScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [documento, setDocumento] = useState('');
  const [clienteEncontrado, setClienteEncontrado] = useState<any>(null);
  const [searchingCliente, setSearchingCliente] = useState(false);
  const [articulos, setArticulos] = useState<any[]>([]);
  const [selectedArticulos, setSelectedArticulos] = useState<number[]>([]);
  const [fechaAlquiler, setFechaAlquiler] = useState(new Date().toISOString().split('T')[0]);
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [fechaRetiro, setFechaRetiro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadArticulos();
  }, []);

  useEffect(() => {
    if (documento.length >= 7) {
      buscarCliente();
    } else {
      setClienteEncontrado(null);
    }
  }, [documento]);

  const loadArticulos = async () => {
    try {
      const data = await articulosService.getAll();
      setArticulos(data);
    } catch (error: any) {
      Alert.alert('Error', 'Error al cargar artículos');
    }
  };

  const buscarCliente = async () => {
    try {
      setSearchingCliente(true);
      const cliente = await clientesService.getByDocumento(parseInt(documento));
      setClienteEncontrado(cliente);
    } catch (error: any) {
      console.error('Error buscando cliente:', error);
    } finally {
      setSearchingCliente(false);
    }
  };

  const toggleArticulo = (articuloId: number) => {
    if (selectedArticulos.includes(articuloId)) {
      setSelectedArticulos(selectedArticulos.filter(id => id !== articuloId));
    } else {
      setSelectedArticulos([...selectedArticulos, articuloId]);
    }
  };

  const handleCrearAlquiler = async () => {
    // Validaciones
    if (!clienteEncontrado) {
      Alert.alert('Error', 'Debe buscar y seleccionar un cliente');
      return;
    }

    if (selectedArticulos.length === 0) {
      Alert.alert('Error', 'Debe seleccionar al menos un artículo');
      return;
    }

    if (!fechaEntrega || !fechaRetiro) {
      Alert.alert('Error', 'Debe especificar las fechas de entrega y retiro');
      return;
    }

    try {
      setLoading(true);
      
      const alquilerData = {
        clienteDoc: clienteEncontrado.documento,
        fechaAlquiler: fechaAlquiler,
        fechaEntrega: fechaEntrega,
        fechaRetiro: fechaRetiro,
        articulos: selectedArticulos.map(id => ({
          articuloId: id,
          cantidad: 1,
        })),
      };

      await alquileresService.create(alquilerData);
      
      Alert.alert('Éxito', 'Alquiler creado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al crear el alquiler');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoCliente = () => {
    Alert.alert(
      'Nuevo Cliente',
      'Función de crear cliente en desarrollo. Por ahora, el cliente debe ser creado desde la web.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🏪 Nuevo Alquiler</Text>
        </View>

        {/* Búsqueda de cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Buscar Cliente</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Número de documento..."
            value={documento}
            onChangeText={setDocumento}
            keyboardType="numeric"
            maxLength={10}
          />

          {searchingCliente && (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: SPACING.md }} />
          )}

          {clienteEncontrado ? (
            <View style={styles.clienteCard}>
              <Text style={styles.clienteCardTitle}>✓ Cliente encontrado</Text>
              <Text style={styles.clienteCardText}>
                {clienteEncontrado.primerNombre} {clienteEncontrado.primerApellido}
              </Text>
              <Text style={styles.clienteCardDetail}>
                📧 {clienteEncontrado.email}
              </Text>
              <Text style={styles.clienteCardDetail}>
                📞 {clienteEncontrado.telefono}
              </Text>
            </View>
          ) : documento.length >= 7 && !searchingCliente ? (
            <View style={styles.notFoundCard}>
              <Text style={styles.notFoundText}>❌ Cliente no encontrado</Text>
              <TouchableOpacity style={styles.newClientButton} onPress={handleNuevoCliente}>
                <Text style={styles.newClientButtonText}>+ Crear Nuevo Cliente</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Fechas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Fechas</Text>
          
          <Text style={styles.label}>Fecha de Entrega:</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={fechaEntrega}
            onChangeText={setFechaEntrega}
          />

          <Text style={styles.label}>Fecha de Retiro:</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={fechaRetiro}
            onChangeText={setFechaRetiro}
          />
        </View>

        {/* Selección de artículos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Seleccionar Artículos ({selectedArticulos.length})</Text>
          
          {articulos.map((articulo) => (
            <TouchableOpacity
              key={articulo.id}
              style={[
                styles.articuloItem,
                selectedArticulos.includes(articulo.id) && styles.articuloItemSelected
              ]}
              onPress={() => toggleArticulo(articulo.id)}
            >
              <View style={styles.checkbox}>
                {selectedArticulos.includes(articulo.id) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              
              <View style={styles.articuloInfo}>
                <Text style={styles.articuloName}>{articulo.nombreArticulo}</Text>
                <Text style={styles.articuloPrice}>
                  ${articulo.valorAlquiler.toLocaleString('es-CO')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCrearAlquiler}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'Creando...' : '✓ Crear Alquiler'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  clienteCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  clienteCardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.success,
    marginBottom: SPACING.xs,
  },
  clienteCardText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  clienteCardDetail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  notFoundCard: {
    backgroundColor: '#ffebee',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.danger,
    marginBottom: SPACING.md,
  },
  newClientButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  newClientButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  articuloItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  articuloItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#e3f2fd',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '700',
  },
  articuloInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articuloName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },
  articuloPrice: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.success,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
});
