import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContextDefinition';
import NavbarSeller from '../../../components/Seller_components/Navbar_Seller/Navbar_seller.component';
import './Profile.styles.css';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-wrapper">
      <NavbarSeller />
      <div className="profile-container">
        <div className="profile-content">
          {/* Header con Avatar */}
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="profile-avatar-text">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <h2 className="profile-name">{user?.name || 'Usuario'}</h2>
            <p className="profile-email">{user?.email || 'correo@ejemplo.com'}</p>
            <div className="profile-role-badge">
              <span className="profile-role-text">{user?.rol || 'VENDEDOR'}</span>
            </div>
          </div>

          {/* Información de la Cuenta */}
          <div className="profile-section">
            <h3 className="profile-section-title">Información de la Cuenta</h3>
            
            <div className="profile-info-item">
              <span className="profile-info-label">Usuario</span>
              <span className="profile-info-value">{user?.name || 'No disponible'}</span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{user?.email || 'No disponible'}</span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">Rol</span>
              <span className="profile-info-value">{user?.rol || 'No disponible'}</span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">Estado</span>
              <span className={`profile-status-badge ${user?.activo ? 'active' : 'inactive'}`}>
                {user?.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          {/* Información Personal */}
          <div className="profile-section">
            <h3 className="profile-section-title">Información Personal</h3>
            
            <div className="profile-info-item">
              <span className="profile-info-label">{user?.tipoDoc || 'Documento'}</span>
              <span className="profile-info-value">{user?.numDoc || 'No disponible'}</span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">Teléfono</span>
              <span className="profile-info-value">{user?.numTel || 'No disponible'}</span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">Dirección</span>
              <span className="profile-info-value">{user?.direccion || 'No disponible'}</span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">Barrio</span>
              <span className="profile-info-value">{user?.barrio || 'No disponible'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
