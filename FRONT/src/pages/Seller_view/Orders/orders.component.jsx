import React, { useEffect, useState } from "react";
import "./Orders.styles.css";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { obtenerAlquiler } from "../../../api/alquilerArticulosApi";
import { data } from "react-router-dom";


const Orders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    obtenerAlquiler().then((data) => setOrders(data))
  }, [])

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

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.alquilerId} className="order-card">
<div className="order-header">
  <span>Número de orden</span>
  <span>Artículo</span>
  <span>Talla</span>
  <span>Observaciones</span>
  <span>Cliente</span>
  <span>Teléfono</span>
  <span>Fecha</span>
  <span>Acciones</span>
</div>
<div className="order-body">
  <div className="order-field">{order.alquilerId}</div>
  <div className="order-field">{order.nomArticulo}</div>
  <div className="order-field">{order.tallaArticulo}</div>
  <div className="order-field">{order.observaciones}</div>
  <div className="order-field">{order.nomCliente}</div>
  <div className="order-field">{order.telCliente}</div>
  <div className="order-field">{order.fechaEntrega}</div>
  <div className="order-buttons">
    <button className="update-btn" onClick={() => handleEdit(order)}>Actualizar</button>
    <button className="delete-btn" onClick={() => handleDelete(order.orderNumber)}>Eliminar</button>
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
