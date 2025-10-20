import React from "react";
import { Link } from "react-router-dom";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import "./Home_Seller.styles.css";
import HomeSellerImage from "../../../assets/HomeSellerImage.png";
import Alquiler from "../../../assets/NewRent.png";
import Inventario from "../../../assets/Alquiler.png";
import Ordenes from "../../../assets/Ordenes.png";
import Clientes from "../../../assets/Clientes.png";

const HomeSeller = () => {
  return (
    <div className="home-seller" style={{ backgroundImage: `url(${HomeSellerImage})` }}>
      <div className="overlay"></div>
      <NavbarSeller />
      <main className="seller-main">
        <div className="seller-header">
          <h1 className="seller-title">Bienvenido, Que vamos a hacer hoy?</h1>
          <p className="seller-subtitle">Administra tus alquileres, inventario y clientes fácilmente</p>
        </div>
        <div className="button-grid">
          <Link to="/home-seller/new-rent" className="seller-btn" style={{ backgroundImage: `url(${Alquiler})` }}>Nuevo Alquiler</Link>
          <Link to="/home-seller/inventory" className="seller-btn" style={{ backgroundImage: `url(${Inventario})` }}>Inventario</Link>
          <Link to="/home-seller/orders" className="seller-btn" style={{ backgroundImage: `url(${Ordenes})` }}>Órdenes</Link>
          <Link to="/home-seller/clients" className="seller-btn" style={{ backgroundImage: `url(${Clientes})` }}>Clientes</Link>
        </div>
      </main>
    </div>
  );
};

export default HomeSeller;
