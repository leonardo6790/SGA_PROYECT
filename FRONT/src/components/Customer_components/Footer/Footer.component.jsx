import React from "react";
import "./Footer.styles.css";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo / Nombre */}
        <div className="footer-logo">
          <h2>SGA</h2>
          <p>Explora lo mejor de nuestros productos</p>
        </div>

        {/* Enlaces rápidos */}
        <div className="footer-links">
          <h3>Enlaces</h3>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/catalogo">Catálogo</a></li>
            <li><a href="/accesorios">Accesorios</a></li>
            <li><a href="/preguntas-frecuentes">Preguntas Frecuentes</a></li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div className="footer-social">
          <h3>Síguenos</h3>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SGA. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
