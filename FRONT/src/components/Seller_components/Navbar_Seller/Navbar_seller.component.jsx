import React, { useState, useRef, useEffect, useContext } from "react";
import { FaUser } from "react-icons/fa";
import "./Navbar_Seller.styles.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContextDefinition";
import { useNavigate } from "react-router-dom";

const NavbarSeller = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar-seller">
      <Link to="/home-seller" className="navbar-seller-left">
        SGA Vendedor
      </Link>

      <ul className="navbar-seller-center">
        <Link to="/home-seller/new-rent" className="link-navbar-seller"><li>Nuevo Alquiler</li></Link>
        <Link to="/home-seller/inventory" className="link-navbar-seller"><li>Inventario</li></Link>
        <Link to="/home-seller/orders" className="link-navbar-seller"><li>Órdenes</li></Link>
        <Link to="/home-seller/clients" className="link-navbar-seller"><li>Clientes</li></Link>
      </ul>

      <div className="navbar-seller-right" ref={dropdownRef}>
        <FaUser className="login-icon-seller" onClick={toggleDropdown} />
        {open && (
          <div className="user-dropdown">
            <div className="user-info">
              <p className="user-name">{user?.name || "Vendedor"}</p>
              <p className="user-email">{user?.email || "-"}</p>
            </div>
            <hr />
            <Link to="#" className="dropdown-link">Ver perfil</Link>
            <button
              className="dropdown-link"
              onClick={(e) => {
                e.preventDefault();
                logout();
                navigate("/sign-in");
              }}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarSeller;
