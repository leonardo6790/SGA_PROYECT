import React, { useEffect, useState } from "react";
import "./Clients.styles.css";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import { obtenerClientes, actualizarCliente, eliminarCliente } from "../../../api/clientesApi";
import { obtenerBarrios } from "../../../api/barriosApi";
import { obtenerTiposDoc } from "../../../api/tipoDocApi";
import { HiPencilSquare, HiTrash, HiEye } from "react-icons/hi2";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);
  const [barrios, setBarrios] = useState([]);
  const [tiposDoc, setTiposDoc] = useState([]);
  const [editedData, setEditedData] = useState({
    nomcli1: "",
    nomcli2: "",
    apecli1: "",
    apecli2: "",
    correoElectronico: "",
    numeroCli: "",
    direCli: "",
    idBarrio: null,
    idTipoDoc: null,
    activo: true,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem("sga_token");
        if (!token) {
          console.log("No hay token, no se cargarán los clientes");
          return;
        }
        const [clientesData, barriosData, tiposDocData] = await Promise.all([
          obtenerClientes(),
          obtenerBarrios(),
          obtenerTiposDoc()
        ]);
        console.log("Clientes recibidos:", clientesData);
        setClients(clientesData);
        setFilteredClients(clientesData);
        setBarrios(barriosData);
        setTiposDoc(tiposDocData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    
    cargarDatos();
  }, []);

  // Filtrar clientes cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter((client) => 
        String(client.doc).startsWith(searchTerm.trim())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (client) => {
    console.log("Cliente seleccionado para editar:", client);
    setEditingId(client.doc);
    setEditedData({
      nomcli1: client.nomcli1 || "",
      nomcli2: client.nomcli2 || "",
      apecli1: client.apecli1 || "",
      apecli2: client.apecli2 || "",
      correoElectronico: client.correoElectronico || "",
      numeroCli: client.numeroCli || "",
      direCli: client.direCli || "",
      idBarrio: client.idBarrio || null,
      idTipoDoc: client.idTipoDoc || null,
      activo: client.activo !== undefined ? client.activo : true,
    });
  };

  const handleActualizarUsuario = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        doc: editingId,
        nomcli1: editedData.nomcli1,
        nomcli2: editedData.nomcli2,
        apecli1: editedData.apecli1,
        apecli2: editedData.apecli2,
        correoElectronico: editedData.correoElectronico,
        numeroCli: parseInt(editedData.numeroCli),
        direCli: editedData.direCli,
        idBarrio: editedData.idBarrio ? parseInt(editedData.idBarrio) : null,
        idTipoDoc: editedData.idTipoDoc ? parseInt(editedData.idTipoDoc) : null,
        activo: editedData.activo,
      };

      console.log("Actualizando cliente:", editingId);
      console.log("Datos a enviar:", dataToSend);
      
      const resultado = await actualizarCliente(editingId, dataToSend);
      console.log("Resultado de actualización:", resultado);

      const data = await obtenerClientes();
      setClients(data);
      setFilteredClients(data); // Actualizar también los filtrados
      
      setEditingId(null);
      setEditedData({
        nomcli1: "",
        nomcli2: "",
        apecli1: "",
        apecli2: "",
        correoElectronico: "",
        numeroCli: "",
        direCli: "",
        idBarrio: null,
        idTipoDoc: null,
        activo: true,
      });
      
      alert("Cliente actualizado exitosamente");
    } catch (error) {
      console.error("Error completo al editar el cliente:", error);
      alert(`Error al editar el cliente: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({
      nomcli1: "",
      nomcli2: "",
      apecli1: "",
      apecli2: "",
      correoElectronico: "",
      numeroCli: "",
      direCli: "",
      idBarrio: null,
      idTipoDoc: null,
      activo: true,
    });
  };

  const handleViewClient = (client) => {
    setViewingClient(client);
  };

  const handleCloseView = () => {
    setViewingClient(null);
  };

  const handleDeleteClick = async (clientDoc) => {
    if (window.confirm(`¿Está seguro de que desea eliminar al cliente con documento ${clientDoc}?`)) {
      try {
        await eliminarCliente(clientDoc);
        const data = await obtenerClientes();
        setClients(data);
        setFilteredClients(data);
        alert("Cliente eliminado exitosamente");
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        alert(`Error al eliminar el cliente: ${error.message}`);
      }
    }
  };

  return (
    <>
      <NavbarSeller />
      <div className="clients-wrapper">
        <div className="clients-header">
          <h1 className="clients-title">Lista de Clientes</h1>
          <input 
            className="search-input" 
            placeholder="Buscar por documento" 
            value={searchTerm}
            onChange={handleSearchChange}
            type="text"
          />
        </div>
        <div className="container-clients-subtitle">
        <p className="clients-subtitle">Todos los clientes registrados</p>
        </div>

        <div className="clients-list">
          <div className="client-header">
            <span>Documento</span>
            <span>Nombre 1</span>
            <span>Nombre 2</span>
            <span>Apellido 1</span>
            <span>Apellido 2</span>
            <span>Correo</span>
            <span>Teléfono</span>
            <span>Acciones</span>
          </div>

          {filteredClients.length > 0 ? (
            filteredClients.map((cli) => (
              <div key={cli.doc} className="client-card">
                <div className="client-body">
                  <div className="client-field">{cli.doc}</div>
                  <div className="client-field">{cli.nomcli1}</div>
                  <div className="client-field">{cli.nomcli2}</div>
                  <div className="client-field">{cli.apecli1}</div>
                  <div className="client-field">{cli.apecli2}</div>
                  <div className="client-field">{cli.correoElectronico}</div>
                  <div className="client-field">{cli.numeroCli}</div>
                  <div className="client-field client-actions">
                    <button className="action-button view-button" onClick={() => handleViewClient(cli)} title="Ver más">
                      <HiEye />
                    </button>
                    <button className="action-button edit-button" onClick={() => handleEditClick(cli)} title="Editar">
                      <HiPencilSquare />
                    </button>
                    <button className="action-button delete-button" onClick={() => handleDeleteClick(cli.doc)} title="Eliminar">
                      <HiTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No se encontraron clientes con el documento &quot;{searchTerm}&quot;</p>
            </div>
          )}
        </div>
      </div>

      {editingId !== null && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleActualizarUsuario}>
            <h2>Editar Cliente</h2>
            <input
              type="text"
              value={editedData.nomcli1}
              onChange={(e) =>
                setEditedData({ ...editedData, nomcli1: e.target.value })
              }
              placeholder="Nombre 1"
            />
            <input
              type="text"
              value={editedData.nomcli2}
              onChange={(e) =>
                setEditedData({ ...editedData, nomcli2: e.target.value })
              }
              placeholder="Nombre 2"
            />
            <input
              type="text"
              value={editedData.apecli1}
              onChange={(e) =>
                setEditedData({ ...editedData, apecli1: e.target.value })
              }
              placeholder="Apellido 1"
            />
            <input
              type="text"
              value={editedData.apecli2}
              onChange={(e) =>
                setEditedData({ ...editedData, apecli2: e.target.value })
              }
              placeholder="Apellido 2"
            />
            <input
              type="email"
              value={editedData.correoElectronico}
              onChange={(e) =>
                setEditedData({ ...editedData, correoElectronico: e.target.value })
              }
              placeholder="Correo Electrónico"
            />
            <input
              type="text"
              value={editedData.numeroCli}
              onChange={(e) =>
                setEditedData({ ...editedData, numeroCli: e.target.value })
              }
              placeholder="Teléfono"
            />
            <input
              type="text"
              value={editedData.direCli}
              onChange={(e) =>
                setEditedData({ ...editedData, direCli: e.target.value })
              }
              placeholder="Dirección"
            />
            <select
              value={editedData.idBarrio || ""}
              onChange={(e) =>
                setEditedData({ ...editedData, idBarrio: e.target.value })
              }
            >
              <option value="">Seleccione un barrio</option>
              {barrios.map((barrio) => (
                <option key={barrio.idBarrio} value={barrio.idBarrio}>
                  {barrio.nombreBarrio}
                </option>
              ))}
            </select>
            <div className="activo-field">
              <label>
                <input
                  type="checkbox"
                  checked={editedData.activo}
                  onChange={(e) =>
                    setEditedData({ ...editedData, activo: e.target.checked })
                  }
                />
                <span>Cliente Activo</span>
              </label>
            </div>
            <select
              value={editedData.idTipoDoc || ""}
              onChange={(e) =>
                setEditedData({ ...editedData, idTipoDoc: e.target.value })
              }
            >
              <option value="">Seleccione tipo de documento</option>
              {tiposDoc.map((tipo) => (
                <option key={tipo.id_tipoDoc} value={tipo.id_tipoDoc}>
                  {tipo.nomDoc}
                </option>
              ))}
            </select>
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

      {viewingClient && (
        <div className="modal-overlay" onClick={handleCloseView}>
          <div className="modal view-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Detalles del Cliente</h2>
            <div className="client-details">
              <div className="detail-row">
                <span className="detail-label">Documento:</span>
                <span className="detail-value">{viewingClient.doc}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Primer Nombre:</span>
                <span className="detail-value">{viewingClient.nomcli1}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Segundo Nombre:</span>
                <span className="detail-value">{viewingClient.nomcli2 || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Primer Apellido:</span>
                <span className="detail-value">{viewingClient.apecli1}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Segundo Apellido:</span>
                <span className="detail-value">{viewingClient.apecli2 || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Correo Electrónico:</span>
                <span className="detail-value">{viewingClient.correoElectronico}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Teléfono:</span>
                <span className="detail-value">{viewingClient.numeroCli}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Dirección:</span>
                <span className="detail-value">{viewingClient.direCli || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Barrio:</span>
                <span className="detail-value">
                  {viewingClient.idBarrio 
                    ? barrios.find(b => b.idBarrio === viewingClient.idBarrio)?.nombreBarrio || "N/A"
                    : "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Tipo de Documento:</span>
                <span className="detail-value">
                  {viewingClient.idTipoDoc 
                    ? tiposDoc.find(t => t.id_tipoDoc === viewingClient.idTipoDoc)?.nomDoc || "N/A"
                    : "N/A"}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Estado:</span>
                <span className="detail-value">{viewingClient.activo ? "Activo" : "Inactivo"}</span>
              </div>
            </div>
            <div className="modal-buttons">
              <button type="button" onClick={handleCloseView}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Clients;
