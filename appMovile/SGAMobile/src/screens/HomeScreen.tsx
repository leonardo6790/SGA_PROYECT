import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { articulosService } from '../services/articulosService';
import { ArticuloCard } from '../components/ArticuloCard';
import { Articulo, Categoria } from '../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

export const HomeScreen: React.FC = () => {
  const [allArticulos, setAllArticulos] = useState<Articulo[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterArticulos();
  }, [selectedCategoria, searchQuery, allArticulos]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [articulosData, categoriasData] = await Promise.all([
        articulosService.getAll(),
        articulosService.getCategorias(),
      ]);
      setAllArticulos(articulosData);
      setCategorias(categoriasData);
    } catch (error: any) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticulos = () => {
    let filtered = [...allArticulos];

    // Filtrar por categoría
    if (selectedCategoria) {
      filtered = filtered.filter(art => art.categoria.id === selectedCategoria);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(art =>
        art.nombreArticulo.toLowerCase().includes(query) ||
        art.descripcion.toLowerCase().includes(query) ||
        art.categoria.nombreCategoria.toLowerCase().includes(query)
      );
    }

    setArticulos(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleArticuloPress = (articulo: Articulo) => {
    // Navegar a detalles del artículo
    console.log('Artículo seleccionado:', articulo);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando artículos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catálogo</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar artículos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            placeholderTextColor={COLORS.gray}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={[{ id: 0, nombreCategoria: 'Todas' }, ...categorias]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                (item.id === 0 && !selectedCategoria) || selectedCategoria === item.id
                  ? styles.categoryChipActive
                  : null,
              ]}
              onPress={() => {
                setSelectedCategoria(item.id === 0 ? null : item.id);
                setSearchQuery('');
              }}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  (item.id === 0 && !selectedCategoria) || selectedCategoria === item.id
                    ? styles.categoryChipTextActive
                    : null,
                ]}
              >
                {item.nombreCategoria}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={articulos || []}
        keyExtractor={(item, index) => item?.id?.toString() || `articulo-${index}`}
        renderItem={({ item }) => (
          item ? <ArticuloCard articulo={item} onPress={handleArticuloPress} /> : null
        )}
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
            <Text style={styles.emptyText}>📦</Text>
            <Text style={styles.emptyTitle}>No hay artículos</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Intenta con otra búsqueda'
                : 'No se encontraron artículos disponibles'}
            </Text>
          </View>
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
    backgroundColor: COLORS.white,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  searchButton: {
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: FONT_SIZES.lg,
  },
  categoriesList: {
    paddingHorizontal: SPACING.md,
  },
  categoryChip: {
    backgroundColor: COLORS.light,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: SPACING.md,
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
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
