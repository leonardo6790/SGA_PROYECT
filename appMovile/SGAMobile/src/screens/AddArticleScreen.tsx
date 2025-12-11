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
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { obtenerCategorias } from '../api/categoriasApi';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../theme/colors';
import { SERVER_BASE_URL, API_BASE_URL, STORAGE_KEYS } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AddArticleScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  
  const [formData, setFormData] = useState({
    nombre: '',
    genero: '',
    talla: '',
    color: '',
    precio: '',
    idCategoria: '',
  });
  
  const [foto, setFoto] = useState<any>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  useEffect(() => {
    cargarCategorias();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita permiso para acceder a la galería');
    }
  };

  const cargarCategorias = async () => {
    try {
      const data = await obtenerCategorias();
      setCategorias(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, idCategoria: data[0].idCate.toString() }));
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      Alert.alert('Error', 'No se pudieron cargar las categorías');
    } finally {
      setLoadingCategorias(false);
    }
  };

  const seleccionarFoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setFoto(asset);
        setPreviewUri(asset.uri);
      }
    } catch (error) {
      console.error('Error al seleccionar foto:', error);
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    }
  };

  const tomarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita permiso para acceder a la cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setFoto(asset);
        setPreviewUri(asset.uri);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validar campos
    if (!formData.nombre || !formData.genero || !formData.talla || !formData.color || !formData.precio || !formData.idCategoria) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!foto) {
      Alert.alert('Error', 'Por favor selecciona una foto del artículo');
      return;
    }

    try {
      setLoading(true);

      // Crear FormData
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('generoArt', formData.genero);
      formDataToSend.append('tallaArt', formData.talla);
      formDataToSend.append('colorArt', formData.color);
      formDataToSend.append('precioArt', parseInt(formData.precio));
      formDataToSend.append('idCategoria', parseInt(formData.idCategoria));

      // Agregar la foto
      const uriParts = foto.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formDataToSend.append('fotoArt', {
        uri: foto.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);

      // Obtener token
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      if (!token) {
        Alert.alert('Error', 'No hay sesión activa. Por favor inicia sesión nuevamente.');
        return;
      }

      console.log('Enviando al backend con token:', token?.substring(0, 20) + '...');

      // Enviar al backend
      const response = await fetch(`${API_BASE_URL}/articulos/CrearConFoto`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`,
          // NO incluir Content-Type cuando usas FormData
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        if (response.status === 401) {
          Alert.alert('Sesión expirada', 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          return;
        }
        
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Artículo creado:', responseData);

      Alert.alert('Éxito', 'Artículo creado exitosamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Error al crear artículo:', error);
      Alert.alert('Error', `No se pudo crear el artículo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategorias) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B6F47" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎯 Agregar Artículo</Text>
        <Text style={styles.headerSubtitle}>Completa la información del nuevo artículo</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Foto */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Foto del Artículo *</Text>
          
          {previewUri && (
            <Image source={{ uri: previewUri }} style={styles.preview} />
          )}

          <View style={styles.photoButtons}>
            <TouchableOpacity
              style={[styles.photoButton, styles.photoButtonPrimary]}
              onPress={seleccionarFoto}
            >
              <Text style={styles.photoButtonText}>📷 Galería</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.photoButton, styles.photoButtonSecondary]}
              onPress={tomarFoto}
            >
              <Text style={styles.photoButtonText}>📸 Cámara</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Información Básica */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Información del Artículo</Text>

          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            value={formData.nombre}
            onChangeText={(text) => handleInputChange('nombre', text)}
            placeholder="Ej: Vestido de noche"
          />

          <Text style={styles.label}>Género *</Text>
          <TextInput
            style={styles.input}
            value={formData.genero}
            onChangeText={(text) => handleInputChange('genero', text)}
            placeholder="Ej: Femenino, Masculino, Unisex"
          />

          <Text style={styles.label}>Talla *</Text>
          <TextInput
            style={styles.input}
            value={formData.talla}
            onChangeText={(text) => handleInputChange('talla', text)}
            placeholder="Ej: S, M, L, XL"
          />

          <Text style={styles.label}>Color *</Text>
          <TextInput
            style={styles.input}
            value={formData.color}
            onChangeText={(text) => handleInputChange('color', text)}
            placeholder="Ej: Rojo, Azul, Negro"
          />

          <Text style={styles.label}>Precio *</Text>
          <TextInput
            style={styles.input}
            value={formData.precio}
            onChangeText={(text) => handleInputChange('precio', text)}
            placeholder="0"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Categoría *</Text>
          <View style={styles.pickerContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categorias.map((cat) => (
                <TouchableOpacity
                  key={cat.idCate}
                  style={[
                    styles.categoryButton,
                    formData.idCategoria === cat.idCate.toString() && styles.categoryButtonActive
                  ]}
                  onPress={() => handleInputChange('idCategoria', cat.idCate.toString())}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    formData.idCategoria === cat.idCate.toString() && styles.categoryButtonTextActive
                  ]}>
                    {cat.nomCate}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textWhite} />
            ) : (
              <Text style={styles.submitButtonText}>Crear Artículo</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.xxl + 20,
    backgroundColor: '#f5ead6', // Beige
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: fontSizes.md,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  cardTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    backgroundColor: colors.gray100,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  photoButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.small,
  },
  photoButtonPrimary: {
    backgroundColor: '#8B6F47',
  },
  photoButtonSecondary: {
    backgroundColor: '#A0826D',
  },
  photoButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
    fontSize: fontSizes.md,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  pickerContainer: {
    marginTop: spacing.xs,
  },
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  categoryButtonActive: {
    backgroundColor: '#8B6F47',
    borderColor: '#8B6F47',
  },
  categoryButtonText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: colors.textWhite,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.small,
  },
  cancelButton: {
    backgroundColor: colors.gray200,
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: fontSizes.md,
  },
  submitButton: {
    backgroundColor: '#8B6F47',
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray400,
  },
  submitButtonText: {
    color: colors.textWhite,
    fontWeight: '600',
    fontSize: fontSizes.md,
  },
});
