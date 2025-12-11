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
import { obtenerArticulos } from '../api/articulosApi';
import { crearAlquiler } from '../api/alquilerApi';
import { crearPago } from '../api/pagoApi';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

// Función para formatear fecha en formato yyyy-MM-dd
const formatearFecha = (fecha: Date): string => {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${año}-${mes}-${dia}`;
};

export const NewOrderScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const clienteRecibido = route.params?.cliente;
  
  const [articulos, setArticulos] = useState<any[]>([]);
  const [articulosSeleccionados, setArticulosSeleccionados] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fechaAlquiler] = useState(formatearFecha(new Date()));
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [fechaRetiro, setFechaRetiro] = useState('');
  const [pagoInicial, setPagoInicial] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingArticulos, setLoadingArticulos] = useState(true);

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      const data = await obtenerArticulos();
      setArticulos(data);
    } catch (error) {
      console.error('Error al cargar artículos:', error);
      Alert.alert('Error', 'No se pudieron cargar los artículos');
    } finally {
      setLoadingArticulos(false);
    }
  };

  const articulosFiltrados = articulos.filter(art => {
    const searchLower = searchTerm.toLowerCase();
    const yaSeleccionado = articulosSeleccionados.some(a => a.idArt === art.idArt);
    return !yaSeleccionado && (
      art.nombre.toLowerCase().includes(searchLower) ||
      art.generoArt.toLowerCase().includes(searchLower) ||
      art.colorArt.toLowerCase().includes(searchLower) ||
      art.nomCate.toLowerCase().includes(searchLower)
    );
  });

  const agregarArticulo = (articulo: any) => {
    setArticulosSeleccionados([...articulosSeleccionados, {
      ...articulo,
      observaciones: ''
    }]);
    setSearchTerm('');
  };

  const eliminarArticulo = (idArt: number) => {
    setArticulosSeleccionados(articulosSeleccionados.filter(a => a.idArt !== idArt));
  };

  const actualizarObservacion = (idArt: number, observacion: string) => {
    setArticulosSeleccionados(articulosSeleccionados.map(a =>
      a.idArt === idArt ? { ...a, observaciones: observacion } : a
    ));
  };

  const calcularTotal = () => {
    return articulosSeleccionados.reduce((sum, art) => sum + art.precioArt, 0);
  };

  const handleCrearAlquiler = async () => {
    if (articulosSeleccionados.length === 0) {
      Alert.alert('Error', 'Debe agregar al menos un artículo');
      return;
    }

    if (!fechaEntrega || !fechaRetiro) {
      Alert.alert('Error', 'Debe completar las fechas de entrega y retiro');
      return;
    }

    // Validar formato de fechas
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fechaEntrega) || !fechaRegex.test(fechaRetiro)) {
      Alert.alert('Error', 'Las fechas deben tener el formato AAAA-MM-DD (ejemplo: 2025-12-05)');
      return;
    }

    // Validar pago inicial
    const pagoInicialNum = parseInt(pagoInicial) || 0;
    const total = calcularTotal();
    
    if (pagoInicialNum < 0) {
      Alert.alert('Error', 'El pago inicial no puede ser negativo');
      return;
    }

    if (pagoInicialNum > total) {
      Alert.alert('Error', 'El pago inicial no puede ser mayor al total');
      return;
    }

    try {
      setLoading(true);

      const alquilerData = {
        clienteDoc: clienteRecibido.doc,
        fechaAlquiler: fechaAlquiler,
        fechaEntrega: fechaEntrega,
        fechaRetiro: fechaRetiro,
        totalAlquiler: total,
        articulos: articulosSeleccionados.map(art => ({
          articuloId: art.idArt,
          precio: art.precioArt,
          estado: false,
          observaciones: art.observaciones || null
        })),
        // Agregar pago inicial si hay alguno
        ...(pagoInicialNum > 0 && {
          pagos: [{
            valAbo: pagoInicialNum,
            fechaUltimoAbono: parseInt(fechaAlquiler.replace(/-/g, ''))
          }]
        })
      };

      console.log('Enviando alquiler:', JSON.stringify(alquilerData, null, 2));

      const response = await crearAlquiler(alquilerData);

      console.log('Alquiler creado:', response);

      Alert.alert('Éxito', 'Alquiler creado exitosamente', [
        {
          text: 'OK',
          onPress: () => {
            // Navegar de vuelta a Orders
            navigation.navigate('MainTabs', { 
              screen: 'Orders',
              params: { refresh: true }
            });
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error completo:', error);
      console.error('Error response:', error.response?.data);
      Alert.alert('Error', `No se pudo crear el alquiler: ${error.response?.data?.detalle || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingArticulos) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando artículos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Registrar Nueva Orden</Text>

        {/* Información del Cliente */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información del Cliente</Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Nombre: </Text>
            {clienteRecibido.nomcli1} {clienteRecibido.nomcli2 || ''} {clienteRecibido.apecli1} {clienteRecibido.apecli2 || ''}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Documento: </Text>
            {clienteRecibido.doc}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Teléfono: </Text>
            {clienteRecibido.numeroCli}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Email: </Text>
            {clienteRecibido.correoElectronico}
          </Text>
        </View>

        {/* Fechas */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fechas de Alquiler</Text>
          
          <Text style={styles.label}>Fecha de inicio</Text>
          <Text style={styles.dateDisplay}>{fechaAlquiler}</Text>

          <Text style={styles.label}>Fecha de entrega *</Text>
          <TextInput
            style={styles.input}
            value={fechaEntrega}
            onChangeText={setFechaEntrega}
            placeholder="YYYY-MM-DD"
          />

          <Text style={styles.label}>Fecha de devolución *</Text>
          <TextInput
            style={styles.input}
            value={fechaRetiro}
            onChangeText={setFechaRetiro}
            placeholder="YYYY-MM-DD"
          />
        </View>

        {/* Pago Inicial */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pago Inicial</Text>
          <Text style={styles.label}>Monto del pago inicial (opcional)</Text>
          <TextInput
            style={styles.input}
            value={pagoInicial}
            onChangeText={setPagoInicial}
            placeholder="0"
            keyboardType="numeric"
          />
          <Text style={styles.helpText}>
            💡 Debe pagar el total (${calcularTotal().toLocaleString()}) para poder entregar los artículos
          </Text>
        </View>

        {/* Productos */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Productos a Alquilar ({articulosSeleccionados.length})</Text>
          
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Buscar artículos..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          {searchTerm.length > 0 && (
            <ScrollView style={styles.searchResults} nestedScrollEnabled>
              {articulosFiltrados.map(art => (
                <TouchableOpacity
                  key={art.idArt}
                  style={styles.searchItem}
                  onPress={() => agregarArticulo(art)}
                >
                  <View style={styles.searchItemInfo}>
                    <Text style={styles.searchItemName}>{art.nombre}</Text>
                    <Text style={styles.searchItemDesc}>
                      {art.generoArt} - {art.tallaArt} - {art.colorArt}
                    </Text>
                  </View>
                  <Text style={styles.searchItemPrice}>${art.precioArt.toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
              {articulosFiltrados.length === 0 && (
                <Text style={styles.noResults}>No se encontraron artículos</Text>
              )}
            </ScrollView>
          )}

          {articulosSeleccionados.map((art, index) => (
            <View key={art.idArt} style={styles.selectedItem}>
              <View style={styles.selectedItemHeader}>
                <View style={styles.selectedItemInfo}>
                  <Text style={styles.selectedItemName}>{art.nombre}</Text>
                  <Text style={styles.selectedItemDesc}>
                    {art.generoArt} - {art.tallaArt} - {art.colorArt}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => eliminarArticulo(art.idArt)}>
                  <Text style={styles.deleteButton}>❌</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.selectedItemPrice}>
                Precio: ${art.precioArt.toLocaleString()}
              </Text>
              <TextInput
                style={styles.obsInput}
                placeholder="Observaciones (opcional)"
                value={art.observaciones}
                onChangeText={(text) => actualizarObservacion(art.idArt, text)}
                multiline
              />
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total a pagar:</Text>
          <Text style={styles.totalAmount}>${calcularTotal().toLocaleString()}</Text>
        </View>

        {/* Botón Crear */}
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCrearAlquiler}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.createButtonText}>Crear Alquiler</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5ead6', // Beige
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: '#666',
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: '#2c2c2c', // Dark
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#c99d6a', // Brown left border
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#2c2c2c',
    marginBottom: SPACING.md,
  },
  infoText: {
    fontSize: FONT_SIZES.md,
    color: '#2c2c2c',
    marginBottom: SPACING.xs,
  },
  infoLabel: {
    fontWeight: '600',
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: '#2c2c2c',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  helpText: {
    fontSize: FONT_SIZES.sm,
    color: '#666',
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  dateDisplay: {
    fontSize: FONT_SIZES.md,
    color: '#666',
    backgroundColor: '#e5d4c1', // Light tan\n    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d4a574', // Tan border
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: '#2c2c2c',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d4a574', // Tan border
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.md,
  },
  searchResults: {
    maxHeight: 200,
    borderWidth: 2,
    borderColor: '#d4a574', // Tan border
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  searchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5d4c1',
  },
  searchItemInfo: {
    flex: 1,
  },
  searchItemName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#2c2c2c',
  },
  searchItemDesc: {
    fontSize: FONT_SIZES.sm,
    color: '#666',
  },
  searchItemPrice: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: '#c99d6a', // Brown price
  },
  noResults: {
    padding: SPACING.lg,
    textAlign: 'center',
    color: '#666',
  },
  selectedItem: {
    backgroundColor: '#f9f6f1', // Very light beige
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: '#c99d6a', // Brown accent
  },
  selectedItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  selectedItemInfo: {
    flex: 1,
  },
  selectedItemName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#2c2c2c',
  },
  selectedItemDesc: {
    fontSize: FONT_SIZES.sm,
    color: '#666',
  },
  deleteButton: {
    fontSize: FONT_SIZES.lg,
  },
  selectedItemPrice: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: '#c99d6a', // Brown price
    marginBottom: SPACING.sm,
  },
  obsInput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d4a574', // Tan border
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  totalCard: {
    backgroundColor: '#c99d6a', // Brown
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: '#fff',
  },
  totalAmount: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#28a745', // Green
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#fff',
  },
});
