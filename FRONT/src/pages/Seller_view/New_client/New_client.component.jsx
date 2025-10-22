import React, { useState } from "react";
import "./New_client.styles.css";
import HomeSellerImage from "../../../assets/HomeSellerImage.png";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import { useNavigate } from "react-router-dom";

export default function NewClient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numDocumento: "",
    nombre1: "",
    nombre2: "",
    apellido1: "",
    apellido2: "",
    contra: "",
    dire: "",
    tele: "",
    correoElectronico: "",
    idBarrio: "",
    idTipoDoc: "",
    idRol: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrearUsuario = (e) => {
    e?.preventDefault();
    navigate('/home-seller/new-order');
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

        <form onSubmit={handleCrearUsuario} className="nc-form">
          <div className="nc-grid">
            <label className="nc-field">
              <span className="nc-label">Primer Nombre</span>
              <input onChange={handleChange} type="text" name="nombre1" value={formData.nombre1} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Segundo Nombre</span>
              <input onChange={handleChange} type="text" name="nombre2" value={formData.nombre2} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Primer Apellido</span>
              <input onChange={handleChange} type="text" name="apellido1" value={formData.apellido1} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Segundo Apellido</span>
              <input onChange={handleChange} type="text" name="apellido2" value={formData.apellido2} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Dirección</span>
              <input type="text" name="dire" value={formData.dire} onChange={handleChange} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Barrio</span>
              <input type="text" name="idBarrio" value={formData.idBarrio} onChange={handleChange} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Teléfono</span>
              <input type="text" name="tele" value={formData.tele} onChange={handleChange} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Correo Electrónico</span>
              <input type="email" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Documento</span>
              <input type="text" name="numDocumento" value={formData.numDocumento} onChange={handleChange} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Contraseña</span>
              <input type="password" name="contra" value={formData.contra} onChange={handleChange} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Tipo Documento</span>
              <input type="text" name="idTipoDoc" value={formData.idTipoDoc} onChange={handleChange} className="nc-input" />
            </label>

            <label className="nc-field">
              <span className="nc-label">Rol</span>
              <input type="text" name="idRol" value={formData.idRol} onChange={handleChange} className="nc-input" />
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