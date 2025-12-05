import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

interface PublicHomeScreenProps {
  navigation: any;
}

export const PublicHomeScreen: React.FC<PublicHomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#9b59b6', '#8e44ad']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroIcon}>👗</Text>
            <Text style={styles.heroTitle}>SGA</Text>
            <Text style={styles.heroSubtitle}>
              Sistema de Gestión de Alquileres
            </Text>
            <Text style={styles.heroDescription}>
              Alquila los mejores vestidos para tus ocasiones especiales
            </Text>
          </View>
        </LinearGradient>

        {/* Información Principal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Quiénes Somos?</Text>
          <Text style={styles.sectionText}>
            En SGA, creemos que cada ocasión merece un estilo único. Nos especializamos en el 
            alquiler de vestidos elegantes y modernos, ofreciendo una experiencia práctica y 
            accesible para que brilles sin preocuparte por repetir atuendo o gastar de más.
          </Text>
        </View>

        {/* Características */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Nuestras Características</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureTitle}>Variedad de Estilos</Text>
            <Text style={styles.featureText}>
              Elegantes, casuales, de gala, cóctel y temáticos
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureTitle}>Precios Accesibles</Text>
            <Text style={styles.featureText}>
              Alquila sin preocuparte por gastar de más
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureTitle}>Fácil de Usar</Text>
            <Text style={styles.featureText}>
              Gestiona tus alquileres desde tu celular
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>⭐</Text>
            <Text style={styles.featureTitle}>Calidad Garantizada</Text>
            <Text style={styles.featureText}>
              Todos nuestros vestidos están en perfecto estado
            </Text>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>¿Listo para explorar?</Text>
          <Text style={styles.ctaText}>
            Explora nuestro catálogo de vestidos y encuentra el estilo perfecto para tu ocasión
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('PublicCatalog')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#9b59b6', '#8e44ad']}
              style={styles.ctaButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.ctaButtonText}>Ver Catálogo</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerIcon}>📍</Text>
          <Text style={styles.footerTitle}>Encuéntranos</Text>
          <Text style={styles.footerText}>
            Estamos listos para servircte con los mejores vestidos para tus eventos
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  heroSection: {
    paddingVertical: SPACING.xl * 2,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIcon: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  heroTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    marginBottom: SPACING.md,
    fontWeight: '600',
  },
  heroDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  sectionText: {
    fontSize: FONT_SIZES.md,
    color: '#666',
    lineHeight: 24,
  },
  featuresSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  featureIcon: {
    fontSize: FONT_SIZES.xxxl,
    marginBottom: SPACING.sm,
  },
  featureTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  featureText: {
    fontSize: FONT_SIZES.sm,
    color: '#666',
    lineHeight: 20,
  },
  ctaSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: FONT_SIZES.md,
    color: '#666',
    marginBottom: SPACING.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaButton: {
    width: '100%',
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  ctaButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  footerInfo: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerIcon: {
    fontSize: FONT_SIZES.xxxl,
    marginBottom: SPACING.md,
  },
  footerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
