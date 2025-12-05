import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    try {
      const userStr = await AsyncStorage.getItem('@sga_user');
      setDebugInfo(userStr || 'No hay datos en AsyncStorage');
      console.log('👤 Datos del usuario en AsyncStorage:', userStr);
      console.log('👤 Datos del usuario en contexto:', user);
    } catch (error) {
      console.error('Error al cargar debug info:', error);
    }
  };

  // Debug: Ver qué datos tiene el usuario
  console.log('👤 Datos del usuario en perfil:', user);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleClearCacheAndLogout = () => {
    Alert.alert(
      'Limpiar Caché',
      'Esto cerrará tu sesión y limpiará todos los datos almacenados. Deberás iniciar sesión nuevamente para cargar los datos actualizados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar y Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              console.log('✅ Caché limpiado');
              await logout();
            } catch (error) {
              console.error('Error al limpiar caché:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.rol}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Cuenta</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Usuario</Text>
            <Text style={styles.infoValue}>{user?.username}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Rol</Text>
            <Text style={styles.infoValue}>{user?.rol}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Estado</Text>
            <View style={[styles.statusBadge, user?.activo ? styles.activeStatus : styles.inactiveStatus]}>
              <Text style={styles.statusText}>
                {user?.activo ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{user?.tipoDoc || 'Documento'}</Text>
            <Text style={styles.infoValue}>{user?.numDoc || 'No disponible'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoValue}>{user?.numTel || 'No disponible'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Dirección</Text>
            <Text style={styles.infoValue}>{user?.direccion || 'No disponible'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Barrio</Text>
            <Text style={styles.infoValue}>{user?.barrio || 'No disponible'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={loadDebugInfo}>
            <Text style={styles.menuItemText}>🔄 Recargar Datos</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>📱 Notificaciones</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>🔒 Privacidad</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>ℹ️ Acerca de</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.clearButton} onPress={handleClearCacheAndLogout}>
          <Text style={styles.clearButtonText}>🗑️ Limpiar Caché y Cerrar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versión 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxxl * 1.5,
    fontWeight: '700',
    color: COLORS.white,
  },
  name: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  roleBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  roleText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  activeStatus: {
    backgroundColor: COLORS.success + '20',
  },
  inactiveStatus: {
    backgroundColor: COLORS.danger + '20',
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  menuItemArrow: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.gray,
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoutButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  clearButton: {
    backgroundColor: COLORS.warning,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  clearButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  version: {
    textAlign: 'center',
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
});
