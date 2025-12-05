import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { articulosService } from '../services/articulosService';
import { Categoria } from '../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';
import { LinearGradient } from 'expo-linear-gradient';

interface CategoryWithInfo extends Categoria {
  description: string;
  icon: string;
  gradient: [string, string];
}

export const CatalogScreen: React.FC = () => {
  const [categorias, setCategorias] = useState<CategoryWithInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const data = await articulosService.getCategorias();
      
      // Mapear categorías con información adicional
      const categoriasConInfo: CategoryWithInfo[] = data.map((cat, index) => ({
        ...cat,
        description: getDescriptionForCategory(cat.nombreCategoria),
        icon: getIconForCategory(cat.nombreCategoria),
        gradient: getGradientForCategory(index),
      }));
      
      setCategorias(categoriasConInfo);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDescriptionForCategory = (nombre: string): string => {
    const descriptions: { [key: string]: string } = {
      'Vestidos': 'Alquila, deslumbra y repite',
      'Trajes': 'Tu evento, tu estilo, nuestro traje',
      'Accesorios': 'Detalles que hacen la diferencia',
      'Niños': 'Vestidos y trajes que hacen de cada ocasión un cuento',
      'Caballero': 'Elegancia y distinción para cada evento',
      'Dama': 'Sofisticación y glamour en cada detalle',
    };
    return descriptions[nombre] || 'Explora nuestra colección';
  };

  const getIconForCategory = (nombre: string): string => {
    const icons: { [key: string]: string } = {
      'Vestidos': '👗',
      'Trajes': '🤵',
      'Accesorios': '👜',
      'Niños': '👶',
      'Caballero': '🎩',
      'Dama': '💃',
    };
    return icons[nombre] || '🏷️';
  };

  const getGradientForCategory = (index: number): [string, string] => {
    const gradients: [string, string][] = [
      ['#667eea', '#764ba2'], // Morado
      ['#f093fb', '#f5576c'], // Rosa
      ['#4facfe', '#00f2fe'], // Azul
      ['#43e97b', '#38f9d7'], // Verde
      ['#fa709a', '#fee140'], // Naranja-Rosa
      ['#30cfd0', '#330867'], // Azul oscuro
    ];
    return gradients[index % gradients.length];
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Nuestros Productos</Text>
          <Text style={styles.subtitle}>Explora nuestras categorías</Text>
        </View>

        {categorias.map((categoria, index) => (
          <TouchableOpacity
            key={categoria.id}
            style={styles.categoryContainer}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={categoria.gradient}
              style={[
                styles.categoryCard,
                index % 2 === 1 && styles.categoryCardReverse
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={[
                styles.categoryInfo,
                index % 2 === 1 && styles.categoryInfoReverse
              ]}>
                <View style={styles.categoryIcon}>
                  <Text style={styles.iconText}>{categoria.icon}</Text>
                </View>
                <Text style={styles.categoryTitle}>{categoria.nombreCategoria}</Text>
                <Text style={styles.categoryDescription}>{categoria.description}</Text>
                <View style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>Ver Productos →</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💎 Encuentra el estilo perfecto para tu ocasión especial
          </Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  categoryContainer: {
    marginBottom: SPACING.lg,
  },
  categoryCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    minHeight: 200,
    justifyContent: 'center',
  },
  categoryCardReverse: {
    // Para alternar el diseño
  },
  categoryInfo: {
    alignItems: 'flex-start',
  },
  categoryInfoReverse: {
    alignItems: 'flex-end',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconText: {
    fontSize: 30,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  categoryDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.md,
  },
  viewButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  viewButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  footer: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
