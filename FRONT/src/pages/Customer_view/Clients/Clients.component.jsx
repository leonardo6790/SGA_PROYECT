import React, { useEffect, useState } from "react";
import "./Clients.styles.css";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import { obtenerClientes, actualizarCliente } from "../../../api/clientesApi";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({
    nomcli1: "",
    nomcli2: "",
    apecli1: "",
    apecli2: "",
    correoElectronico: "",
    numeroCli: "",
  });

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const token = localStorage.getItem("sga_token");
        if (!token) {
          console.log("No hay token, no se cargarán los clientes");
          return;
        }
        const data = await obtenerClientes();
        console.log("Clientes recibidos:", data);
        setClients(data);
        setFilteredClients(data); // Inicialmente mostrar todos los clientes
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };
    
    cargarClientes();
  }, []);

  // Filtrar clientes cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter((client) => 
        String(client.doc).includes(searchTerm.trim())
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
    });
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
        <p className="clients-subtitle">
          {searchTerm ? `Mostrando ${filteredClients.length} resultado(s)` : `Todos los clientes registrados (${clients.length})`}
        </p>

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
                  <button onClick={() => handleEditClick(cli)}>Editar</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No se encontraron clientes con el documento "{searchTerm}"</p>
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
    </>
  );
};

export default Clients;
