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
} from 'react-native';
import { alquileresService, Alquiler } from '../services/alquileresService';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

export const OrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [alquileres, setAlquileres] = useState<Alquiler[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'entregar' | 'recibir'>('entregar');

  useEffect(() => {
    loadAlquileres();
  }, []);

  const loadAlquileres = async () => {
    try {
      setLoading(true);
      const data = await alquileresService.getAll();
      setAlquileres(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar alquileres');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlquileres();
    setRefreshing(false);
  };

  const handleMarcarEntregado = async (alquilerId: number, articuloId: number) => {
    try {
      await alquileresService.marcarComoEntregado(alquilerId, articuloId);
      Alert.alert('Éxito', 'Artículo marcado como entregado');
      loadAlquileres();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al marcar como entregado');
    }
  };

  const handleMarcarDevuelto = async (alquilerId: number, articuloId: number) => {
    try {
      await alquileresService.marcarComoDevuelto(alquilerId, articuloId);
      Alert.alert('Éxito', 'Artículo marcado como devuelto');
      loadAlquileres();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al marcar como devuelto');
    }
  };

  // Expandir alquileres a cards individuales por artículo
  const getArticleCards = () => {
    const cards: any[] = [];
    alquileres.forEach(alquiler => {
      alquiler.articulos.forEach(articulo => {
        const shouldShow = activeTab === 'entregar' 
          ? !articulo.entregado 
          : articulo.entregado && !articulo.estado;
          
        if (shouldShow) {
          cards.push({
            id: `${alquiler.id}-${articulo.articuloId}`,
            alquilerId: alquiler.id,
            articuloId: articulo.articuloId,
            clienteDocumento: alquiler.clienteDocumento,
            fechaAlquiler: alquiler.fechaAlquiler,
            fechaEntrega: alquiler.fechaEntrega,
            fechaRetiro: alquiler.fechaRetiro,
            articulo: articulo.nombreArticulo,
            talla: articulo.talla,
            precio: articulo.precio,
            total: alquiler.total,
            entregado: articulo.entregado,
            devuelto: articulo.estado,
            observaciones: articulo.observaciones,
          });
        }
      });
    });
    return cards;
  };

  const renderArticleCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.articulo}</Text>
        <Text style={styles.cardPrice}>${item.precio.toLocaleString('es-CO')}</Text>
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.cardDetail}>
          👤 Cliente: {item.clienteDocumento}
        </Text>
        {item.talla && (
          <Text style={styles.cardDetail}>
            👕 Talla: {item.talla}
          </Text>
        )}
        <Text style={styles.cardDetail}>
          📅 Alquiler: {new Date(item.fechaAlquiler).toLocaleDateString('es-CO')}
        </Text>
        <Text style={styles.cardDetail}>
          📤 Entrega: {new Date(item.fechaEntrega).toLocaleDateString('es-CO')}
        </Text>
        <Text style={styles.cardDetail}>
          📥 Retiro: {new Date(item.fechaRetiro).toLocaleDateString('es-CO')}
        </Text>
        <Text style={styles.cardDetail}>
          💰 Total alquiler: ${item.total.toLocaleString('es-CO')}
        </Text>
        {item.observaciones && (
          <Text style={styles.cardDetail}>
            📝 {item.observaciones}
          </Text>
        )}
      </View>

      <View style={styles.cardActions}>
        {activeTab === 'entregar' ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.deliverButton]}
            onPress={() => {
              Alert.alert(
                'Confirmar entrega',
                `¿Marcar "${item.articulo}" como entregado?`,
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Entregar',
                    onPress: () => handleMarcarEntregado(item.alquilerId, item.articuloId),
                  },
                ]
              );
            }}
          >
            <Text style={styles.actionButtonText}>✓ Marcar como Entregado</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.returnButton]}
            onPress={() => {
              Alert.alert(
                'Confirmar devolución',
                `¿Marcar "${item.articulo}" como devuelto?`,
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Devolver',
                    onPress: () => handleMarcarDevuelto(item.alquilerId, item.articuloId),
                  },
                ]
              );
            }}
          >
            <Text style={styles.actionButtonText}>↩ Marcar como Devuelto</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando órdenes...</Text>
      </View>
    );
  }

  const articleCards = getArticleCards();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Órdenes</Text>
        <Text style={styles.subtitle}>
          {articleCards.length} artículo(s)
        </Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'entregar' && styles.tabActive]}
          onPress={() => setActiveTab('entregar')}
        >
          <Text style={[styles.tabText, activeTab === 'entregar' && styles.tabTextActive]}>
            📤 Por Entregar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recibir' && styles.tabActive]}
          onPress={() => setActiveTab('recibir')}
        >
          <Text style={[styles.tabText, activeTab === 'recibir' && styles.tabTextActive]}>
            📥 Por Recibir
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={articleCards}
        renderItem={renderArticleCard}
        keyExtractor={(item) => item.id}
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
            <Text style={styles.emptyText}>📭</Text>
            <Text style={styles.emptyTitle}>No hay órdenes</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'entregar'
                ? 'No hay artículos pendientes por entregar'
                : 'No hay artículos pendientes por recibir'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewRent')}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.lg,
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  cardPrice: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.success,
  },
  cardBody: {
    marginBottom: SPACING.md,
  },
  cardDetail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  cardActions: {
    marginTop: SPACING.sm,
  },
  actionButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  deliverButton: {
    backgroundColor: COLORS.success,
  },
  returnButton: {
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
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
