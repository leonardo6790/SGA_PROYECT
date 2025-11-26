import React, { useEffect, useState } from "react";
import "./Orders.styles.css";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { obtenerAlquileres } from "../../../api/alquilerApi";
import { eliminarArticuloDeAlquiler, marcarArticuloComoEntregado, marcarArticuloComoDevuelto } from "../../../api/alquilerArticulosApi";
import { obtenerClientePorId } from "../../../api/clientesApi";
import { HiEye } from "react-icons/hi2";


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [searchText, setSearchText] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [editData, setEditData] = useState({});
  const [filterByDate, setFilterByDate] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);
  const [activeTab, setActiveTab] = useState('entregar'); // 'entregar' o 'recibir'
  
  // Convertir alquileres a lista de artículos (una tarjeta por artículo)
  const [articleCards, setArticleCards] = useState([]);
  
  useEffect(() => {
    const cargarAlquileres = async () => {
      try {
        const token = localStorage.getItem("sga_token");
        if (!token) {
          console.log("No hay token, no se cargarán los alquileres");
          setLoading(false);
          return;
        }
        const data = await obtenerAlquileres();
        console.log("Alquileres cargados desde la API:", data);
        console.log("Cantidad de alquileres:", data ? data.length : 0);
        setOrders(data || []);
        
        // Convertir cada alquiler en tarjetas individuales por artículo
        const cards = [];
        if (data && data.length > 0) {
          data.forEach(alquiler => {
            console.log("Procesando alquiler:", alquiler);
            console.log("Artículos del alquiler:", alquiler.articulos);
            
            if (alquiler.articulos && alquiler.articulos.length > 0) {
              alquiler.articulos.forEach(articulo => {
                console.log("Procesando artículo:", articulo);
                cards.push({
                  id: `${alquiler.id_alquiler}-${articulo.articuloId}`,
                  idAlquiler: alquiler.id_alquiler,
                  articuloId: articulo.articuloId, // Guardar el ID del artículo directamente
                  clienteDoc: alquiler.clienteDoc,
                  nombreCliente: articulo.nomCliente || 'Cliente no disponible',
                  telefono: articulo.telCliente,
                  fechaAlquiler: alquiler.fechaAlquiler,
                  fechaEntrega: alquiler.fechaEntrega,
                  fechaRetiro: alquiler.fechaRetiro,
                  articulo: articulo.nomArticulo || 'Artículo sin nombre',
                  talla: articulo.tallaArticulo,
                  precio: articulo.precio,
                  estado: articulo.estado,
                  entregado: articulo.entregado || false, // Nuevo campo para controlar si fue entregado
                  observaciones: articulo.observaciones
                });
              });
            } else {
              // Si no hay artículos, crear una tarjeta vacía para el alquiler
              cards.push({
                id: `${alquiler.id_alquiler}-empty`,
                idAlquiler: alquiler.id_alquiler,
                clienteDoc: alquiler.clienteDoc,
                nombreCliente: 'Cliente no disponible',
                telefono: null,
                fechaAlquiler: alquiler.fechaAlquiler,
                fechaEntrega: alquiler.fechaEntrega,
                fechaRetiro: alquiler.fechaRetiro,
                articulo: 'Sin artículos',
                talla: '-',
                precio: 0,
                estado: false,
                observaciones: ''
              });
            }
          });
        }
        console.log("Tarjetas de artículos creadas:", cards);
        console.log("Total de tarjetas:", cards.length);
        setArticleCards(cards);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar alquileres:", error);
        setLoading(false);
      }
    };
    
    cargarAlquileres();
  }, []);

  // Separar las órdenes en dos categorías
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Órdenes a entregar: no han sido entregados y no han sido devueltos
  const ordersToDeliver = articleCards.filter(card => {
    return !card.entregado && !card.estado;
  });

  // Órdenes a recibir: ya fueron entregados pero no han sido devueltos
  const ordersToReceive = articleCards.filter(card => {
    return card.entregado && !card.estado;
  });

  // Filtrar tarjetas según búsqueda y fecha (solo si filterByDate está activo)
  const filteredCards = (activeTab === 'entregar' ? ordersToDeliver : ordersToReceive).filter(card => {
    // Si no hay búsqueda, solo aplicar filtro de fecha si está activo
    if (searchText === "") {
      if (filterByDate && startDate) {
        const cardDate = new Date(card.fechaAlquiler);
        const selectedDate = new Date(startDate);
        return cardDate.toDateString() === selectedDate.toDateString();
      }
      return true;
    }
    
    // Normalizar el texto de búsqueda
    const searchLower = searchText.toLowerCase().trim();
    
    // Buscar por ID de alquiler (coincidencia exacta o al inicio)
    const idAlquilerStr = card.idAlquiler.toString();
    const matchesId = idAlquilerStr === searchText || idAlquilerStr.startsWith(searchText);
    
    // Buscar por nombre de cliente (coincidencia parcial)
    const matchesNombre = card.nombreCliente && 
                          card.nombreCliente.toLowerCase().includes(searchLower);
    
    // Buscar por documento de cliente (coincidencia exacta o al inicio)
    const docStr = card.clienteDoc ? card.clienteDoc.toString() : '';
    const matchesDoc = docStr === searchText || docStr.startsWith(searchText);
    
    // Buscar por nombre del artículo (coincidencia parcial)
    const matchesArticulo = card.articulo && 
                            card.articulo.toLowerCase().includes(searchLower);
    
    const matchesSearch = matchesId || matchesNombre || matchesDoc || matchesArticulo;
    
    // Filtro por fecha (solo si está activado el filtro)
    let matchesDate = true;
    if (filterByDate && startDate) {
      const cardDate = new Date(card.fechaAlquiler);
      const selectedDate = new Date(startDate);
      matchesDate = cardDate.toDateString() === selectedDate.toDateString();
    }
    
    return matchesSearch && matchesDate;
  });

  const handleDelete = async (card) => {
    if (!window.confirm(`¿Estás seguro de eliminar el artículo "${card.articulo}" del alquiler #${card.idAlquiler}?`)) {
      return;
    }

    try {
      console.log(`Eliminando artículo ID: ${card.articuloId} del alquiler ID: ${card.idAlquiler}`);
      
      // Llamar al backend para eliminar el artículo
      await eliminarArticuloDeAlquiler(card.articuloId, card.idAlquiler);
      
      // Eliminar la tarjeta del estado local
      setArticleCards(articleCards.filter(c => c.id !== card.id));
      
      alert('Artículo eliminado exitosamente del alquiler');
    } catch (error) {
      console.error('Error al eliminar artículo:', error);
      alert('Error al eliminar el artículo. Por favor, intenta nuevamente.');
    }
  };

  const handleEdit = (card) => {
    setEditingOrder(card.id);
    setEditData({...card});
  };

  const handleUpdateSave = () => {
    // Aquí podrías implementar la actualización en el backend
    setArticleCards(articleCards.map(card => card.id === editingOrder ? editData : card));
    setEditingOrder(null);
  };

  const handleCancel = () => {
    setEditingOrder(null);
  };

  const handleSearch = () => {
    // Activar filtro por fecha cuando se presiona el botón Buscar
    setFilterByDate(true);
    console.log("Buscando por fecha:", startDate);
  };
  
  const handleClearFilters = () => {
    setSearchText("");
    setFilterByDate(false);
    console.log("Filtros limpiados");
  };

  const handleViewMore = async (card) => {
    try {
      const clienteData = await obtenerClientePorId(card.clienteDoc);
      setViewingClient(clienteData);
      setViewingOrder(card);
    } catch (error) {
      console.error("Error al cargar datos del cliente:", error);
      alert("Error al cargar los datos del cliente");
    }
  };

  const handleCloseView = () => {
    setViewingOrder(null);
    setViewingClient(null);
  };

  const handleMarkAsDelivered = async (card) => {
    if (window.confirm(`¿Confirmar que el artículo "${card.articulo}" ha sido entregado al cliente?`)) {
      try {
        await marcarArticuloComoEntregado(card.articuloId, card.idAlquiler);
        
        // Actualizar el estado local
        setArticleCards(articleCards.map(c => 
          c.id === card.id ? {...c, entregado: true} : c
        ));
        
        alert("Artículo marcado como entregado. Ahora aparecerá en 'Órdenes a Recibir'");
      } catch (error) {
        console.error("Error al marcar como entregado:", error);
        alert("Error al marcar como entregado. Por favor, intenta nuevamente.");
      }
    }
  };

  const handleMarkAsReceived = async (card) => {
    if (window.confirm(`¿Confirmar que el artículo "${card.articulo}" ha sido devuelto? El artículo volverá a estar disponible para alquiler.`)) {
      try {
        await marcarArticuloComoDevuelto(card.articuloId, card.idAlquiler);
        
        // Actualizar el estado local - marcar como devuelto
        setArticleCards(articleCards.map(c => 
          c.id === card.id ? {...c, estado: true} : c
        ));
        
        alert("Artículo marcado como devuelto. El artículo ya está disponible para alquiler nuevamente.");
      } catch (error) {
        console.error("Error al marcar como devuelto:", error);
        alert("Error al marcar como devuelto. Por favor, intenta nuevamente.");
      }
    }
  };

  return (
    <div className="orders-wrapper">
      <NavbarSeller />
      <aside className="orders-sidebar">
        <h2>Buscar Orden</h2>
        <input 
          type="text" 
          placeholder="Número de orden o cliente" 
          value={searchText} 
          onChange={(e) => setSearchText(e.target.value)} 
        />
        <h2>Filtrar por fecha</h2>
        <div className="calendar-container">
          <DatePicker 
            selected={startDate} 
            onChange={(date) => setStartDate(date)} 
            inline 
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled
            }) => (
              <div className="custom-header">
                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>&lt;</button>
                <span>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>&gt;</button>
              </div>
            )}
          />
        </div>
        <button onClick={handleSearch}>Buscar por fecha</button>
        <button onClick={handleClearFilters} style={{marginTop: '10px', backgroundColor: '#95a5a6'}}>
          Limpiar filtros
        </button>
      </aside>

      <div className="orders-container">
        <h1 className="orders-title">Gestión de Órdenes</h1>
        
        <div className="orders-tabs">
          <button 
            className={`tab-button ${activeTab === 'entregar' ? 'active' : ''}`}
            onClick={() => setActiveTab('entregar')}
          >
            📦 Órdenes a Entregar ({ordersToDeliver.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'recibir' ? 'active' : ''}`}
            onClick={() => setActiveTab('recibir')}
          >
            📥 Órdenes a Recibir ({ordersToReceive.length})
          </button>
        </div>

        <p className="orders-subtitle">
          {searchText || filterByDate
            ? `Mostrando ${filteredCards.length} resultado(s)${searchText ? ` para "${searchText}"` : ''}${filterByDate ? ` (fecha: ${startDate.toLocaleDateString()})` : ''}`
            : `${activeTab === 'entregar' ? 'Órdenes pendientes de entrega' : 'Órdenes pendientes de devolución'} (${filteredCards.length} artículos)`
          }
        </p>

        {loading && <p>Cargando alquileres...</p>}
        
        {!loading && articleCards.length === 0 && (
          <p>No hay alquileres registrados</p>
        )}

        {!loading && filteredCards.length === 0 && articleCards.length > 0 && (
          <p>No se encontraron resultados para tu búsqueda</p>
        )}

        <div className="orders-list">
          {filteredCards.map((card) => (
            <div key={card.id} className="order-card">
              <div className="order-header">
                <span>ID Alquiler</span>
                <span>Cliente</span>
                <span>Teléfono</span>
                <span>Artículo</span>
                <span>Talla</span>
                <span>Precio</span>
                <span>{activeTab === 'entregar' ? 'Fecha Entrega' : 'Fecha Devolución'}</span>
                <span>Estado</span>
                <span>Acciones</span>
              </div>
              <div className="order-body">
                <div className="order-field">#{card.idAlquiler}</div>
                <div className="order-field">
                  <strong>{card.nombreCliente}</strong>
                  <br />
                  <small>Doc: {card.clienteDoc}</small>
                </div>
                <div className="order-field">{card.telefono || 'N/A'}</div>
                <div className="order-field"><strong>{card.articulo}</strong></div>
                <div className="order-field">{card.talla || 'N/A'}</div>
                <div className="order-field">${card.precio?.toLocaleString()}</div>
                <div className="order-field">
                  {activeTab === 'entregar' ? card.fechaEntrega : card.fechaRetiro}
                </div>
                <div className="order-field">
                  <span className={`status-badge ${card.estado ? 'devuelto' : 'pendiente'}`}>
                    {card.estado ? '✓ Devuelto' : '⏳ Pendiente'}
                  </span>
                </div>
                <div className="order-buttons">
                  <button className="view-btn" onClick={() => handleViewMore(card)} title="Ver más">
                    <HiEye /> Ver más
                  </button>
                  {activeTab === 'entregar' && (
                    <button className="deliver-btn" onClick={() => handleMarkAsDelivered(card)}>
                      ✓ Entregado
                    </button>
                  )}
                  {activeTab === 'recibir' && (
                    <button className="receive-btn" onClick={() => handleMarkAsReceived(card)}>
                      ✓ Recibido
                    </button>
                  )}
                  <button className="delete-btn" onClick={() => handleDelete(card)}>Eliminar</button>
                </div>
              </div>
              {card.observaciones && (
                <div className="order-footer">
                  <strong>Observaciones:</strong> {card.observaciones}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {viewingOrder && viewingClient && (
        <div className="modal-overlay" onClick={handleCloseView}>
          <div className="modal view-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Detalles de la Orden</h2>
            
            <div className="modal-section">
              <h3>Información del Alquiler</h3>
              <div className="detail-row">
                <span className="detail-label">ID Alquiler:</span>
                <span className="detail-value">#{viewingOrder.idAlquiler}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Artículo:</span>
                <span className="detail-value">{viewingOrder.articulo}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Talla:</span>
                <span className="detail-value">{viewingOrder.talla || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Precio:</span>
                <span className="detail-value">${viewingOrder.precio?.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fecha Alquiler:</span>
                <span className="detail-value">{viewingOrder.fechaAlquiler}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fecha Entrega:</span>
                <span className="detail-value">{viewingOrder.fechaEntrega}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fecha Retiro:</span>
                <span className="detail-value">{viewingOrder.fechaRetiro}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Estado:</span>
                <span className="detail-value">
                  <span className={`status-badge ${viewingOrder.estado ? 'devuelto' : 'pendiente'}`}>
                    {viewingOrder.estado ? '✓ Devuelto' : '⏳ Pendiente'}
                  </span>
                </span>
              </div>
              {viewingOrder.observaciones && (
                <div className="detail-row">
                  <span className="detail-label">Observaciones:</span>
                  <span className="detail-value">{viewingOrder.observaciones}</span>
                </div>
              )}
            </div>

            <div className="modal-section">
              <h3>Información del Cliente</h3>
              <div className="detail-row">
                <span className="detail-label">Documento:</span>
                <span className="detail-value">{viewingClient.doc}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Nombre Completo:</span>
                <span className="detail-value">
                  {viewingClient.nomcli1} {viewingClient.nomcli2 || ''} {viewingClient.apecli1} {viewingClient.apecli2 || ''}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Teléfono:</span>
                <span className="detail-value">{viewingClient.numeroCli}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Correo:</span>
                <span className="detail-value">{viewingClient.correoElectronico}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Dirección:</span>
                <span className="detail-value">{viewingClient.direCli || 'N/A'}</span>
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

      {editingOrder && (
        <div className="edit-overlay">
          <div className="edit-modal">
            <h2>Actualizar Artículo - Alquiler #{editData.idAlquiler}</h2>
            <label>Cliente</label>
            <input 
              type="text" 
              value={editData.nombreCliente || ''} 
              onChange={(e)=>setEditData({...editData, nombreCliente:e.target.value})} 
              placeholder="Nombre del cliente" 
              disabled
            />
            <label>Teléfono</label>
            <input 
              type="text" 
              value={editData.telefono || ''} 
              onChange={(e)=>setEditData({...editData, telefono:e.target.value})} 
              placeholder="Teléfono" 
            />
            <label>Artículo</label>
            <input 
              type="text" 
              value={editData.articulo || ''} 
              onChange={(e)=>setEditData({...editData, articulo:e.target.value})} 
              placeholder="Nombre del artículo" 
              disabled
            />
            <label>Talla</label>
            <input 
              type="text" 
              value={editData.talla || ''} 
              onChange={(e)=>setEditData({...editData, talla:e.target.value})} 
              placeholder="Talla" 
            />
            <label>Precio</label>
            <input 
              type="number" 
              value={editData.precio || 0} 
              onChange={(e)=>setEditData({...editData, precio:parseInt(e.target.value)})} 
              placeholder="Precio" 
            />
            <label>Estado</label>
            <select 
              value={editData.estado ? 'true' : 'false'} 
              onChange={(e)=>setEditData({...editData, estado: e.target.value === 'true'})}
            >
              <option value="false">⏳ Pendiente</option>
              <option value="true">✓ Devuelto</option>
            </select>
            <label>Observaciones</label>
            <textarea 
              value={editData.observaciones || ''} 
              onChange={(e)=>setEditData({...editData, observaciones:e.target.value})} 
              placeholder="Observaciones" 
              rows="3"
            />
            <div className="edit-buttons">
              <button onClick={handleUpdateSave}>Guardar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
