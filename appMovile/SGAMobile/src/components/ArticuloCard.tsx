import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Articulo } from '../types';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES } from '../utils/constants';

interface ArticuloCardProps {
  articulo: Articulo;
  onPress: (articulo: Articulo) => void;
}

export const ArticuloCard: React.FC<ArticuloCardProps> = ({ articulo, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(articulo)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {articulo.foto ? (
          <Image
            source={{ uri: articulo.foto }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>📦</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {articulo.nombreArticulo}
        </Text>
        
        <Text style={styles.category}>
          {articulo.categoria.nombreCategoria}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {articulo.descripcion}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.price}>
            ${articulo.valorAlquiler.toLocaleString('es-CO')}
          </Text>
          
          <View style={[
            styles.stockBadge,
            articulo.stock > 0 ? styles.inStock : styles.outOfStock
          ]}>
            <Text style={styles.stockText}>
              {articulo.stock > 0 ? `Stock: ${articulo.stock}` : 'Agotado'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.light,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
  },
  placeholderText: {
    fontSize: 64,
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  category: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.success,
  },
  stockBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  inStock: {
    backgroundColor: COLORS.success + '20',
  },
  outOfStock: {
    backgroundColor: COLORS.danger + '20',
  },
  stockText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
});
