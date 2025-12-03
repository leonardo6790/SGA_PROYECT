import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { obtenerClientes } from '../api/clientesApi';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

export const NewRentScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [documento, setDocumento] = useState('');
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteEncontrado, setClienteEncontrado] = useState<any>(null);
  const [mensaje, setMensaje] = useState('Por favor escribe el documento');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    if (documento.length >= 7) {
      buscarCliente();
    } else {
      setClienteEncontrado(null);
      setMensaje('Por favor escribe el documento');
    }
  }, [documento, clientes]);

  const cargarClientes = async () => {
    try {
      const data = await obtenerClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscarCliente = () => {
    const user = clientes.find((e) => String(e.doc) === documento.trim());
    if (user) {
      setClienteEncontrado(user);
      setMensaje('El cliente ha sido encontrado en la base de datos');
    } else {
      setClienteEncontrado(null);
      setMensaje('Cliente no encontrado :(');
    }
  };


  const handleContinuar = () => {
    if (clienteEncontrado) {
      // Navegar a la pantalla de nueva orden con los datos del cliente
      navigation.navigate('NewOrder', { cliente: clienteEncontrado });
    } else {
      // Navegar a la pantalla de nuevo cliente con el documento
      navigation.navigate('NewClient', { documento: documento });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.formSection}>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Por favor, Ingresa el documento</Text>
            <Text style={styles.label}>Cédula de Ciudadanía</Text>

            <TextInput
              style={styles.input}
              placeholder="Escribe aquí..."
              value={documento}
              onChangeText={setDocumento}
              keyboardType="numeric"
              maxLength={10}
              onSubmitEditing={handleContinuar}
            />

            <TouchableOpacity 
              style={styles.button}
              onPress={handleContinuar}
            >
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>

            <View style={styles.statusSection}>
              <Text style={styles.statusIcon}>
                {clienteEncontrado ? '✅' : documento.length >= 7 ? '❌' : '📄'}
              </Text>
              <Text style={[
                styles.statusText,
                clienteEncontrado && styles.statusTextSuccess,
                !clienteEncontrado && documento.length >= 7 && styles.statusTextError
              ]}>
                {mensaje}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
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
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  formSection: {
    width: '100%',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  buttonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  statusSection: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  statusIcon: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  statusText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statusTextSuccess: {
    color: COLORS.success,
    fontWeight: '600',
  },
  statusTextError: {
    color: COLORS.danger,
    fontWeight: '600',
  },
});
