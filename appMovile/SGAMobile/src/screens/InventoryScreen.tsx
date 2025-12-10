import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input, Card } from '../components/ui';
import { colors, gradients, spacing, fontSizes, borderRadius, shadows } from '../theme/colors';
import {
  obtenerArticulos,
  crearArticulo,
  actualizarArticulo,
  Articulo,
  ArticuloCreate,
} from '../api/articulosApi';
import { obtenerCategorias, crearCategoria, Categoria, CategoriaCreate } from '../api/categoriasApi';

interface InventoryScreenProps {
  navigation?: any;
}

export default function InventoryScreen({ navigation }: InventoryScreenProps) {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState<Articulo | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<ArticuloCreate>({
    nombre: '',
    generoArt: '',
    tallaArt: '',
    colorArt: '',
    precioArt: 0,
    activo: true,
    idCategoria: 0,
  });
  const [categoryForm, setCategoryForm] = useState<CategoriaCreate>({
    nomCate: '',
    descCate: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  // Recargar cuando la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [articulosData, categoriasData] = await Promise.all([
        obtenerArticulos(),
        obtenerCategorias(),
      ]);
      setArticulos(articulosData);
      setCategorias(categoriasData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  };

  const filteredArticulos = articulos.filter((articulo) => {
    const matchesSearch =
      articulo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      articulo.colorArt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      articulo.tallaArt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? articulo.idCategoria === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleCreate = async () => {
    if (!formData.nombre || !formData.precioArt || !formData.idCategoria) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setSaving(true);
      await crearArticulo(formData);
      Alert.alert('Éxito', 'Artículo creado correctamente');
      setShowCreateModal(false);
      resetForm();
      await cargarDatos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el artículo');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedArticulo) return;

    try {
      setSaving(true);
      await actualizarArticulo(selectedArticulo.idArt, {
        ...formData,
        idArt: selectedArticulo.idArt,
      });
      Alert.alert('Éxito', 'Artículo actualizado correctamente');
      setShowEditModal(false);
      resetForm();
      await cargarDatos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el artículo');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (articulo: Articulo) => {
    setSelectedArticulo(articulo);
    setFormData({
      nombre: articulo.nombre,
      generoArt: articulo.generoArt,
      tallaArt: articulo.tallaArt,
      colorArt: articulo.colorArt,
      precioArt: articulo.precioArt,
      activo: articulo.activo,
      idCategoria: articulo.idCategoria,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      generoArt: '',
      tallaArt: '',
      colorArt: '',
      precioArt: 0,
      activo: true,
      idCategoria: 0,
    });
    setSelectedArticulo(null);
  };

  const handleCreateCategory = async () => {
    if (!categoryForm.nomCate) {
      Alert.alert('Error', 'Por favor ingresa el nombre de la categoría');
      return;
    }

    try {
      setSaving(true);
      await crearCategoria(categoryForm);
      Alert.alert('Éxito', 'Categoría creada correctamente');
      setShowCategoryModal(false);
      setCategoryForm({ nomCate: '', descCate: '' });
      await cargarDatos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la categoría');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const renderArticuloCard = ({ item }: { item: Articulo }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => {
        setSelectedArticulo(item);
        setShowDetailModal(true);
      }}
    >
      <Card>
        {item.fotoArt && (
          <Image source={{ uri: item.fotoArt }} style={styles.articleImage} resizeMode="cover" />
        )}
        <View style={styles.articleInfo}>
          <Text style={styles.articleName}>{item.nombre}</Text>
          <Text style={styles.articleDetails}>
            {item.generoArt} • Talla: {item.tallaArt} • {item.colorArt}
          </Text>
          <View style={styles.articleFooter}>
            <Text style={styles.articlePrice}>${item.precioArt.toLocaleString()}</Text>
            <View style={[styles.statusBadge, item.activo ? styles.available : styles.rented]}>
              <Text style={styles.statusText}>{item.activo ? 'Disponible' : 'Alquilado'}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B6F47" />
        <Text style={styles.loadingText}>Cargando inventario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📦 Inventario</Text>
        <Text style={styles.headerSubtitle}>{articulos.length} artículos</Text>
      </View>

      <View style={styles.content}>
        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="🔍 Buscar por nombre, talla, color..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          <TouchableOpacity
            style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.idCate}
              style={[styles.categoryChip, selectedCategory === cat.idCate && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat.idCate)}
            >
              <Text
                style={[styles.categoryText, selectedCategory === cat.idCate && styles.categoryTextActive]}
              >
                {cat.nomCate}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addCategoryButton}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={styles.addCategoryText}>+ Nueva</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Articles List */}
        <FlatList
          data={filteredArticulos}
          renderItem={renderArticuloCard}
          keyExtractor={(item) => item.idArt.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron artículos</Text>
            </View>
          }
        />

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            if (navigation) {
              navigation.navigate('AddArticle');
            } else {
              resetForm();
              setShowCreateModal(true);
            }
          }}
        >
          <View style={styles.fabGradient}>
            <Text style={styles.fabText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Create Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Crear Nuevo Artículo</Text>
              
              <Input
                label="Nombre *"
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                placeholder="Ej: Vestido Elegante Rojo"
              />

              <Input
                label="Género"
                value={formData.generoArt}
                onChangeText={(text) => setFormData({ ...formData, generoArt: text })}
                placeholder="Ej: Femenino, Masculino"
              />

              <Input
                label="Talla"
                value={formData.tallaArt}
                onChangeText={(text) => setFormData({ ...formData, tallaArt: text })}
                placeholder="Ej: S, M, L"
              />

              <Input
                label="Color"
                value={formData.colorArt}
                onChangeText={(text) => setFormData({ ...formData, colorArt: text })}
                placeholder="Ej: Rojo, Azul"
              />

              <Input
                label="Precio *"
                value={formData.precioArt.toString()}
                onChangeText={(text) => setFormData({ ...formData, precioArt: parseInt(text) || 0 })}
                placeholder="Ej: 150000"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Categoría *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesSelect}>
                {categorias.map((cat) => (
                  <TouchableOpacity
                    key={cat.idCate}
                    style={[
                      styles.categoryOption,
                      formData.idCategoria === cat.idCate && styles.categoryOptionActive,
                    ]}
                    onPress={() => setFormData({ ...formData, idCategoria: cat.idCate })}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        formData.idCategoria === cat.idCate && styles.categoryOptionTextActive,
                      ]}
                    >
                      {cat.nomCate}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.modalButtons}>
                <Button title="Cancelar" variant="outline" onPress={() => setShowCreateModal(false)} />
                <View style={{ width: spacing.md }} />
                <Button title="Crear" onPress={handleCreate} loading={saving} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}
      <Modal visible={showDetailModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedArticulo && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedArticulo.fotoArt && (
                  <Image
                    source={{ uri: selectedArticulo.fotoArt }}
                    style={styles.detailImage}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.detailTitle}>{selectedArticulo.nombre}</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Género:</Text>
                  <Text style={styles.detailValue}>{selectedArticulo.generoArt}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Talla:</Text>
                  <Text style={styles.detailValue}>{selectedArticulo.tallaArt}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Color:</Text>
                  <Text style={styles.detailValue}>{selectedArticulo.colorArt}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Precio:</Text>
                  <Text style={styles.detailPrice}>${selectedArticulo.precioArt.toLocaleString()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Estado:</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      selectedArticulo.activo ? styles.available : styles.rented,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {selectedArticulo.activo ? 'Disponible' : 'Alquilado'}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalButtons}>
                  <Button
                    title="Cerrar"
                    variant="outline"
                    onPress={() => setShowDetailModal(false)}
                  />
                  <View style={{ width: spacing.md }} />
                  <Button
                    title="Editar"
                    onPress={() => {
                      setShowDetailModal(false);
                      openEditModal(selectedArticulo);
                    }}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Editar Artículo</Text>
              
              <Input
                label="Nombre *"
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
              />

              <Input
                label="Género"
                value={formData.generoArt}
                onChangeText={(text) => setFormData({ ...formData, generoArt: text })}
              />

              <Input
                label="Talla"
                value={formData.tallaArt}
                onChangeText={(text) => setFormData({ ...formData, tallaArt: text })}
              />

              <Input
                label="Color"
                value={formData.colorArt}
                onChangeText={(text) => setFormData({ ...formData, colorArt: text })}
              />

              <Input
                label="Precio *"
                value={formData.precioArt.toString()}
                onChangeText={(text) => setFormData({ ...formData, precioArt: parseInt(text) || 0 })}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Categoría *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesSelect}>
                {categorias.map((cat) => (
                  <TouchableOpacity
                    key={cat.idCate}
                    style={[
                      styles.categoryOption,
                      formData.idCategoria === cat.idCate && styles.categoryOptionActive,
                    ]}
                    onPress={() => setFormData({ ...formData, idCategoria: cat.idCate })}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        formData.idCategoria === cat.idCate && styles.categoryOptionTextActive,
                      ]}
                    >
                      {cat.nomCate}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.modalButtons}>
                <Button title="Cancelar" variant="outline" onPress={() => setShowEditModal(false)} />
                <View style={{ width: spacing.md }} />
                <Button title="Guardar" onPress={handleEdit} loading={saving} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Category Modal */}
      <Modal visible={showCategoryModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Nueva Categoría</Text>
              
              <Input
                label="Nombre de la Categoría *"
                value={categoryForm.nomCate}
                onChangeText={(text) => setCategoryForm({ ...categoryForm, nomCate: text })}
                placeholder="Ej: Vestidos de Noche"
              />

              <Input
                label="Descripción"
                value={categoryForm.descCate}
                onChangeText={(text) => setCategoryForm({ ...categoryForm, descCate: text })}
                placeholder="Ej: Vestidos elegantes para eventos formales"
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalButtons}>
                <Button 
                  title="Cancelar" 
                  variant="outline" 
                  onPress={() => {
                    setShowCategoryModal(false);
                    setCategoryForm({ nomCate: '', descCate: '' });
                  }} 
                />
                <View style={{ width: spacing.md }} />
                <Button 
                  title="Crear Categoría" 
                  onPress={handleCreateCategory} 
                  loading={saving} 
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.xxl + 20,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    backgroundColor: '#f5ead6', // Beige
  },
  headerTitle: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  searchContainer: {
    marginBottom: spacing.md,
  },
  categoriesContainer: {
    marginBottom: spacing.md,
    maxHeight: 50,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: '#8B6F47',
    borderColor: '#8B6F47',
  },
  categoryText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: colors.textWhite,
  },
  addCategoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCategoryText: {
    fontSize: fontSizes.sm,
    color: colors.textWhite,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 80,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  articleCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    maxWidth: '48%',
  },
  articleImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
  },
  articleInfo: {
    padding: spacing.sm,
  },
  articleName: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  articleDetails: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articlePrice: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: '#8B6F47',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  available: {
    backgroundColor: colors.successLight + '20',
  },
  rented: {
    backgroundColor: colors.warningLight + '20',
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    ...shadows.large,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B6F47',
  },
  fabText: {
    fontSize: 32,
    color: colors.textWhite,
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  categoriesSelect: {
    marginBottom: spacing.md,
    maxHeight: 50,
  },
  categoryOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryOptionActive: {
    backgroundColor: '#8B6F47',
    borderColor: '#8B6F47',
  },
  categoryOptionText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryOptionTextActive: {
    color: colors.textWhite,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: spacing.xl,
  },
  detailImage: {
    width: '100%',
    height: 250,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  detailTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  detailPrice: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: '#8B6F47',
  },
});
