import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { obtenerAlquileres } from '../api/alquilerApi';
import { obtenerTodosLosPagos } from '../api/pagoApi';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

interface Alquiler {
  id_alquiler?: number;
  clienteDoc?: string;
  articulos?: any[];
  fechaAlquiler?: string;
  fechaEntrega?: string;
  fechaRetiro?: string;
  totalAlquiler?: number;
}

interface Pago {
  id_pago?: number;
  idPago?: number;
  montoAbonado?: number;
  montoAbono?: number;
  fechaPago?: string;
  alquiler?: any;
}

interface ReportStats {
  total: number;
  totalMonto: number;
  completados: number;
  pendientes: number;
}

interface ReportItem {
  id: number | undefined;
  clienteDoc: string | number | undefined;
  nombreCliente: any;
  fecha: string | undefined;
  monto: number | undefined;
  estado?: string;
  cantidadArticulos?: number;
  detalles?: any;
}

export const AdminReportsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState<'alquileres' | 'pagos' | 'devueltos'>('alquileres');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportItem[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    total: 0,
    totalMonto: 0,
    completados: 0,
    pendientes: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<ReportItem[]>([]);
  const [viewingDetail, setViewingDetail] = useState<ReportItem | null>(null);
  const [alquileresData, setAlquileresData] = useState<Alquiler[]>([]);
  const [pagosData, setPagosData] = useState<Pago[]>([]);

  useEffect(() => {
    cargarReportes();
  }, []);

  useEffect(() => {
    procesarReportes();
  }, [activeTab, alquileresData, pagosData]);

  useEffect(() => {
    filtrarDatos();
  }, [searchText, reportData]);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      const [alq, pag] = await Promise.all([
        obtenerAlquileres(),
        obtenerTodosLosPagos().catch(err => {
          console.warn('Error al cargar pagos:', err);
          return [];
        }),
      ]);
      
      console.log('Alquileres cargados:', alq);
      console.log('Pagos cargados:', pag);
      
      // Guardar los datos
      setAlquileresData(alq as any);
      setPagosData(pag as any);
      
      // Procesar según el tab activo
      if (activeTab === 'alquileres') {
        procesarAlquileres(alq as any);
      } else if (activeTab === 'pagos') {
        procesarPagos(pag as any);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes');
      setLoading(false);
    }
  };

  const procesarReportes = () => {
    switch (activeTab) {
      case 'alquileres':
        if (alquileresData.length > 0) {
          procesarAlquileres(alquileresData as any);
        }
        break;
      case 'pagos':
        if (pagosData.length > 0) {
          procesarPagos(pagosData as any);
        }
        break;
      case 'devueltos':
        // Filtrar alquileres completados (entregados Y devueltos)
        if (alquileresData.length > 0) {
          const devueltos = (alquileresData || []).filter((alquiler: any) => {
            const articulos = alquiler.articulos || [];
            return articulos.length > 0 && articulos.every((a: any) => a.entregado === true && a.estado === true);
          });
          procesarAlquileres(devueltos as any);
        }
        break;
      default:
        break;
    }
  };

  const procesarAlquileres = (alquileresData: Alquiler[]) => {
    try {
      const reporteAlquileres: ReportItem[] = (alquileresData || []).map(alquiler => {
        const monto = alquiler.totalAlquiler || 0;
        const articulos = alquiler.articulos || [];
        // Un alquiler está completado si TODOS sus artículos están entregados Y devueltos
        const isCompleted = articulos.length > 0 && articulos.every((a: any) => a.entregado === true && a.estado === true);
        
        return {
          id: alquiler.id_alquiler,
          clienteDoc: String(alquiler.clienteDoc || ''),
          nombreCliente: articulos.length > 0 ? (articulos[0].nomCliente || 'N/A') : 'N/A',
          fecha: alquiler.fechaAlquiler || '',
          monto: monto,
          cantidadArticulos: articulos.length,
          estado: isCompleted ? 'Completado' : 'Pendiente',
          detalles: alquiler,
        };
      });

      const completados = reporteAlquileres.filter(r => r.estado === 'Completado').length;
      const pendientes = reporteAlquileres.filter(r => r.estado === 'Pendiente').length;
      const totalMonto = reporteAlquileres.reduce((sum, r) => sum + (r.monto || 0), 0);

      setReportData(reporteAlquileres);
      setStats({
        total: reporteAlquileres.length,
        totalMonto,
        completados,
        pendientes,
      });
    } catch (error) {
      console.error('Error procesando alquileres:', error);
      Alert.alert('Error', 'Error al procesar alquileres');
    }
  };

  const procesarPagos = (pagosData: Pago[]) => {
    try {
      const reportePagos: ReportItem[] = (pagosData || []).map(pago => {
        const monto = pago.montoAbonado || pago.montoAbono || 0;
        const id = pago.id_pago || pago.idPago;
        const alq = pago.alquiler;
        
        return {
          id: id,
          clienteDoc: String(alq?.clienteDoc || 'N/A'),
          nombreCliente: alq?.articulos?.[0]?.nomCliente || 'N/A',
          fecha: pago.fechaPago || '',
          monto: monto,
          detalles: pago,
        };
      });

      const totalMonto = reportePagos.reduce((sum, r) => sum + (r.monto || 0), 0);

      setReportData(reportePagos);
      setStats({
        total: reportePagos.length,
        totalMonto,
        completados: 0,
        pendientes: 0,
      });
    } catch (error) {
      console.error('Error procesando pagos:', error);
      Alert.alert('Error', 'Error al procesar pagos');
    }
  };

  const filtrarDatos = () => {
    if (!searchText.trim()) {
      setFilteredData(reportData);
    } else {
      const filtered = reportData.filter(item => {
        const doc = String(item.clienteDoc || '').toLowerCase();
        const nombre = String(item.nombreCliente || '').toLowerCase();
        return doc.includes(searchText.toLowerCase()) || nombre.includes(searchText.toLowerCase());
      });
      setFilteredData(filtered);
    }
  };

  const renderStatCard = (title: string, value: string | number) => (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  const renderReportItem = (item: ReportItem) => (
    <TouchableOpacity
      style={styles.reportItem}
      onPress={() => setViewingDetail(item)}
    >
      <View style={styles.reportItemRow}>
        <View style={styles.reportItemLeft}>
          <Text style={styles.reportItemId}>#{item.id}</Text>
          <Text style={styles.reportItemClient} numberOfLines={1}>
            {item.nombreCliente}
          </Text>
          <Text style={styles.reportItemDoc}>{item.clienteDoc}</Text>
        </View>
        <View style={styles.reportItemRight}>
          <Text style={styles.reportItemMonto}>${(item.monto || 0).toLocaleString()}</Text>
          <Text style={styles.reportItemDate}>{item.fecha}</Text>
          {item.estado && (
            <View style={[
              styles.statusBadge,
              item.estado === 'Completado' ? styles.statusCompleted : styles.statusPending
            ]}>
              <Text style={styles.statusText}>{item.estado}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando reportes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reportes</Text>
          <Text style={styles.subtitle}>Gestión de alquileres y pagos</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por ID o nombre..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={COLORS.gray}
          />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {renderStatCard('Total', stats.total)}
          {renderStatCard('Monto Total', `$${stats.totalMonto.toLocaleString()}`)}
          {activeTab === 'alquileres' && (
            <>
              {renderStatCard('Completados', stats.completados)}
              {renderStatCard('Pendientes', stats.pendientes)}
            </>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'alquileres' && styles.tabButtonActive]}
            onPress={() => setActiveTab('alquileres')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'alquileres' && styles.tabButtonTextActive]}>
              Alquileres
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'pagos' && styles.tabButtonActive]}
            onPress={() => setActiveTab('pagos')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'pagos' && styles.tabButtonTextActive]}>
              Pagos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'devueltos' && styles.tabButtonActive]}
            onPress={() => setActiveTab('devueltos')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'devueltos' && styles.tabButtonTextActive]}>
              Devueltos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Report Items */}
        <View style={styles.reportList}>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <View key={`${item.id}-${index}`}>
                {renderReportItem(item)}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay datos para mostrar</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={viewingDetail !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setViewingDetail(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setViewingDetail(null)}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Detalles</Text>
            <View style={{ width: 30 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            {viewingDetail && (
              <>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>ID Alquiler</Text>
                  <Text style={styles.detailValue}>#{viewingDetail.id}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Cliente</Text>
                  <Text style={styles.detailValue}>{viewingDetail.nombreCliente}</Text>
                  <Text style={styles.detailSubText}>{viewingDetail.clienteDoc}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Monto</Text>
                  <Text style={styles.detailValue}>${(viewingDetail.monto || 0).toLocaleString()}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Fecha</Text>
                  <Text style={styles.detailValue}>{viewingDetail.fecha}</Text>
                </View>

                {viewingDetail.estado && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Estado</Text>
                    <View style={[
                      styles.statusBadgeLarge,
                      viewingDetail.estado === 'Completado' ? styles.statusCompletedLarge : styles.statusPendingLarge
                    ]}>
                      <Text style={styles.statusTextLarge}>{viewingDetail.estado}</Text>
                    </View>
                  </View>
                )}

                {viewingDetail.cantidadArticulos && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Cantidad de Artículos</Text>
                    <Text style={styles.detailValue}>{viewingDetail.cantidadArticulos}</Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5ead6',
  },
  scrollContent: {
    paddingBottom: SPACING.lg,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: '#2c2c2c',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: '#666',
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    borderWidth: 1,
    borderColor: '#d4a574',
  },
  statsContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#c99d6a',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: '#fff',
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: '#fff',
  },
  tabsContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d4a574',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#c99d6a',
    borderColor: '#c99d6a',
  },
  tabButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  reportList: {
    paddingHorizontal: SPACING.md,
  },
  reportItem: {
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#c99d6a',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reportItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportItemLeft: {
    flex: 1,
    marginRight: SPACING.md,
  },
  reportItemRight: {
    alignItems: 'flex-end',
  },
  reportItemId: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: '#c99d6a',
    marginBottom: SPACING.xs,
  },
  reportItemClient: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#2c2c2c',
    marginBottom: SPACING.xs,
  },
  reportItemDoc: {
    fontSize: FONT_SIZES.xs,
    color: '#999',
  },
  reportItemMonto: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: '#c99d6a',
    marginBottom: SPACING.xs,
  },
  reportItemDate: {
    fontSize: FONT_SIZES.xs,
    color: '#999',
    marginBottom: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.xs,
  },
  statusCompleted: {
    backgroundColor: '#d4edda',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5ead6',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: '#c99d6a',
  },
  modalCloseButton: {
    fontSize: FONT_SIZES.lg,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: '#fff',
  },
  modalContent: {
    padding: SPACING.md,
  },
  detailSection: {
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#c99d6a',
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    color: '#999',
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: '#2c2c2c',
  },
  detailSubText: {
    fontSize: FONT_SIZES.sm,
    color: '#666',
    marginTop: SPACING.xs,
  },
  statusBadgeLarge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  statusCompletedLarge: {
    backgroundColor: '#d4edda',
  },
  statusPendingLarge: {
    backgroundColor: '#fff3cd',
  },
  statusTextLarge: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: '#2c2c2c',
  },
});
