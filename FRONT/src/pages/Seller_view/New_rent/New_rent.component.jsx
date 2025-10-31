import { useEffect, useState } from "react";
import "./New_rent.styles.css";
import HomeSellerImage from "../../../assets/HomeSellerImage.png";
import ImagenAlquiler from "../../../assets/NewRent.png";
import ImagenDefault from "../../../assets/ImagenQuieto.png";    
import ImagenUsuario from "../../../assets/ImagenUsuarioEncontrado.png";     
import ImagenError from "../../../assets/imagenConfundido.png";         
import { Link, useNavigate } from "react-router-dom";
import { obtenerClientes } from "../../../api/clientesApi";

export default function NewRent() {
  const [documento, setDocumento] = useState("");
  const [clients, setClients] = useState([]);
  const [clienteEncontrado, setClienteEncontrado] = useState(null);
  const [imagen, setImagen] = useState(ImagenDefault);
  const [mensaje, setMensaje] = useState("Por favor escribe el documento");
  const navigate = useNavigate();

  useEffect(() => {
    obtenerClientes().then((data) => setClients(data));
  }, []);
useEffect(() => {
  if (documento.length >= 7) {
    const user = clients.find((e) => String(e.doc) === documento.trim());
    console.log("Cliente buscado:", user);
    if (user) {
      setClienteEncontrado(user);
      setImagen(ImagenUsuario);
      setMensaje("El cliente ha sido encontrado en la base de datos");
    } else {
      setClienteEncontrado(null);
      setImagen(ImagenError);
      setMensaje("Cliente no encontrado :(");
    }
  } else {
    setClienteEncontrado(null);
    setImagen(ImagenDefault);
    setMensaje("Por favor escribe el documento");
  }
}, [documento, clients]);

  const handleContinuar = () => {
    if (clienteEncontrado) {
      navigate('/home-seller/new-order', { state: { cliente: clienteEncontrado } });
    } else {
      navigate('/home-seller/new-client', { state: { documento: documento } });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleContinuar();
    }
  };

  return (
    <div
      className="new-rent-container"
      style={{ backgroundImage: `url(${HomeSellerImage})` }}
    >
      <div className="overlay"></div>
      <div className="form-section">
        <h1 className="form-title">Bienvenido</h1>
        <h2 className="form-secondary-title">Por favor, Ingresa el documento</h2>
        <p className="form-secondary-subtitle">Cédula de Ciudadanía</p>

        <input
          type="text"
          maxLength={10}
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe aquí..."
          className="form-input"
        />

        <button onClick={handleContinuar} className="form-button">
          Continuar
        </button>

        <div className="status-section">
          <img src={imagen} alt="estado usuario" className="status-image" />
          <p className="status-text">{mensaje}</p>
        </div>
      </div>

      <div className="image-section">
        <img src={ImagenAlquiler} alt="Vista alquiler" />
      </div>
    </div>
  );
}
