import React, { useState } from "react";
import "./New_client.styles.css";
import HomeSellerImage from "../../../assets/HomeSellerImage.png";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import { useNavigate } from "react-router-dom";
import { crearCliente } from "../../../api/clientesApi";

export default function NewClient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doc: "",
    nomcli1: "",
    nomcli2: "",
    apecli1: "",
    apecli2: "",
    direCli: "",
    numeroCli: "",
    correoElectronico: "",
    idBarrio: 1,
    idTipoDoc: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrearCliente = async (e) => {
    e?.preventDefault();
    
    try {
      // Validar campos requeridos
      if (!formData.doc || !formData.nomcli1 || !formData.apecli1 || !formData.numeroCli) {
        alert("Por favor complete los campos obligatorios: Documento, Primer Nombre, Primer Apellido y Teléfono");
        return;
      }

      // Crear el cliente
      const clienteData = {
        doc: formData.doc,
        nomcli1: formData.nomcli1,
        nomcli2: formData.nomcli2 || null,
        apecli1: formData.apecli1,
        apecli2: formData.apecli2 || null,
        direCli: formData.direCli || null,
        numeroCli: parseInt(formData.numeroCli),
        correoElectronico: formData.correoElectronico || null,
        idBarrio: parseInt(formData.idBarrio),
        idTipoDoc: parseInt(formData.idTipoDoc),
      };

      console.log("Creando cliente:", clienteData);
      const response = await crearCliente(clienteData);
      console.log("Cliente creado:", response);
      
      alert("Cliente registrado exitosamente");
      navigate('/home-seller/new-rent');
    } catch (error) {
      console.error("Error al crear cliente:", error);
      alert(`Error al registrar el cliente: ${error.response?.data?.mensaje || error.message}`);
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
              <input type="text" name="doc" value={formData.doc} onChange={handleChange} className="nc-input" required />
            </label>

            <label className="nc-field">
              <span className="nc-label">Tipo Documento</span>
              <select name="idTipoDoc" value={formData.idTipoDoc} onChange={handleChange} className="nc-input">
                <option value="1">Cédula de Ciudadanía</option>
                <option value="2">Tarjeta de Identidad</option>
                <option value="3">Cédula de Extranjería</option>
              </select>
            </label>

            <label className="nc-field">
              <span className="nc-label">Teléfono *</span>
              <input type="text" name="numeroCli" value={formData.numeroCli} onChange={handleChange} className="nc-input" required />
            </label>

            <label className="nc-field">
              <span className="nc-label">Correo Electrónico</span>
              <input type="email" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Dirección</span>
              <input type="text" name="direCli" value={formData.direCli} onChange={handleChange} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Barrio</span>
              <select name="idBarrio" value={formData.idBarrio} onChange={handleChange} className="nc-input">
                <option value="1">Centro</option>
                <option value="2">Norte</option>
                <option value="3">Sur</option>
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