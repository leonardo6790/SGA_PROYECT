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
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';

interface PrivateLoginScreenProps {
  navigation?: any;
}

export const PrivateLoginScreen: React.FC<PrivateLoginScreenProps> = ({ navigation }) => {
  const { login, isLoading } = useAuth();
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.gradientBackground}
        >
          <ScrollView
            contentContainerStyle={styles.loginContainer}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation?.goBack();
              }}
            >
              <Text style={styles.backButtonText}>← Atrás</Text>
            </TouchableOpacity>

            <View style={styles.loginHeader}>
              <Text style={styles.loginIcon}>👤</Text>
              <Text style={styles.loginTitle}>Iniciar Sesión</Text>
              <Text style={styles.loginSubtitle}>
                Inicia sesión con tu cuenta
              </Text>
            </View>

            <View style={styles.loginForm}>
              <Input
                label="Correo Electrónico"
                placeholder="admin@ejemplo.com"
                value={username}
                onChangeText={setUsername}
                error={errors.username}
                keyboardType="email-address"
                editable={!isLoading}
              />

              <Input
                label="Contraseña"
                placeholder="Tu contraseña"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry
                editable={!isLoading}
              />

              <Button
                title={isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                fullWidth
              />
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Credenciales de Prueba</Text>
              <Text style={styles.infoText}>
                Admin:{'\n'}
                Email: admin@ejemplo.com{'\n'}
                Contraseña: admin123{'\n\n'}
                Vendedor:{'\n'}
                Email: vendedor@ejemplo.com{'\n'}
                Contraseña: vendedor123
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  loginContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  backButton: {
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  backButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    fontWeight: '600',
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  loginIcon: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  loginTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  loginSubtitle: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.9)',
  },
  loginForm: {
    marginVertical: SPACING.lg,
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
  },
  infoTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
});

export default PrivateLoginScreen;
