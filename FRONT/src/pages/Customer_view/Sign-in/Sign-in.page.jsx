import React, { useState, useContext } from "react";
import "./Sign-in.styles.css";
import { FaUser, FaLock } from "react-icons/fa";
import BackgroundSignIn from "../../../assets/BackgroundSignIn.png";
import { Link } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const res = login({ email, password });
    if (res.ok) {
      // redirect to seller home on successful login
      navigate("/home-seller");
    } else {
      setError(res.error || "Credenciales inválidas");
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
        <h1 className="signin-title">Iniciar Sesión</h1>
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
          <button className="signin-btn" type="submit">Ingresar</button>
        </form>
        {error && <p className="signin-error">{error}</p>}
        <p className="signin-footer">
          ¿No tienes cuenta? <a href="/signup">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
