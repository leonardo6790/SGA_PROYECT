import React, { useState, useEffect } from "react";
import "./New_client.styles.css";
import HomeSellerImage from "../../../assets/HomeSellerImage.png";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import { useNavigate, useLocation } from "react-router-dom";
import { crearCliente } from "../../../api/clientesApi";
import { obtenerBarrios } from "../../../api/barriosApi";
import { obtenerTiposDoc } from "../../../api/tipoDocApi";

export default function NewClient() {
  const navigate = useNavigate();
  const location = useLocation();
  const documentoRecibido = location.state?.documento || "";
  
  const [barrios, setBarrios] = useState([]);
  const [tiposDoc, setTiposDoc] = useState([]);
  
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
          setFormData(prev => ({ ...prev, idBarrio: barriosData[0].id_barrio }));
        }
        if (tiposDocData.length > 0 && !formData.idTipoDoc) {
          setFormData(prev => ({ ...prev, idTipoDoc: tiposDocData[0].id_tipoDoc }));
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
        barrioId: parseInt(formData.idBarrio),
        tipoDocId: parseInt(formData.idTipoDoc),
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

            <label className="nc-field">
              <span className="nc-label">Barrio *</span>
              <select name="idBarrio" value={formData.idBarrio || ""} onChange={handleChange} className="nc-input" required>
                <option value="" disabled>Seleccione un barrio</option>
                {barrios.length > 0 ? (
                  barrios.map((barrio) => (
                    <option key={barrio.id_barrio} value={barrio.id_barrio}>
                      {barrio.nomBar}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Cargando...</option>
                )}
              </select>
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
    </div>
  );
}