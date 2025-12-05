import React, { useState, useContext } from "react";
import "./Login_Seller.styles.css";
import { FaUser, FaLock } from "react-icons/fa";
import BackgroundSignIn from "../../../assets/BackgroundSignIn.png";
import { AuthContext } from "../../../context/AuthContextDefinition";
import { useNavigate } from "react-router-dom";

const LoginSeller = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await login(email, password);
      
      if (res.ok) {
        // Verificar que el usuario sea ADMIN o VENDEDOR
        if (res.user.rol === "ADMIN" || res.user.rol === "VENDEDOR") {
          navigate("/home-seller");
        } else {
          setError("Acceso denegado. Esta sección es solo para vendedores.");
          // Cerrar sesión si no es vendedor
          localStorage.removeItem("sga_token");
        }
      } else {
        setError(res.error || "Credenciales inválidas");
      }
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="signin-page"
      style={{
        backgroundImage: `url(${BackgroundSignIn})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div className="overlay"></div>
      <div className="signin-container">
        <h1 className="signin-title">Portal de Vendedores</h1>
        <p className="signin-subtitle">Bienvenido de nuevo, ingresa tus datos para continuar</p>
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaUser className="input-icon" />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="input-icon" />
          </div>
          <button className="signin-btn" type="submit" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>
        {error && <p className="signin-error">{error}</p>}
        <p className="signin-footer">
          ¿Necesitas ayuda? <a href="/">Volver al inicio</a>
        </p>
      </div>
    </div>
  );
};

export default LoginSeller;
