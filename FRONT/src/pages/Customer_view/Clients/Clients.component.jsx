import React, { useEffect, useState } from "react";
import "./Clients.styles.css";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import { obtenerUsuario, editarUsuario } from "../../../api/usuariosApi";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({
    numDocumento: 0,
    nombre1: "",
    nombre2: "",
    apellido1: "",
    apellido2: "",
    correoElectronico: "",
    tele: "",
  });

  useEffect(() => {
    obtenerUsuario().then((data) => setClients(data));
  }, []);

  const handleEditClick = (client) => {
    setEditingId(client.numDocumento);
    setEditedData({
      nombre1: client.nombre1,
      nombre2: client.nombre2,
      apellido1: client.apellido1,
      apellido2: client.apellido2,
      correoElectronico: client.correoElectronico,
      tele: client.tele,
    });
  };

  const handleActualizarUsuario = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        numDocumento: cli.numDocumento,
        nombre1: editedData.nombre1,
        nombre2: editedData.nombre2,
        apellido1: editedData.apellido1,
        apellido2: editedData.apellido2,
        correoElectronico: editedData.correoElectronico,
        tele: editedData.tele,
      };

      console.log("in2",editingId)
      console.log("data",dataToSend )
      await editarUsuario(editingId, dataToSend);

      setClients((prev) =>
        prev.map((c) =>
          c.numeroDoc === editingId ? { ...c, ...editedData } : c
        )
      );
      setEditingId(null);
      setEditedData({
        nombre1: "",
        nombre2: "",
        apellido1: "",
        apellido2: "",
        correoElectronico: "",
        tele: "",
      });
    } catch (error) {
      console.log("Error al editar el usuario:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({
      nombre1: "",
      nombre2: "",
      apellido1: "",
      apellido2: "",
      correoElectronico: "",
      tele: "",
    });
  };

  return (
    <>
      <NavbarSeller />
      <div className="clients-wrapper">
        <div className="clients-header">
          <h1 className="clients-title">Lista de Clientes</h1>
          <input className="search-input" placeholder="Buscar cliente" />
        </div>
        <p className="clients-subtitle">Todos los clientes registrados</p>

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

          {clients.map((cli) => (
            <div key={cli.numeroDoc} className="client-card">
              <div className="client-body">
                <div className="client-field">{cli.numeroDoc}</div>
                <div className="client-field">{cli.nombre1}</div>
                <div className="client-field">{cli.nombre2}</div>
                <div className="client-field">{cli.apellido1}</div>
                <div className="client-field">{cli.apellido2}</div>
                <div className="client-field">{cli.correoElectronico}</div>
                <div className="client-field">{cli.tele}</div>
                <button onClick={() => handleEditClick(cli)}>Editar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingId !== null && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleActualizarUsuario}>
            <h2>Editar Cliente</h2>
            <input
              type="text"
              value={editedData.nombre1}
              onChange={(e) =>
                setEditedData({ ...editedData, nombre1: e.target.value })
              }
              placeholder="Nombre 1"
            />
            <input
              type="text"
              value={editedData.nombre2}
              onChange={(e) =>
                setEditedData({ ...editedData, nombre2: e.target.value })
              }
              placeholder="Nombre 2"
            />
            <input
              type="text"
              value={editedData.apellido1}
              onChange={(e) =>
                setEditedData({ ...editedData, apellido1: e.target.value })
              }
              placeholder="Apellido 1"
            />
            <input
              type="text"
              value={editedData.apellido2}
              onChange={(e) =>
                setEditedData({ ...editedData, apellido2: e.target.value })
              }
              placeholder="Apellido 2"
            />
            <input
              type="text"
              value={editedData.correoElectronico}
              onChange={(e) =>
                setEditedData({ ...editedData, correoElectronico: e.target.value })
              }
              placeholder="Correo Electrónico"
            />
            <input
              type="text"
              value={editedData.tele}
              onChange={(e) =>
                setEditedData({ ...editedData, tele: e.target.value })
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
