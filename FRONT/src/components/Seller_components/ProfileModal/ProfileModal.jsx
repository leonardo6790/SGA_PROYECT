import React, { useState, useEffect, useContext } from 'react';
import './ProfileModal.styles.css';
import { AuthContext } from '../../../context/AuthContextDefinition';
import { editarUsuario } from '../../../api/usuariosApi';
import { obtenerBarrios } from '../../../api/barriosApi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ProfileModal = ({ isOpen, onClose }) => {
  console.log('🎯 ProfileModal renderizado con isOpen:', isOpen);
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    telefono: '',
    direccion: '',
    barrio: '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [barrios, setBarrios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('🔍 Modal abierto, datos del usuario:', user);
      loadBarrios();
      loadUserData();
    }
  }, [isOpen, user]);

  const loadBarrios = async () => {
    try {
      const data = await obtenerBarrios();
      console.log('✅ Barrios cargados:', data);
      setBarrios(data || []);
    } catch (err) {
      console.error('❌ Error al cargar barrios:', err);
      setError('Error al cargar los barrios');
    }
  };

  const loadUserData = () => {
    if (user) {
      console.log('👤 Cargando datos del usuario:', user);
      setFormData(prev => ({
        ...prev,
        telefono: user.telefono || user.numTel || '',
        direccion: user.direccion || '',
        barrio: user.barrio || '',
      }));
    } else {
      console.warn('⚠️ Usuario no disponible');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSave = async () => {
    // Validaciones
    if (!formData.telefono || String(formData.telefono).trim() === '') {
      setError('El teléfono es requerido');
      return;
    }
    if (!formData.direccion || formData.direccion.trim() === '') {
      setError('La dirección es requerida');
      return;
    }
    if (!formData.barrio) {
      setError('El barrio es requerido');
      return;
    }

    // Si hay contraseña, validar que coincidan
    if (formData.contrasena) {
      if (formData.contrasena.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      if (formData.contrasena !== formData.confirmarContrasena) {
        setError('Las contraseñas no coinciden');
        return;
      }
    }

    setLoading(true);
    setError('');
    try {
      console.log('📋 Datos del usuario en handleSave:', user);
      const updateData = {
        numDocumento: user.numDoc,
        nombre1: user.nom1 || '',
        nombre2: user.nom2 || '',
        apellido1: user.ape1 || '',
        apellido2: user.ape2 || '',
        tele: formData.telefono ? parseInt(String(formData.telefono)) : null,
        correoElectronico: user.email,
        dire: formData.direccion,
        idBarrio: parseInt(formData.barrio),
      };

      // Agregar contraseña solo si se proporcionó
      if (formData.contrasena) {
        updateData.contra = formData.contrasena;
      }

      console.log('🔄 Datos a enviar:', updateData);
      const response = await editarUsuario(user.numDoc, updateData);
      console.log('✅ Respuesta del servidor:', response);
      
      setSuccess('Perfil actualizado exitosamente');
      
      // Limpiar formulario y cerrar después de 2 segundos
      setTimeout(() => {
        setSuccess('');
        onClose();
        // Limpiar campos
        setFormData({
          telefono: '',
          direccion: '',
          barrio: '',
          contrasena: '',
          confirmarContrasena: '',
        });
      }, 2000);
    } catch (err) {
      console.error('❌ Error al actualizar perfil:', err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="profile-modal-overlay" onClick={onClose}>
        <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
          <div className="profile-modal-header">
            <h2>Mi Perfil</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          <div className="profile-modal-content">
            <p style={{ color: '#e74c3c', textAlign: 'center', padding: '20px' }}>
              No hay datos del usuario disponibles. Por favor, inicia sesión nuevamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>Mi Perfil</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="profile-modal-content">
          {/* Información del usuario */}
          <div className="info-section">
            <h3>Información Personal</h3>
            <div className="info-item">
              <label>Nombre:</label>
              <p>{user?.nom1 || ''} {user?.nom2 || ''}</p>
            </div>
            <div className="info-item">
              <label>Apellido:</label>
              <p>{user?.ape1 || ''} {user?.ape2 || ''}</p>
            </div>
            <div className="info-item">
              <label>Correo:</label>
              <p>{user?.email || '-'}</p>
            </div>
            <div className="info-item">
              <label>Rol:</label>
              <p>{user?.rol || '-'}</p>
            </div>
          </div>

          {/* Formulario editable */}
          <div className="form-section">
            <h3>Editar Información</h3>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono *</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ingresa tu teléfono"
              />
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección *</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ingresa tu dirección"
              />
            </div>

            <div className="form-group">
              <label htmlFor="barrio">Barrio *</label>
              <select
                id="barrio"
                name="barrio"
                value={formData.barrio}
                onChange={handleChange}
              >
                <option value="">Selecciona un barrio</option>
                {barrios.map(barrio => (
                  <option key={barrio.id_barrio} value={barrio.id_barrio}>
                    {barrio.nomBar || barrio.nombreBarrio || '-'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group password-group">
              <label htmlFor="contrasena">Nueva Contraseña (opcional)</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="contrasena"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder="Deja vacío para mantener la actual"
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {formData.contrasena && (
              <div className="form-group password-group">
                <label htmlFor="confirmarContrasena">Confirmar Contraseña *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmarContrasena"
                    name="confirmarContrasena"
                    value={formData.confirmarContrasena}
                    onChange={handleChange}
                    placeholder="Confirma tu nueva contraseña"
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}

            {/* Mensajes de error y éxito */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Botones */}
            <div className="modal-buttons">
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                className="btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
