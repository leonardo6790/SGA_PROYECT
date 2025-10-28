import React, { useEffect, useState } from "react";
import "./Orders.styles.css";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { obtenerAlquileres } from "../../../api/alquilerApi";


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar alquileres:", error);
        setLoading(false);
      }
    };
    
    cargarAlquileres();
  }, []);

  const [startDate, setStartDate] = useState(new Date());
  const [searchText, setSearchText] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [editData, setEditData] = useState({});

  const handleDelete = (orderNumber) => {
    setOrders(orders.filter(order => order.orderNumber !== orderNumber));
  };

  const handleEdit = (order) => {
    setEditingOrder(order.orderNumber);
    setEditData({...order});
  };

  const handleUpdateSave = () => {
    setOrders(orders.map(order => order.orderNumber === editingOrder ? editData : order));
    setEditingOrder(null);
  };

  const handleCancel = () => {
    setEditingOrder(null);
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
        <button>Buscar</button>
      </aside>

      <div className="orders-container">
        <h1 className="orders-title">Órdenes recientes</h1>
        <p className="orders-subtitle">Lista completa de órdenes registradas</p>

        {loading && <p>Cargando alquileres...</p>}
        
        {!loading && orders.length === 0 && (
          <p>No hay alquileres registrados</p>
        )}

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id_alquiler} className="order-card">
              <div className="order-header">
                <span>ID Alquiler</span>
                <span>Cliente</span>
                <span>Fecha Alquiler</span>
                <span>Fecha Entrega</span>
                <span>Fecha Devolución</span>
                <span>Total</span>
                <span>Artículos</span>
                <span>Acciones</span>
              </div>
              <div className="order-body">
                <div className="order-field">{order.id_alquiler}</div>
                <div className="order-field">Doc: {order.clienteDoc}</div>
                <div className="order-field">{order.fechaAlquiler}</div>
                <div className="order-field">{order.fechaEntrega}</div>
                <div className="order-field">{order.fechaRetiro}</div>
                <div className="order-field">${order.totalAlquiler?.toLocaleString()}</div>
                <div className="order-field">
                  {order.articulos && order.articulos.length > 0 ? (
                    <ul style={{margin: 0, paddingLeft: '20px'}}>
                      {order.articulos.map((art, idx) => (
                        <li key={idx}>
                          {art.nomArticulo} - Talla: {art.tallaArticulo} - ${art.precio?.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'Sin artículos'
                  )}
                </div>
                <div className="order-buttons">
                  <button className="update-btn" onClick={() => handleEdit(order)}>Actualizar</button>
                  <button className="delete-btn" onClick={() => handleDelete(order.id_alquiler)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingOrder && (
        <div className="edit-overlay">
          <div className="edit-modal">
            <h2>Actualizar Orden {editingOrder}</h2>
            <input type="text" value={editData.orderNumber} onChange={(e)=>setEditData({...editData, orderNumber:e.target.value})} placeholder="Número de orden" />
            <input type="text" value={editData.item} onChange={(e)=>setEditData({...editData, item:e.target.value})} placeholder="Artículo" />
            <input type="text" value={editData.observations} onChange={(e)=>setEditData({...editData, observations:e.target.value})} placeholder="Observaciones" />
            <input type="text" value={editData.client} onChange={(e)=>setEditData({...editData, client:e.target.value})} placeholder="Cliente" />
            <input type="text" value={editData.phone} onChange={(e)=>setEditData({...editData, phone:e.target.value})} placeholder="Teléfono" />
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
