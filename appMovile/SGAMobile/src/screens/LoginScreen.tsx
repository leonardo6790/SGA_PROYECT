import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

type LoginMode = 'selection' | 'staff-selection' | 'admin' | 'seller' | 'customer';

export const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [mode, setMode] = useState<LoginMode>('selection');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { username: '', password: '' };

    if (!username.trim()) {
      newErrors.username = 'El correo electrónico es requerido';
      valid = false;
    } else if (!username.includes('@')) {
      newErrors.username = 'Ingresa un correo electrónico válido';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
      valid = false;
    } else if (password.length < 3) {
      newErrors.password = 'La contraseña debe tener al menos 3 caracteres';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login({ username: username.trim(), password });
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'No se pudo iniciar sesión. Verifica tus credenciales.'
      );
    }
  };

  // Renderizar pantalla de selección
  if (mode === 'selection') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.gradientBackground}
        >
          <ScrollView 
            contentContainerStyle={styles.selectionContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.mainLogo}>🏪</Text>
              <Text style={styles.mainTitle}>SGA Mobile</Text>
              <Text style={styles.mainSubtitle}>Sistema de Gestión de Alquileres</Text>
            </View>

            <View style={styles.selectionOptions}>
              <Text style={styles.selectionTitle}>Selecciona tu tipo de acceso</Text>
              
              {/* Card Personal (Admin/Vendedor) */}
              <TouchableOpacity 
                style={styles.roleCard}
                onPress={() => setMode('staff-selection')}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#9b59b6', '#8e44ad']}
                  style={styles.roleGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.roleHeader}>
                    <View style={styles.roleIconWrapper}>
                      <Text style={styles.roleIcon}>👔</Text>
                    </View>
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleBadgeText}>PERSONAL</Text>
                    </View>
                  </View>
                  <Text style={styles.roleTitle}>Personal</Text>
                  <Text style={styles.roleDescription}>
                    Acceso para administradores y vendedores
                  </Text>
                  <View style={styles.divider} />
                  <View style={styles.roleFeatures}>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>👑</Text>
                      <Text style={styles.featureText}>Administrador</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>👨‍💼</Text>
                      <Text style={styles.featureText}>Vendedor</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>📋</Text>
                      <Text style={styles.featureText}>Gestión</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>📊</Text>
                      <Text style={styles.featureText}>Reportes</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Card Cliente */}
              <TouchableOpacity 
                style={styles.roleCard}
                onPress={() => setMode('customer')}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#27ae60', '#229954']}
                  style={styles.roleGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.roleHeader}>
                    <View style={styles.roleIconWrapper}>
                      <Text style={styles.roleIcon}>👤</Text>
                    </View>
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleBadgeText}>CLIENTE</Text>
                    </View>
                  </View>
                  <Text style={styles.roleTitle}>Cliente</Text>
                  <Text style={styles.roleDescription}>
                    Explora y alquila productos
                  </Text>
                  <View style={styles.divider} />
                  <View style={styles.roleFeatures}>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>🏪</Text>
                      <Text style={styles.featureText}>Catálogo</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>🔍</Text>
                      <Text style={styles.featureText}>Búsqueda</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>📱</Text>
                      <Text style={styles.featureText}>Mis Pedidos</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>⭐</Text>
                      <Text style={styles.featureText}>Favoritos</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2025 SGA Mobile • Versión 1.0
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Renderizar pantalla de selección Staff (Admin/Vendedor)
  if (mode === 'staff-selection') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#0d0d0d', '#1a1a1a']}
          style={styles.gradientBackground}
        >
          <ScrollView 
            contentContainerStyle={styles.selectionContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => setMode('selection')} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Volver</Text>
              </TouchableOpacity>
              <Text style={styles.mainLogo}>👔</Text>
              <Text style={styles.mainTitle}>Tipo de Personal</Text>
              <Text style={styles.mainSubtitle}>Selecciona tu rol en el sistema</Text>
            </View>

            <View style={styles.selectionOptions}>
              {/* Card Admin */}
              <TouchableOpacity 
                style={styles.roleCard}
                onPress={() => setMode('admin')}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#e74c3c', '#c0392b']}
                  style={styles.roleGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.roleHeader}>
                    <View style={styles.roleIconWrapper}>
                      <Text style={styles.roleIcon}>👑</Text>
                    </View>
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleBadgeText}>ADMIN</Text>
                    </View>
                  </View>
                  <Text style={styles.roleTitle}>Administrador</Text>
                  <Text style={styles.roleDescription}>
                    Control total del sistema
                  </Text>
                  <View style={styles.divider} />
                  <View style={styles.roleFeatures}>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>📊</Text>
                      <Text style={styles.featureText}>Reportes</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>👥</Text>
                      <Text style={styles.featureText}>Usuarios</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>⚙️</Text>
                      <Text style={styles.featureText}>Configuración</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>📋</Text>
                      <Text style={styles.featureText}>Inventario</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>📄</Text>
                      <Text style={styles.featureText}>Órdenes</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>💰</Text>
                      <Text style={styles.featureText}>Finanzas</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Card Vendedor */}
              <TouchableOpacity 
                style={styles.roleCard}
                onPress={() => setMode('seller')}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#9b59b6', '#8e44ad']}
                  style={styles.roleGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.roleHeader}>
                    <View style={styles.roleIconWrapper}>
                      <Text style={styles.roleIcon}>👨‍💼</Text>
                    </View>
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleBadgeText}>VENDEDOR</Text>
                    </View>
                  </View>
                  <Text style={styles.roleTitle}>Vendedor</Text>
                  <Text style={styles.roleDescription}>
                    Gestión de ventas y clientes
                  </Text>
                  <View style={styles.divider} />
                  <View style={styles.roleFeatures}>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>📋</Text>
                      <Text style={styles.featureText}>Inventario</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>📄</Text>
                      <Text style={styles.featureText}>Órdenes</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>👥</Text>
                      <Text style={styles.featureText}>Clientes</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>💳</Text>
                      <Text style={styles.featureText}>Pagos</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>📦</Text>
                      <Text style={styles.featureText}>Entregas</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureIcon}>🏷️</Text>
                      <Text style={styles.featureText}>Categorías</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2025 SGA Mobile • Versión 1.0
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Renderizar formulario de login
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0d0d0d', '#1a1a1a']}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <TouchableOpacity onPress={() => setMode('selection')} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>
            <Text style={styles.logo}>
              {mode === 'admin' ? '👑' : mode === 'seller' ? '👨‍💼' : '👤'}
            </Text>
            <Text style={styles.title}>
              {mode === 'admin' ? 'Portal de Administrador' : mode === 'seller' ? 'Portal de Vendedores' : 'Acceso Cliente'}
            </Text>
            <Text style={styles.subtitle}>
              {mode === 'admin' 
                ? 'Acceso completo al sistema' 
                : mode === 'seller' 
                ? 'Ingresa con tu cuenta de vendedor' 
                : 'Bienvenido de nuevo'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Correo electrónico"
              placeholder="ejemplo@correo.com"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setErrors({ ...errors, username: '' });
              }}
              error={errors.username}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />

            <Input
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              secureTextEntry
            />

            <Button
              title={isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              fullWidth
              style={styles.loginButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Sistema de Gestión de Alquileres v1.0
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  selectionContainer: {
    flexGrow: 1,
    padding: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  mainLogo: {
    fontSize: 50,
    marginBottom: SPACING.xs,
  },
  mainTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: SPACING.xs / 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  mainSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  selectionOptions: {
    marginBottom: SPACING.md,
  },
  selectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  roleCard: {
    marginBottom: SPACING.md,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  roleGradient: {
    padding: SPACING.lg,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  roleIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  roleIcon: {
    fontSize: 28,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  roleBadgeText: {
    fontSize: FONT_SIZES.xs - 2,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  roleTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: SPACING.xs / 2,
  },
  roleDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: SPACING.sm,
  },
  roleFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  featureIcon: {
    fontSize: 14,
    marginRight: SPACING.xs / 2,
  },
  featureText: {
    fontSize: FONT_SIZES.xs - 1,
    color: COLORS.white,
    fontWeight: '600',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    fontWeight: '600',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl * 2,
  },
  logo: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: SPACING.xl,
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  footerText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    opacity: 0.7,
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
    padding: SPACING.sm,
  },
  backButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    fontWeight: '600',
  },
});
