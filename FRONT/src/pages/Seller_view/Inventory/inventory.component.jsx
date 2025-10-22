import React, { useEffect, useState, useContext } from "react";
import "./Inventory.styles.css";
import { FaPencilAlt } from "react-icons/fa";
import { actualizarArticulo, obtenerArticulo } from "../../../api/articulosApi";
import { AuthContext } from "../../../context/AuthContextDefinition";
import { useNavigate } from "react-router-dom";

const categories = ["Para dama", "Para caballero", "Para niño"];

const Inventory = () => {
  const [articulos, setArticulos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ precioArt: "", fotoArt: "" });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarArticulos = async () => {
      try {
        const token = localStorage.getItem("sga_token");
        if (!token) {
          console.log("No hay token, redirigiendo al login");
          alert("Debes iniciar sesión para ver el inventario");
          navigate("/sign-in");
          return;
        }

        console.log("Cargando artículos con token:", token.substring(0, 20) + "...");
        const data = await obtenerArticulo();
        console.log("Artículos recibidos del backend:", data);
        setArticulos(data);
      } catch (error) {
        console.error("Error completo al cargar artículos:", error);
        if (error.message.includes("401") || error.message.includes("403")) {
          alert("Sesión expirada. Por favor inicia sesión nuevamente.");
          localStorage.removeItem("sga_token");
          localStorage.removeItem("sga_user");
          navigate("/sign-in");
        }
      }
    };
    
    cargarArticulos();
  }, [navigate]);

  const handleEditClick = (art) => {
    setEditingId(art.idArt);
    setEditedData({
      precioArt: art.precioArt,
      fotoArt: art.fotoArt,
    });
  };

  const handleActualizarArticulo = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        "idArt": editingId,
        "precioArti": editedData.precioArt,
        "fotoArti": editedData.fotoArt,
      };
      console.log(dataToSend)
      console.log(editingId)
      await actualizarArticulo(editingId, dataToSend);

      setArticulos((prev) =>
        prev.map((item) =>
          item.idArt === editingId ? { ...item, ...editedData } : item
        )
      );
      setEditingId(null);
    } catch (error) {
      console.log("Error al editar el artículo:", error);
    }
  };

  const handleCancel = () => setEditingId(null);

  return (
    <div className="inventory-wrapper">
      <aside className="sidebar">
        <h2>Categorías</h2>
        <ul>
          {categories.map((cat, index) => (
            <li key={index}>{cat}</li>
          ))}
        </ul>
      </aside>

      <div className="inventory-container">
        <h1 className="inventory-title">Inventario de vestidos</h1>
        <p className="inventory-subtitle">
          A continuación se mostraran todos los vestidos correspondiente en los cuales podras cambiar su precio o su foto.
        </p>

        <div className="cards-container">
          {articulos.map((art) => (
            <div key={art.idArt} className="player-card">
              <img
                src={art.fotoArt}
                alt={art.nombre}
                className="player-image"
              />
              <h2 className="player-name">{art.nombre}</h2>
              <p className="player-subtitle">Talla: {art.tallaArt}</p>
              <p className="player-subtitle">Precio: ${art.precioArt?.toLocaleString()}</p>
              <p className="player-subtitle">Género: {art.generoArt}</p>
              <p className="player-price">Color: {art.colorArt}</p>
              <p className="player-category">Categoría: {art.nomCate}</p>
              <span
                className="edit-text"
                onClick={() => handleEditClick(art)}
              >
                <FaPencilAlt />
              </span>
            </div>
          ))}
        </div>

        {editingId !== null && (
          <div className="modal-overlay">
            <form onSubmit={handleActualizarArticulo} className="modal">
              <h2>Editar canción</h2>
              <input
                type="text"
                value={editedData.precioArt || ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, precioArt: e.target.value })
                }
                placeholder="precio"
              />
              <input
                type="text"
                value={editedData.fotoArt || ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, fotoArt: e.target.value })
                }
                placeholder="foto"
              />
              <div className="modal-buttons">
                <button type="submit">Actualizar</button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
