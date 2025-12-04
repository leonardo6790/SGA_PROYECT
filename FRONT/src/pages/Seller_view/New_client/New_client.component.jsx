import React, { useState, useEffect } from "react";
import "./New_client.styles.css";
import HomeSellerImage from "../../../assets/HomeSellerImage.png";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import { useNavigate, useLocation } from "react-router-dom";
import { crearCliente } from "../../../api/clientesApi";
import { obtenerBarrios, crearBarrio } from "../../../api/barriosApi";
import { obtenerTiposDoc } from "../../../api/tipoDocApi";

export default function NewClient() {
  const navigate = useNavigate();
  const location = useLocation();
  const documentoRecibido = location.state?.documento || "";

  const [barrios, setBarrios] = useState([]);
  const [tiposDoc, setTiposDoc] = useState([]);
  const [showCreateBarrioModal, setShowCreateBarrioModal] = useState(false);
  const [newBarrioData, setNewBarrioData] = useState({
    nombreBarrio: ""
  });

  const [formData, setFormData] = useState({
    doc: documentoRecibido,
    nomcli1: "",
    nomcli2: "",
    apecli1: "",
    apecli2: "",
    direCli: "",
    numeroCli: "",
    correoElectronico: "",
    idBarrio: null,
    idTipoDoc: null,
  });

  // Cargar barrios y tipos de documento al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [barriosData, tiposDocData] = await Promise.all([
          obtenerBarrios(),
          obtenerTiposDoc()
        ]);
        setBarrios(barriosData);
        setTiposDoc(tiposDocData);

        // Establecer valores por defecto cuando se cargan los datos
        if (barriosData.length > 0 && !formData.idBarrio) {
          setFormData(prev => ({ ...prev, idBarrio: barriosData[0].idBarrio }));
        }
        if (tiposDocData.length > 0 && !formData.idTipoDoc) {
          setFormData(prev => ({ ...prev, idTipoDoc: tiposDocData[0].idTipoDoc }));
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, []);

  // Actualizar el documento si llega desde New_rent
  useEffect(() => {
    if (documentoRecibido) {
      setFormData(prev => ({ ...prev, doc: documentoRecibido }));
    }
  }, [documentoRecibido]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreateBarrioModal = () => {
    setShowCreateBarrioModal(true);
  };

  const handleCloseCreateBarrioModal = () => {
    setShowCreateBarrioModal(false);
    setNewBarrioData({
      nombreBarrio: ""
    });
  };

  const handleCreateBarrio = async (e) => {
    e.preventDefault();

    if (!newBarrioData.nombreBarrio.trim()) {
      alert("El nombre del barrio es obligatorio");
      return;
    }

    try {
      const nuevoBarrio = await crearBarrio(newBarrioData);

      // Recargar la lista de barrios
      const barriosActualizados = await obtenerBarrios();
      setBarrios(barriosActualizados);

      // Seleccionar automáticamente el nuevo barrio en el formulario
      setFormData(prev => ({ ...prev, idBarrio: nuevoBarrio.idBarrio }));

      handleCloseCreateBarrioModal();
      alert("Barrio creado exitosamente");
    } catch (error) {
      console.error("Error al crear barrio:", error);
      alert(`Error al crear el barrio: ${error.message}`);
    }
  };

  const handleCrearCliente = async (e) => {
    e?.preventDefault();

    try {
      // Validar campos requeridos
      if (!formData.doc || !formData.nomcli1 || !formData.apecli1 || !formData.numeroCli || !formData.correoElectronico || !formData.direCli) {
        alert("Por favor complete los campos obligatorios: Documento, Primer Nombre, Primer Apellido, Teléfono, Correo Electrónico y Dirección");
        return;
      }

      // Validar que barrio y tipo de documento estén seleccionados
      if (!formData.idBarrio || !formData.idTipoDoc) {
        alert("Por favor seleccione el barrio y el tipo de documento");
        return;
      }

      // Crear el cliente
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

      console.log("Creando cliente:", clienteData);
      const response = await crearCliente(clienteData);
      console.log("Cliente creado:", response);

      alert("Cliente registrado exitosamente");

      // Redirigir a new-order con los datos del cliente creado
      navigate('/home-seller/new-order', { state: { cliente: response } });
    } catch (error) {
      console.error("Error al crear cliente:", error);
      alert(`Error al registrar el cliente: ${error.message || error}`);
    }
  };

  return (
    <div
      className="nc-container"
      style={{ backgroundImage: `url(${HomeSellerImage})` }}
    >
      <NavbarSeller />
      <div className="nc-overlay"></div>

      <div className="nc-form-section nc-card">
        <div className="nc-form-header">
          <h1 className="nc-form-title">Registrar nuevo cliente</h1>
          <p className="nc-form-subtitle">Ingrese los datos del cliente para agregarlo al sistema.</p>
        </div>

        <form onSubmit={handleCrearCliente} className="nc-form">
          <div className="nc-grid">
            <label className="nc-field">
              <span className="nc-label">Primer Nombre *</span>
              <input onChange={handleChange} type="text" name="nomcli1" value={formData.nomcli1} className="nc-input" required />
            </label>

            <label className="nc-field">
              <span className="nc-label">Segundo Nombre</span>
              <input onChange={handleChange} type="text" name="nomcli2" value={formData.nomcli2} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Primer Apellido *</span>
              <input onChange={handleChange} type="text" name="apecli1" value={formData.apecli1} className="nc-input" required />
            </label>

            <label className="nc-field">
              <span className="nc-label">Segundo Apellido</span>
              <input onChange={handleChange} type="text" name="apecli2" value={formData.apecli2} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Documento *</span>
              <input
                type="text"
                name="doc"
                value={formData.doc}
                onChange={handleChange}
                className="nc-input"
                required
                readOnly={!!documentoRecibido}
                style={documentoRecibido ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
              />
            </label>

            <label className="nc-field">
              <span className="nc-label">Tipo Documento *</span>
              <select name="idTipoDoc" value={formData.idTipoDoc || ""} onChange={handleChange} className="nc-input" required>
                <option value="" disabled>Seleccione un tipo</option>
                {tiposDoc.length > 0 ? (
                  tiposDoc.map((tipo) => (
                    <option key={tipo.id_tipoDoc} value={tipo.id_tipoDoc}>
                      {tipo.nomDoc}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Cargando...</option>
                )}
              </select>
            </label>

            <label className="nc-field">
              <span className="nc-label">Teléfono *</span>
              <input type="text" name="numeroCli" value={formData.numeroCli} onChange={handleChange} className="nc-input" required />
            </label>

            <label className="nc-field">
              <span className="nc-label">Correo Electrónico *</span>
              <input type="email" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange} className="nc-input" required />
            </label>

            <label className="nc-field">
              <span className="nc-label">Dirección *</span>
              <input type="text" name="direCli" value={formData.direCli} onChange={handleChange} className="nc-input" required />
            </label>

            <label className="nc-field nc-field-with-button">
              <span className="nc-label">Barrio *</span>
              <div className="nc-barrio-container">
                <select name="idBarrio" value={formData.idBarrio || ""} onChange={handleChange} className="nc-input" required>
                  <option value="" disabled>Seleccione un barrio</option>
                  {barrios.length > 0 ? (
                    barrios.map((barrio) => (
                      <option key={barrio.idBarrio} value={barrio.idBarrio}>
                        {barrio.nombreBarrio}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Cargando...</option>
                  )}
                </select>
                <button
                  type="button"
                  className="nc-create-barrio-btn"
                  onClick={handleOpenCreateBarrioModal}
                  title="Crear nuevo barrio"
                >
                  + Nuevo Barrio
                </button>
              </div>
            </label>
          </div>

          <div className="nc-actions">
            <button type="submit" className="nc-button primary">
              Guardar cliente
            </button>
            <button type="button" className="nc-button ghost" onClick={() => navigate('/home-seller')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {showCreateBarrioModal && (
        <div className="nc-modal-overlay" onClick={handleCloseCreateBarrioModal}>
          <form className="nc-modal" onSubmit={handleCreateBarrio} onClick={(e) => e.stopPropagation()}>
            <h2>Crear Nuevo Barrio</h2>
            <label className="nc-modal-field">
              <span className="nc-modal-label">Nombre del barrio *</span>
              <input
                type="text"
                value={newBarrioData.nombreBarrio}
                onChange={(e) =>
                  setNewBarrioData({ ...newBarrioData, nombreBarrio: e.target.value })
                }
                className="nc-modal-input"
                required
              />
            </label>
            <div className="nc-modal-buttons">
              <button type="submit" className="nc-button primary">
                Crear Barrio
              </button>
              <button
                type="button"
                onClick={handleCloseCreateBarrioModal}
                className="nc-button ghost"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}