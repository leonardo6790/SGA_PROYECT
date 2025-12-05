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
import { LinearGradient } from 'expo-linear-gradient';

interface PublicCatalogScreenProps {
  navigation: any;
}

export const PublicCatalogScreen: React.FC<PublicCatalogScreenProps> = ({ navigation }) => {
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
    console.log('Artículo seleccionado:', articulo);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando catálogo...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con búsqueda */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catálogo de Vestidos</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar vestidos..."
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>
      </View>

      {/* Categorías */}
      {categorias.length > 0 && (
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Categorías</Text>
          <View style={styles.categoriesGrid}>
            {categorias.map((item) => (
              <TouchableOpacity
                key={item.id.toString()}
                style={[
                  styles.categoryChip,
                  selectedCategoria === item.id && styles.categoryChipActive,
                ]}
                onPress={() =>
                  setSelectedCategoria(
                    selectedCategoria === item.id ? null : item.id
                  )
                }
                activeOpacity={0.7}
              >
                {selectedCategoria === item.id ? (
                  <LinearGradient
                    colors={['#9b59b6', '#8e44ad']}
                    style={styles.categoryChipGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.categoryChipTextActive} numberOfLines={2}>
                      {item.nombreCategoria}
                    </Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.categoryChipText} numberOfLines={2}>
                    {item.nombreCategoria}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Lista de artículos */}
      <FlatList
        data={articulos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ArticuloCard
            articulo={item}
            onPress={handleArticuloPress}
          />
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
            <Text style={styles.emptyIcon}>🎀</Text>
            <Text style={styles.emptyText}>No se encontraron vestidos</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 45,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.dark,
  },
  searchIcon: {
    fontSize: FONT_SIZES.lg,
    marginLeft: SPACING.sm,
  },
  categoriesSection: {
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  categoriesTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.dark,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    letterSpacing: 0.5,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
  },
  categoriesList: {
    display: 'none',
  },
  categoriesContent: {
    display: 'none',
  },
  categoryChip: {
    width: '48%',
    marginHorizontal: '1%',
    marginVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: '#f8f8f8',
    borderWidth: 2,
    borderColor: '#e5e5e5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  categoryChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  categoryChipGradient: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  categoryChipText: {
    fontSize: FONT_SIZES.md,
    color: '#666',
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  categoryChipTextActive: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
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
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
  },
});
