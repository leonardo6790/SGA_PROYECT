import React, { useEffect, useState, useContext } from "react";
import "./Inventory.styles.css";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { actualizarArticulo, obtenerArticulo, crearArticulo, eliminarArticulo } from "../../../api/articulosApi";
import { obtenerCategorias } from "../../../api/categoriasApi";
import { AuthContext } from "../../../context/AuthContextDefinition";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const [articulos, setArticulos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ precioArt: "", fotoArt: "" });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    nomArt: "",
    genero: "",
    talla: "",
    color: "",
    precio: "",
    foto: "",
    idCategoria: ""
  });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem("sga_token");
        if (!token) {
          console.log("No hay token, redirigiendo al login");
          alert("Debes iniciar sesión para ver el inventario");
          navigate("/sign-in");
          return;
        }

        console.log("Cargando artículos con token:", token.substring(0, 20) + "...");
        const [articulosData, categoriasData] = await Promise.all([
          obtenerArticulo(),
          obtenerCategorias()
        ]);
        
        console.log("Artículos recibidos del backend:", articulosData);
        console.log("Categorías recibidas del backend:", categoriasData);
        
        setArticulos(articulosData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error completo al cargar datos:", error);
        if (error.message.includes("401") || error.message.includes("403")) {
          alert("Sesión expirada. Por favor inicia sesión nuevamente.");
          localStorage.removeItem("sga_token");
          localStorage.removeItem("sga_user");
          navigate("/sign-in");
        }
      }
    };
    
    cargarDatos();
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

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    try {
      console.log("Estado actual newArticle:", newArticle);
      
      const dataToSend = {
        nombre: newArticle.nomArt,
        generoArt: newArticle.genero,
        tallaArt: newArticle.talla,
        colorArt: newArticle.color,
        precioArt: parseInt(newArticle.precio),
        fotoArt: newArticle.foto,
        idCategoria: parseInt(newArticle.idCategoria)
      };
      
      console.log("Datos a enviar al backend:", dataToSend);
      console.log("ID Categoría seleccionada:", newArticle.idCategoria, "tipo:", typeof newArticle.idCategoria);
      
      await crearArticulo(dataToSend);
      
      const data = await obtenerArticulo();
      setArticulos(data);
      
      setShowCreateModal(false);
      setNewArticle({
        nomArt: "",
        genero: "",
        talla: "",
        color: "",
        precio: "",
        foto: "",
        idCategoria: ""
      });
      
      alert("Artículo creado exitosamente");
    } catch (error) {
      console.error("Error al crear el artículo:", error);
      alert(`Error al crear el artículo: ${error.message}`);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
    setNewArticle({
      nomArt: "",
      genero: "",
      talla: "",
      color: "",
      precio: "",
      foto: "",
      idCategoria: ""
    });
  };

  const handleDeleteArticle = async (idArt, nombreArt) => {
    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar el artículo "${nombreArt}"?`);
    
    if (confirmar) {
      try {
        await eliminarArticulo(idArt);
        
        const data = await obtenerArticulo();
        setArticulos(data);
        
        alert("Artículo eliminado exitosamente");
      } catch (error) {
        console.error("Error al eliminar el artículo:", error);
        alert(`Error al eliminar el artículo: ${error.message}`);
      }
    }
  };

  return (
    <div className="inventory-wrapper">
      <aside className="sidebar">
        <h2>Categorías</h2>
        <ul>
          {categorias.map((cat) => (
            <li key={cat.idCate}>{cat.nomCate}</li>
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
              <p className="player-subtitle">Género: {art.generoArt}</p>
              <p className="player-subtitle">Color: {art.colorArt}</p>
              <p className="player-price">Precio: ${art.precioArt?.toLocaleString()}</p>
              <span
                className="delete-icon"
                onClick={() => handleDeleteArticle(art.idArt, art.nombre)}
                title="Eliminar artículo"
              >
                <FaTrash />
              </span>
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

        {showCreateModal && (
          <div className="modal-overlay">
            <form onSubmit={handleCreateArticle} className="modal modal-create">
              <h2>Crear Nuevo Artículo</h2>
              <input
                type="text"
                value={newArticle.nomArt}
                onChange={(e) => setNewArticle({ ...newArticle, nomArt: e.target.value })}
                placeholder="Nombre del artículo"
                required
              />
              <select
                value={newArticle.genero}
                onChange={(e) => setNewArticle({ ...newArticle, genero: e.target.value })}
                required
              >
                <option value="">Seleccionar género</option>
                <option value="Dama">Dama</option>
                <option value="Caballero">Caballero</option>
                <option value="Niño">Niño</option>
              </select>
              <input
                type="text"
                value={newArticle.talla}
                onChange={(e) => setNewArticle({ ...newArticle, talla: e.target.value })}
                placeholder="Talla"
                required
              />
              <input
                type="text"
                value={newArticle.color}
                onChange={(e) => setNewArticle({ ...newArticle, color: e.target.value })}
                placeholder="Color"
                required
              />
              <input
                type="number"
                value={newArticle.precio}
                onChange={(e) => setNewArticle({ ...newArticle, precio: e.target.value })}
                placeholder="Precio"
                required
              />
              <input
                type="text"
                value={newArticle.foto}
                onChange={(e) => setNewArticle({ ...newArticle, foto: e.target.value })}
                placeholder="URL de la foto"
                required
              />
              <select
                value={newArticle.idCategoria}
                onChange={(e) => setNewArticle({ ...newArticle, idCategoria: e.target.value })}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.idCate} value={cat.idCate}>
                    {cat.nomCate}
                  </option>
                ))}
              </select>
              <div className="modal-buttons">
                <button type="submit">Crear Artículo</button>
                <button
                  type="button"
                  onClick={handleCancelCreate}
                  className="cancel-button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <button 
          className="floating-button"
          onClick={() => setShowCreateModal(true)}
          title="Agregar nuevo artículo"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default Inventory;
