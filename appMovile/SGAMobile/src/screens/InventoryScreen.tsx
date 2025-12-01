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
} from 'react-native';
import { articulosService } from '../services/articulosService';
import { Articulo, Categoria } from '../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

export const InventoryScreen: React.FC = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [filteredArticulos, setFilteredArticulos] = useState<Articulo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterArticulos();
  }, [selectedCategoria, articulos]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articulosData, categoriasData] = await Promise.all([
        articulosService.getAll(),
        articulosService.getCategorias(),
      ]);
      setArticulos(articulosData);
      setCategorias(categoriasData);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const filterArticulos = () => {
    if (selectedCategoria === null) {
      setFilteredArticulos(articulos);
    } else {
      setFilteredArticulos(articulos.filter(art => art.categoria.id === selectedCategoria));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategoria(selectedCategoria === categoryId ? null : categoryId);
  };

  const handleEditPrice = (articulo: Articulo) => {
    setEditingId(articulo.id);
    setEditPrice(articulo.valorAlquiler.toString());
  };

  const handleSavePrice = async () => {
    if (!editingId) return;
    
    // TODO: Implementar actualización de precio cuando el backend lo soporte
    Alert.alert('Info', 'Función de edición en desarrollo');
    setEditingId(null);
  };

  const handleDelete = (articulo: Articulo) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar "${articulo.nombreArticulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implementar eliminación cuando el backend lo soporte
            Alert.alert('Info', 'Función de eliminación en desarrollo');
          },
        },
      ]
    );
  };

  const renderArticulo = ({ item }: { item: Articulo }) => (
    <View style={styles.articuloCard}>
      <View style={styles.articuloHeader}>
        <Text style={styles.articuloName}>{item.nombreArticulo}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditPrice(item)}
          >
            <Text style={styles.actionIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.category}>📁 {item.categoria.nombreCategoria}</Text>
      <Text style={styles.description}>{item.descripcion}</Text>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Precio de alquiler:</Text>
        <Text style={styles.price}>${item.valorAlquiler.toLocaleString('es-CO')}</Text>
      </View>
      
      <View style={styles.stockRow}>
        <Text style={styles.stockLabel}>Stock:</Text>
        <View style={[
          styles.stockBadge,
          item.stock > 0 ? styles.inStock : styles.outOfStock
        ]}>
          <Text style={styles.stockText}>
            {item.stock > 0 ? `${item.stock} disponible(s)` : 'Agotado'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCategoria = ({ item }: { item: Categoria }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategoria === item.id && styles.categoryChipSelected
      ]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Text style={[
        styles.categoryChipText,
        selectedCategoria === item.id && styles.categoryChipTextSelected
      ]}>
        {item.nombreCategoria}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando inventario...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📦 Inventario</Text>
        <Text style={styles.subtitle}>
          {filteredArticulos.length} artículo(s)
        </Text>
      </View>

      {categorias.length > 0 && (
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Filtrar por categoría:</Text>
          <FlatList
            horizontal
            data={categorias}
            renderItem={renderCategoria}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      )}

      <FlatList
        data={filteredArticulos}
        renderItem={renderArticulo}
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
            <Text style={styles.emptyText}>📭</Text>
            <Text style={styles.emptyTitle}>No hay artículos</Text>
            <Text style={styles.emptySubtitle}>
              {selectedCategoria
                ? 'No hay artículos en esta categoría'
                : 'No se encontraron artículos en el inventario'}
            </Text>
          </View>
        }
      />

      <Modal
        visible={editingId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Precio</Text>
            
            <TextInput
              style={styles.input}
              value={editPrice}
              onChangeText={setEditPrice}
              keyboardType="numeric"
              placeholder="Precio de alquiler"
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingId(null)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSavePrice}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  categoriesSection: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  categoriesList: {
    paddingHorizontal: SPACING.lg,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.light,
    marginRight: SPACING.sm,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  categoryChipTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.lg,
  },
  articuloCard: {
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
  articuloHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  articuloName: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  actionButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.light,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionIcon: {
    fontSize: FONT_SIZES.lg,
  },
  category: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  priceLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  price: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.success,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  stockLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  stockBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.md,
  },
  inStock: {
    backgroundColor: '#e8f5e9',
  },
  outOfStock: {
    backgroundColor: '#ffebee',
  },
  stockText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.light,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});
