import React, { useEffect, useState } from "react";
import "./Inventory.styles.css";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import { FaPencilAlt } from "react-icons/fa";
import { actualizarArticulo, obtenerArticulo } from "../../../api/articulosApi";

const categories = ["Para dama", "Para caballero", "Para niño"];

const Inventory = () => {
  const [articulos, setArticulos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ precioArt: "", fotoArt: "" });

  useEffect(() => {
    obtenerArticulo().then((data) => setArticulos(data));
  }, []);

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
      <NavbarSeller />
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
              <p className="player-subtitle">{art.tallaArt}</p>
              <p className="player-subtitle">{art.precioArt}</p>
              <p className="player-subtitle">{art.generoArt}</p>
              <p className="player-price">{art.colorArt}</p>
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
