import React, { useEffect, useState, useContext } from "react";
import "./Inventory.styles.css";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { actualizarArticulo, obtenerArticulo, crearArticulo, eliminarArticulo, actualizarArticuloConFoto } from "../../../api/articulosApi";
import { obtenerCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from "../../../api/categoriasApi";
import { AuthContext } from "../../../context/AuthContextDefinition";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const [articulos, setArticulos] = useState([]);
  const [filteredArticulos, setFilteredArticulos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({
    nombre: "",
    genero: "",
    talla: "",
    color: "",
    precio: "",
    fotoArt: null,
    idCategoria: "",
    previewUrl: "",
    fotoActual: ""
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    nomArt: "",
    genero: "",
    talla: "",
    color: "",
    precio: "",
    fotoArt: null,
    idCategoria: "",
    previewUrl: ""
  });

  // Estados para gestión de categorías
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState('create'); // 'create' o 'edit'
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryData, setCategoryData] = useState({
    nomCate: ""
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
        setFilteredArticulos(articulosData); // Inicialmente mostrar todos
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

  // Filtrar artículos cuando cambia la categoría seleccionada o el término de búsqueda
  useEffect(() => {
    let filtered = articulos;

    // Filtrar por categoría
    if (selectedCategory !== null) {
      filtered = filtered.filter((art) => art.idCategoria === selectedCategory);
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((art) =>
        art.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredArticulos(filtered);
  }, [selectedCategory, articulos, searchTerm]);

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null); // Deseleccionar si ya está seleccionada
    } else {
      setSelectedCategory(categoryId); // Seleccionar nueva categoría
    }
  };

  const handleEditClick = (art) => {
    setEditingId(art.idArt);
    setEditedData({
      nombre: art.nombre,
      genero: art.generoArt,
      talla: art.tallaArt,
      color: art.colorArt,
      precio: art.precioArt,
      fotoArt: null,
      idCategoria: art.idCategoria,
      previewUrl: "",
      fotoActual: art.fotoArt
    });
  };

  const handleActualizarArticulo = async (e) => {
    e.preventDefault();
    try {
      // Si hay una nueva foto, usar FormData
      if (editedData.fotoArt) {
        const formData = new FormData();
        formData.append("nombre", editedData.nombre);
        formData.append("generoArt", editedData.genero);
        formData.append("tallaArt", editedData.talla);
        formData.append("colorArt", editedData.color);
        formData.append("precioArt", parseInt(editedData.precio));
        formData.append("fotoArt", editedData.fotoArt);
        formData.append("idCategoria", parseInt(editedData.idCategoria));

        await actualizarArticuloConFoto(editingId, formData);
      } else {
        // Si no hay nueva foto, enviar JSON sin foto
        const dataToSend = {
          nombre: editedData.nombre,
          generoArt: editedData.genero,
          tallaArt: editedData.talla,
          colorArt: editedData.color,
          precioArt: parseInt(editedData.precio),
          idCategoria: parseInt(editedData.idCategoria)
        };

        await actualizarArticulo(editingId, dataToSend);
      }

      // Recargar artículos
      const data = await obtenerArticulo();
      setArticulos(data);
      setFilteredArticulos(data);

      // Limpiar preview si existe
      if (editedData.previewUrl) {
        URL.revokeObjectURL(editedData.previewUrl);
      }

      setEditingId(null);
      alert("Artículo actualizado exitosamente");
    } catch (error) {
      console.log("Error al editar el artículo:", error);
      alert(`Error al actualizar el artículo: ${error.message}`);
    }
  };

  const handleCancel = () => {
    if (editedData.previewUrl) {
      URL.revokeObjectURL(editedData.previewUrl);
    }
    setEditingId(null);
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    try {
      console.log("Estado actual newArticle:", newArticle);

      // Validar que se haya seleccionado una foto
      if (!newArticle.fotoArt) {
        alert("Por favor selecciona una foto");
        return;
      }

      // Crear FormData para enviar archivo
      const formData = new FormData();
      formData.append("nombre", newArticle.nomArt);
      formData.append("generoArt", newArticle.genero);
      formData.append("tallaArt", newArticle.talla);
      formData.append("colorArt", newArticle.color);
      formData.append("precioArt", parseInt(newArticle.precio));
      formData.append("fotoArt", newArticle.fotoArt);
      formData.append("idCategoria", parseInt(newArticle.idCategoria));

      console.log("FormData a enviar al backend");

      // Enviar al nuevo endpoint que soporta multipart
      const token = localStorage.getItem("sga_token");
      const response = await fetch("http://localhost:8080/api/articulos/CrearConFoto", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error HTTP ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Respuesta del servidor:", responseData);
      console.log("URL de foto guardada:", responseData.data?.fotoArt);

      const data = await obtenerArticulo();
      console.log("Artículos después de crear:", data);
      setArticulos(data);
      setFilteredArticulos(data); // Actualizar también los filtrados

      setShowCreateModal(false);
      setNewArticle({
        nomArt: "",
        genero: "",
        talla: "",
        color: "",
        precio: "",
        fotoArt: null,
        idCategoria: "",
        previewUrl: ""
      });

      alert("Artículo creado exitosamente");
    } catch (error) {
      console.error("Error al crear el artículo:", error);
      alert(`Error al crear el artículo: ${error.message}`);
    }
  };

  // Funciones para gestión de categorías
  const handleOpenCategoryModal = (mode = 'create', category = null) => {
    setCategoryModalMode(mode);
    if (mode === 'edit' && category) {
      setEditingCategoryId(category.idCate);
      setCategoryData({
        nomCate: category.nomCate
      });
    } else {
      setEditingCategoryId(null);
      setCategoryData({ nomCate: "" });
    }
    setShowCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategoryId(null);
    setCategoryData({ nomCate: "" });
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      if (categoryModalMode === 'create') {
        await crearCategoria(categoryData);
        alert("Categoría creada exitosamente");
      } else {
        await actualizarCategoria(editingCategoryId, categoryData);
        alert("Categoría actualizada exitosamente");
      }

      const categoriasData = await obtenerCategorias();
      setCategorias(categoriasData);
      handleCloseCategoryModal();
    } catch (error) {
      console.error("Error al guardar categoría:", error);
      alert(`Error al guardar la categoría: ${error.message}`);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría? Los artículos asociados no se eliminarán.")) {
      return;
    }

    try {
      await eliminarCategoria(categoryId);
      const categoriasData = await obtenerCategorias();
      setCategorias(categoriasData);

      // Si la categoría eliminada estaba seleccionada, limpiar selección
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
      }

      alert("Categoría eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      alert(`Error al eliminar la categoría: ${error.message}`);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
    // Limpiar preview URL si existe
    if (newArticle.previewUrl) {
      URL.revokeObjectURL(newArticle.previewUrl);
    }
    setNewArticle({
      nomArt: "",
      genero: "",
      talla: "",
      color: "",
      precio: "",
      fotoArt: null,
      idCategoria: "",
      previewUrl: ""
    });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen");
        return;
      }

      // Crear preview URL
      const previewUrl = URL.createObjectURL(file);

      // Limpiar URL anterior si existe
      if (newArticle.previewUrl) {
        URL.revokeObjectURL(newArticle.previewUrl);
      }

      setNewArticle({
        ...newArticle,
        fotoArt: file,
        previewUrl: previewUrl
      });
    }
  };

  const handleEditFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona un archivo de imagen");
        return;
      }

      // Crear preview URL
      const previewUrl = URL.createObjectURL(file);

      // Limpiar URL anterior si existe
      if (editedData.previewUrl) {
        URL.revokeObjectURL(editedData.previewUrl);
      }

      setEditedData({
        ...editedData,
        fotoArt: file,
        previewUrl: previewUrl
      });
    }
  };

  const handleDeleteArticle = async (idArt, nombreArt) => {
    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar el artículo "${nombreArt}"?`);

    if (confirmar) {
      try {
        await eliminarArticulo(idArt);

        const data = await obtenerArticulo();
        setArticulos(data);
        setFilteredArticulos(data); // Actualizar también los filtrados

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
        <div className="sidebar-header">
          <h2>Categorías</h2>
          <button
            className="add-category-btn"
            onClick={() => handleOpenCategoryModal('create')}
            title="Agregar categoría"
          >
            <FaPlus />
          </button>
        </div>

        <button
          className={`category-item ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          Todas las categorías
        </button>

        <ul>
          {categorias.map((cat) => (
            <li
              key={cat.idCate}
              className={selectedCategory === cat.idCate ? 'active' : ''}
            >
              <span onClick={() => handleCategoryClick(cat.idCate)}>
                {cat.nomCate}
              </span>
              <div className="category-actions">
                <button
                  className="edit-category-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCategoryModal('edit', cat);
                  }}
                  title="Editar categoría"
                >
                  <FaPencilAlt />
                </button>
                <button
                  className="delete-category-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(cat.idCate);
                  }}
                  title="Eliminar categoría"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <div className="inventory-container">
        <h1 className="inventory-title">
          Inventario de vestidos
          {selectedCategory !== null && (
            <span className="filter-badge">
              {` - ${categorias.find(cat => cat.idCate === selectedCategory)?.nomCate || ''} (${filteredArticulos.length})`}
            </span>
          )}
        </h1>
        <p className="inventory-subtitle">
          {selectedCategory === null
            ? `Mostrando todos los vestidos (${articulos.length} artículos)`
            : `Mostrando ${filteredArticulos.length} artículo(s) de la categoría seleccionada`
          }
        </p>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar artículo por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm("")}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        <div className="cards-container">
          {filteredArticulos.map((art) => (
            <div key={art.idArt} className="player-card">
              <img
                src={`http://localhost:8080${art.fotoArt}`}
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
            <form onSubmit={handleActualizarArticulo} className="modal modal-edit">
              <h2>Editar Artículo</h2>

              <input
                type="text"
                value={editedData.nombre || ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, nombre: e.target.value })
                }
                placeholder="Nombre del artículo"
                required
              />

              <select
                value={editedData.genero || ""}
                onChange={(e) => setEditedData({ ...editedData, genero: e.target.value })}
                required
              >
                <option value="">Seleccionar género</option>
                <option value="Dama">Dama</option>
                <option value="Caballero">Caballero</option>
                <option value="Niño">Niño</option>
              </select>

              <input
                type="text"
                value={editedData.talla || ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, talla: e.target.value })
                }
                placeholder="Talla"
                required
              />

              <input
                type="text"
                value={editedData.color || ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, color: e.target.value })
                }
                placeholder="Color"
                required
              />

              <input
                type="number"
                value={editedData.precio || ""}
                onChange={(e) =>
                  setEditedData({ ...editedData, precio: e.target.value })
                }
                placeholder="Precio"
                required
              />

              <div className="file-input-container">
                <label htmlFor="edit-foto-input" className="file-input-label">
                  {editedData.previewUrl ? "Nueva foto seleccionada ✓" : "Cambiar foto (opcional)"}
                </label>
                <input
                  id="edit-foto-input"
                  type="file"
                  accept="image/*"
                  onChange={handleEditFotoChange}
                  style={{ display: "none" }}
                />
                {editedData.previewUrl ? (
                  <div className="preview-container">
                    <img src={editedData.previewUrl} alt="Preview" className="preview-image" />
                  </div>
                ) : (
                  <div className="preview-container">
                    <img src={`http://localhost:8080${editedData.fotoActual}`} alt="Actual" className="preview-image" />
                    <p className="preview-label">Foto actual</p>
                  </div>
                )}
              </div>

              <select
                value={editedData.idCategoria || ""}
                onChange={(e) => setEditedData({ ...editedData, idCategoria: e.target.value })}
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
                <button type="submit">Actualizar Artículo</button>
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
              <div className="file-input-container">
                <label htmlFor="foto-input" className="file-input-label">
                  {newArticle.previewUrl ? "Foto seleccionada ✓" : "Seleccionar foto"}
                </label>
                <input
                  id="foto-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  required
                  style={{ display: "none" }}
                />
                {newArticle.previewUrl && (
                  <div className="preview-container">
                    <img src={newArticle.previewUrl} alt="Preview" className="preview-image" />
                  </div>
                )}
              </div>
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

        {/* Modal para crear/editar categorías */}
        {showCategoryModal && (
          <div className="modal-overlay" onClick={handleCloseCategoryModal}>
            <form onSubmit={handleSubmitCategory} className="modal modal-category" onClick={(e) => e.stopPropagation()}>
              <h2>{categoryModalMode === 'create' ? 'Crear Categoría' : 'Editar Categoría'}</h2>
              <input
                type="text"
                name="nomCate"
                value={categoryData.nomCate}
                onChange={handleCategoryInputChange}
                placeholder="Nombre de la categoría"
                required
              />
              <div className="modal-buttons">
                <button type="submit">
                  {categoryModalMode === 'create' ? 'Crear' : 'Actualizar'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseCategoryModal}
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
