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
} from 'react-native';
import { crearCliente } from '../api/clientesApi';
import { obtenerBarrios } from '../api/barriosApi';
import { obtenerTiposDoc } from '../api/tipoDocApi';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

export const NewClientScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const documentoRecibido = route.params?.documento || '';
  
  const [barrios, setBarrios] = useState<any[]>([]);
  const [tiposDoc, setTiposDoc] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    doc: documentoRecibido,
    nomcli1: '',
    nomcli2: '',
    apecli1: '',
    apecli2: '',
    direCli: '',
    numeroCli: '',
    correoElectronico: '',
    idBarrio: '',
    idTipoDoc: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [barriosData, tiposDocData] = await Promise.all([
        obtenerBarrios(),
        obtenerTiposDoc()
      ]);
      setBarrios(barriosData);
      setTiposDoc(tiposDocData);
      
      if (barriosData.length > 0) {
        setFormData(prev => ({ ...prev, idBarrio: String(barriosData[0].idBarrio) }));
      }
      if (tiposDocData.length > 0) {
        setFormData(prev => ({ ...prev, idTipoDoc: String(tiposDocData[0].id_tipoDoc) }));
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos necesarios');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCrearCliente = async () => {
    // Validar campos requeridos
    if (!formData.doc || !formData.nomcli1 || !formData.apecli1 || !formData.numeroCli || 
        !formData.correoElectronico || !formData.direCli) {
      Alert.alert('Error', 'Por favor complete los campos obligatorios');
      return;
    }

    if (!formData.idBarrio || !formData.idTipoDoc) {
      Alert.alert('Error', 'Por favor seleccione el barrio y el tipo de documento');
      return;
    }

    try {
      setLoading(true);
      
      const clienteData = {
        doc: parseInt(formData.doc),
        nomcli1: formData.nomcli1,
        nomcli2: formData.nomcli2 || null,
        apecli1: formData.apecli1,
        apecli2: formData.apecli2 || null,
        direCli: formData.direCli,
        numeroCli: parseInt(formData.numeroCli),
        correoElectronico: formData.correoElectronico,
        idBarrio: parseInt(formData.idBarrio),
        idTipoDoc: parseInt(formData.idTipoDoc),
      };

      const response = await crearCliente(clienteData);
      
      Alert.alert('Éxito', 'Cliente registrado exitosamente', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('NewOrder', { cliente: response }),
        },
      ]);
    } catch (error: any) {
      console.error('Error al crear cliente:', error);
      Alert.alert('Error', 'No se pudo registrar el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Registrar nuevo cliente</Text>
          <Text style={styles.subtitle}>Ingrese los datos del cliente para agregarlo al sistema</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Primer Nombre *</Text>
              <TextInput
                style={styles.input}
                value={formData.nomcli1}
                onChangeText={(value) => handleChange('nomcli1', value)}
                placeholder="Primer nombre"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Segundo Nombre</Text>
              <TextInput
                style={styles.input}
                value={formData.nomcli2}
                onChangeText={(value) => handleChange('nomcli2', value)}
                placeholder="Segundo nombre"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Primer Apellido *</Text>
              <TextInput
                style={styles.input}
                value={formData.apecli1}
                onChangeText={(value) => handleChange('apecli1', value)}
                placeholder="Primer apellido"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Segundo Apellido</Text>
              <TextInput
                style={styles.input}
                value={formData.apecli2}
                onChangeText={(value) => handleChange('apecli2', value)}
                placeholder="Segundo apellido"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Documento *</Text>
              <TextInput
                style={[styles.input, documentoRecibido && styles.inputDisabled]}
                value={formData.doc}
                onChangeText={(value) => handleChange('doc', value)}
                placeholder="Documento"
                keyboardType="numeric"
                editable={!documentoRecibido}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Tipo Documento *</Text>
              <View style={styles.pickerContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {tiposDoc.map((tipo) => (
                    <TouchableOpacity
                      key={`tipo-${tipo.id_tipoDoc}`}
                      style={[
                        styles.pickerOption,
                        formData.idTipoDoc === String(tipo.id_tipoDoc) && styles.pickerOptionSelected
                      ]}
                      onPress={() => handleChange('idTipoDoc', String(tipo.id_tipoDoc))}
                    >
                      <Text style={[
                        styles.pickerText,
                        formData.idTipoDoc === String(tipo.id_tipoDoc) && styles.pickerTextSelected
                      ]}>
                        {tipo.nomDoc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>

          <View style={styles.fieldFull}>
            <Text style={styles.label}>Teléfono *</Text>
            <TextInput
              style={styles.input}
              value={formData.numeroCli}
              onChangeText={(value) => handleChange('numeroCli', value)}
              placeholder="Teléfono"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.fieldFull}>
            <Text style={styles.label}>Correo Electrónico *</Text>
            <TextInput
              style={styles.input}
              value={formData.correoElectronico}
              onChangeText={(value) => handleChange('correoElectronico', value)}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldFull}>
            <Text style={styles.label}>Dirección *</Text>
            <TextInput
              style={styles.input}
              value={formData.direCli}
              onChangeText={(value) => handleChange('direCli', value)}
              placeholder="Dirección"
            />
          </View>

          <View style={styles.fieldFull}>
            <Text style={styles.label}>Barrio *</Text>
            <View style={styles.pickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {barrios.map((barrio) => (
                  <TouchableOpacity
                    key={`barrio-${barrio.idBarrio}`}
                    style={[
                      styles.pickerOption,
                      formData.idBarrio === String(barrio.idBarrio) && styles.pickerOptionSelected
                    ]}
                    onPress={() => handleChange('idBarrio', String(barrio.idBarrio))}
                  >
                    <Text style={[
                      styles.pickerText,
                      formData.idBarrio === String(barrio.idBarrio) && styles.pickerTextSelected
                    ]}>
                      {barrio.nombreBarrio}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleCrearCliente}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonTextPrimary}>Guardar cliente</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonGhost]}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.buttonTextGhost}>Cancelar</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  field: {
    flex: 1,
  },
  fieldFull: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  inputDisabled: {
    backgroundColor: COLORS.light,
    color: COLORS.textSecondary,
  },
  pickerContainer: {
    marginBottom: SPACING.xs,
  },
  pickerOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.xs,
  },
  pickerOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pickerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  pickerTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  actions: {
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  button: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonTextPrimary: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
  },
  buttonTextGhost: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
});
