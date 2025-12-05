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
  Modal,
  FlatList,
} from 'react-native';
import { crearCliente, actualizarCliente } from '../api/clientesApi';
import { obtenerBarrios } from '../api/barriosApi';
import { obtenerTiposDoc } from '../api/tipoDocApi';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/constants';

export const NewClientScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const documentoRecibido = route.params?.documento || '';
  const clienteEditar = route.params?.cliente || null;
  
  const [barrios, setBarrios] = useState<any[]>([]);
  const [tiposDoc, setTiposDoc] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tiposDocFiltered, setTiposDocFiltered] = useState<any[]>([]);
  const [showTiposDocDropdown, setShowTiposDocDropdown] = useState(false);
  const [tiposDocSearch, setTiposDocSearch] = useState('');
  const [barriosFiltered, setBarriosFiltered] = useState<any[]>([]);
  const [showBarriosDropdown, setShowBarriosDropdown] = useState(false);
  const [barriosSearch, setBarriosSearch] = useState('');
  
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

  // Reinicializar filtros cuando se abren los modales
  useEffect(() => {
    if (showTiposDocDropdown && tiposDoc.length > 0) {
      setTiposDocSearch('');
      setTiposDocFiltered(tiposDoc.filter(doc => {
        const id = doc.idTipoDoc || doc.id_tipoDoc;
        const nom = doc.nomDoc || doc.nomTipoDoc;
        return doc && id && nom;
      }));
    }
  }, [showTiposDocDropdown, tiposDoc]);

  useEffect(() => {
    if (showBarriosDropdown && barrios.length > 0) {
      setBarriosSearch('');
      setBarriosFiltered(barrios.filter(barrio => barrio && barrio.idBarrio && (barrio.nomBarrio || barrio.nombreBarrio)));
    }
  }, [showBarriosDropdown, barrios]);

  const cargarDatos = async () => {
    try {
      const [barriosData, tiposDocData] = await Promise.all([
        obtenerBarrios(),
        obtenerTiposDoc()
      ]);
      
      console.log('Barrios cargados:', barriosData);
      console.log('Tipos de documento cargados:', tiposDocData);
      
      setBarrios(barriosData);
      setTiposDoc(tiposDocData);
      setTiposDocFiltered(tiposDocData.filter(doc => {
        const id = doc.idTipoDoc || doc.id_tipoDoc;
        const nom = doc.nomDoc || doc.nomTipoDoc;
        return doc && id && nom;
      }));
      setBarriosFiltered(barriosData.filter(barrio => barrio && barrio.idBarrio && (barrio.nomBarrio || barrio.nombreBarrio)));
      
      // Si es edición, cargar datos del cliente
      if (clienteEditar) {
        setFormData({
          doc: clienteEditar.documento?.toString() || '',
          nomcli1: clienteEditar.primerNombre || '',
          nomcli2: clienteEditar.segundoNombre || '',
          apecli1: clienteEditar.primerApellido || '',
          apecli2: clienteEditar.segundoApellido || '',
          direCli: clienteEditar.direccion || '',
          numeroCli: clienteEditar.telefono?.toString() || '',
          correoElectronico: clienteEditar.email || '',
          idBarrio: clienteEditar.barrio?.id?.toString() || (barriosData.length > 0 ? String(barriosData[0].idBarrio) : ''),
          idTipoDoc: clienteEditar.tipoDocumento?.id?.toString() || (tiposDocData.length > 0 ? String(tiposDocData[0].idTipoDoc || tiposDocData[0].id_tipoDoc) : ''),
        });
      } else {
        if (barriosData.length > 0) {
          setFormData(prev => ({ ...prev, idBarrio: String(barriosData[0].idBarrio) }));
        }
        if (tiposDocData.length > 0) {
          setFormData(prev => ({ ...prev, idTipoDoc: String(tiposDocData[0].idTipoDoc || tiposDocData[0].id_tipoDoc) }));
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos necesarios');
    }
  };

  const handleTiposDocSearch = (text: string) => {
    setTiposDocSearch(text);
    const validDocs = tiposDoc.filter(doc => {
      const id = doc.idTipoDoc || doc.id_tipoDoc;
      const nom = doc.nomDoc || doc.nomTipoDoc;
      return doc && id && nom;
    });
    if (text.trim() === '') {
      setTiposDocFiltered(validDocs);
    } else {
      const filtered = validDocs.filter(doc => {
        const nom = doc.nomDoc || doc.nomTipoDoc || '';
        return nom.toLowerCase().includes(text.toLowerCase());
      });
      setTiposDocFiltered(filtered);
    }
  };

  const handleSelectTipoDoc = (id: number) => {
    handleChange('idTipoDoc', String(id));
    setShowTiposDocDropdown(false);
    setTiposDocSearch('');
    setTiposDocFiltered([]);
  };

  const handleBarriosSearch = (text: string) => {
    setBarriosSearch(text);
    const validBarrios = barrios.filter(barrio => barrio && barrio.idBarrio && (barrio.nomBarrio || barrio.nombreBarrio));
    if (text.trim() === '') {
      setBarriosFiltered(validBarrios);
    } else {
      const filtered = validBarrios.filter(barrio =>
        (barrio.nomBarrio || barrio.nombreBarrio).toLowerCase().includes(text.toLowerCase())
      );
      setBarriosFiltered(filtered);
    }
  };

  const handleSelectBarrio = (id: number) => {
    handleChange('idBarrio', String(id));
    setShowBarriosDropdown(false);
    setBarriosSearch('');
    setBarriosFiltered([]);
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

      let response;
      let successMessage;

      if (clienteEditar) {
        // Actualizar cliente existente
        response = await actualizarCliente(clienteEditar.id, clienteData);
        successMessage = 'Cliente actualizado exitosamente';
      } else {
        // Crear nuevo cliente
        response = await crearCliente(clienteData);
        successMessage = 'Cliente registrado exitosamente';
      }
      
      Alert.alert('Éxito', successMessage, [
        {
          text: 'OK',
          onPress: () => {
            if (clienteEditar) {
              navigation.goBack();
            } else {
              navigation.navigate('NewOrder', { cliente: response });
            }
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error al guardar cliente:', error);
      const errorMsg = clienteEditar ? 'No se pudo actualizar el cliente' : 'No se pudo registrar el cliente';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{clienteEditar ? 'Editar cliente' : 'Registrar nuevo cliente'}</Text>
          <Text style={styles.subtitle}>{clienteEditar ? 'Actualice los datos del cliente' : 'Ingrese los datos del cliente para agregarlo al sistema'}</Text>
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
                style={[styles.input, (documentoRecibido || clienteEditar) && styles.inputDisabled]}
                value={formData.doc}
                onChangeText={(value) => handleChange('doc', value)}
                placeholder="Documento"
                keyboardType="numeric"
                editable={!documentoRecibido && !clienteEditar}
              />
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
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => {
                setShowBarriosDropdown(true);
                setBarriosSearch('');
                setBarriosFiltered(barrios.filter(barrio => barrio && barrio.idBarrio && (barrio.nomBarrio || barrio.nombreBarrio)));
              }}
            >
              <Text style={styles.dropdownButtonText}>
                {barrios.find(b => String(b.idBarrio) === formData.idBarrio)?.nombreBarrio || 'Seleccionar...'}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldFull}>
            <Text style={styles.label}>Tipo de Documento *</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => {
                setShowTiposDocDropdown(true);
                setTiposDocSearch('');
                setTiposDocFiltered(tiposDoc.filter(doc => {
                  const id = doc.idTipoDoc || doc.id_tipoDoc;
                  const nom = doc.nomDoc || doc.nomTipoDoc;
                  return doc && id && nom;
                }));
              }}
            >
              <Text style={styles.dropdownButtonText}>
                {tiposDoc.find(d => {
                  const id = d.idTipoDoc || d.id_tipoDoc;
                  return String(id) === formData.idTipoDoc;
                })?.nomDoc || tiposDoc.find(d => {
                  const id = d.idTipoDoc || d.id_tipoDoc;
                  return String(id) === formData.idTipoDoc;
                })?.nomTipoDoc || 'Seleccionar...'}
              </Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
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
                <Text style={styles.buttonTextPrimary}>
                  {clienteEditar ? 'Actualizar cliente' : 'Guardar cliente'}
                </Text>
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

      {/* Modal para seleccionar Tipo de Documento */}
      <Modal
        visible={showTiposDocDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTiposDocDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Tipo de Documento</Text>
              <TouchableOpacity onPress={() => setShowTiposDocDropdown(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalSearch}
              placeholder="Buscar tipo de documento..."
              value={tiposDocSearch}
              onChangeText={handleTiposDocSearch}
              placeholderTextColor="#999"
              autoFocus
            />

            <ScrollView style={styles.modalList}>
              {tiposDocFiltered.filter(item => {
                const id = item.idTipoDoc || item.id_tipoDoc;
                return item && id;
              }).map((item, index) => {
                const itemId = item.idTipoDoc || item.id_tipoDoc;
                return (
                  <TouchableOpacity
                    key={`tipodoc-${itemId}-${index}`}
                    style={styles.modalItem}
                    onPress={() => handleSelectTipoDoc(itemId)}
                  >
                    <View style={styles.modalItemContent}>
                      <Text style={[
                        styles.modalItemText,
                        String(itemId) === formData.idTipoDoc && styles.modalItemTextSelected
                      ]}>
                        {item.nomDoc || item.nomTipoDoc}
                      </Text>
                      {String(itemId) === formData.idTipoDoc && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal para seleccionar Barrio */}
      <Modal
        visible={showBarriosDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBarriosDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Barrio</Text>
              <TouchableOpacity onPress={() => setShowBarriosDropdown(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalSearch}
              placeholder="Buscar barrio..."
              value={barriosSearch}
              onChangeText={handleBarriosSearch}
              placeholderTextColor="#999"
              autoFocus
            />

            <ScrollView style={styles.modalList}>
              {barriosFiltered.filter(item => item && item.idBarrio).map((item, index) => (
                <TouchableOpacity
                  key={`barrio-${item.idBarrio}-${index}`}
                  style={styles.modalItem}
                  onPress={() => handleSelectBarrio(item.idBarrio)}
                >
                  <View style={styles.modalItemContent}>
                    <Text style={[
                      styles.modalItemText,
                      String(item.idBarrio) === formData.idBarrio && styles.modalItemTextSelected
                    ]}>
                      {item.nomBarrio || item.nombreBarrio}
                    </Text>
                    {String(item.idBarrio) === formData.idBarrio && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5ead6',
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
    color: '#2c2c2c',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: '#666',
  },
  form: {
    backgroundColor: '#ffffff',
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
    color: '#2c2c2c',
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: '#2c2c2c',
  },
  inputDisabled: {
    backgroundColor: '#efefef',
    color: '#999',
  },
  pickerContainer: {
    marginBottom: SPACING.xs,
  },
  pickerOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: '#d4a574',
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.xs,
  },
  pickerOptionSelected: {
    backgroundColor: '#c99d6a',
    borderColor: '#c99d6a',
  },
  pickerText: {
    fontSize: FONT_SIZES.sm,
    color: '#666',
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
    backgroundColor: '#c99d6a',
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d4a574',
  },
  buttonTextPrimary: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
  },
  buttonTextGhost: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#c99d6a',
  },
  // Dropdown styles
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  dropdownButtonText: {
    fontSize: FONT_SIZES.md,
    color: '#2c2c2c',
    flex: 1,
  },
  dropdownIcon: {
    fontSize: FONT_SIZES.md,
    color: '#c99d6a',
    marginLeft: SPACING.sm,
  },
  dropdownContent: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xs,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownSearch: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: '#2c2c2c',
  },
  dropdownList: {
    maxHeight: 150,
  },
  dropdownItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: FONT_SIZES.md,
    color: '#666',
  },
  dropdownItemTextSelected: {
    fontWeight: '700',
    color: '#c99d6a',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#f5ead6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: SPACING.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: '#d4a574',
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#2c2c2c',
  },
  closeButton: {
    fontSize: FONT_SIZES.lg,
    color: '#2c2c2c',
    fontWeight: 'bold',
  },
  modalSearch: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONT_SIZES.md,
    color: '#2c2c2c',
  },
  modalList: {
    paddingHorizontal: SPACING.lg,
  },
  modalItem: {
    backgroundColor: '#ffffff',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: '#d4a574',
  },
  modalItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: FONT_SIZES.md,
    color: '#666',
    flex: 1,
  },
  modalItemTextSelected: {
    fontWeight: '700',
    color: '#c99d6a',
  },
  checkmark: {
    fontSize: FONT_SIZES.lg,
    color: '#c99d6a',
    fontWeight: 'bold',
  },
});
