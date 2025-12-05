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
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';
import { LinearGradient } from 'expo-linear-gradient';

interface Order {
  id: number;
  fecha: string;
  estado: string;
  total: number;
  articulos: number;
}

export const MyOrdersScreen: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // TODO: Implementar llamada al API para obtener pedidos del cliente
      // const data = await ordersService.getMyOrders();
      
      // Datos de ejemplo mientras se implementa el API
      const mockOrders: Order[] = [
        {
          id: 1,
          fecha: '2025-12-01',
          estado: 'Entregado',
          total: 150000,
          articulos: 2,
        },
        {
          id: 2,
          fecha: '2025-12-03',
          estado: 'En proceso',
          total: 200000,
          articulos: 1,
        },
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusColor = (estado: string): [string, string] => {
    switch (estado.toLowerCase()) {
      case 'entregado':
        return ['#43e97b', '#38f9d7'];
      case 'en proceso':
        return ['#fa709a', '#fee140'];
      case 'cancelado':
        return ['#eb3349', '#f45c43'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const getStatusIcon = (estado: string): string => {
    switch (estado.toLowerCase()) {
      case 'entregado':
        return '✅';
      case 'en proceso':
        return '⏳';
      case 'cancelado':
        return '❌';
      default:
        return '📦';
    }
  };

  const renderOrderCard = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderContainer} activeOpacity={0.9}>
      <LinearGradient
        colors={getStatusColor(item.estado)}
        style={styles.orderCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Pedido #{item.id}</Text>
            <Text style={styles.orderDate}>{new Date(item.fecha).toLocaleDateString('es-ES')}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusIcon}>{getStatusIcon(item.estado)}</Text>
            <Text style={styles.statusText}>{item.estado}</Text>
          </View>
        </View>

        <View style={styles.orderDivider} />

        <View style={styles.orderBody}>
          <View style={styles.orderInfo}>
            <Text style={styles.infoIcon}>📦</Text>
            <Text style={styles.infoText}>{item.articulos} artículo{item.articulos > 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.infoIcon}>💰</Text>
            <Text style={styles.infoText}>
              ${item.total.toLocaleString('es-CO')}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Ver Detalles →</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyTitle}>No tienes pedidos aún</Text>
      <Text style={styles.emptyText}>
        Explora nuestro catálogo y realiza tu primer alquiler
      </Text>
      <TouchableOpacity style={styles.browseCatalogButton}>
        <Text style={styles.browseCatalogButtonText}>Ver Catálogo</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando pedidos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
        <Text style={styles.headerSubtitle}>Historial de alquileres</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      />
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
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  listContent: {
    padding: SPACING.md,
  },
  orderContainer: {
    marginBottom: SPACING.md,
  },
  orderCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderIdContainer: {
    flex: 1,
  },
  orderIdLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  orderDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: SPACING.xs / 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  statusIcon: {
    fontSize: 14,
    marginRight: SPACING.xs / 2,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  orderDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: SPACING.sm,
  },
  orderBody: {
    marginBottom: SPACING.sm,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    fontWeight: '500',
  },
  detailsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  detailsButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  browseCatalogButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  browseCatalogButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});
