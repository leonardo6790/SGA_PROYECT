import React, { useState, useEffect } from "react";
import "./New_order.styles.css";
import HomeSellerImage from "../../../assets/HomeSellerImage.png";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import { useNavigate, useLocation } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { obtenerArticulo } from "../../../api/articulosApi";
import { crearAlquiler } from "../../../api/alquilerApi";

export default function NewOrder() {
  const location = useLocation();
  const clienteRecibido = location.state?.cliente;

  const defaultCustomer = clienteRecibido ? {
    id: clienteRecibido.doc,
    name: `${clienteRecibido.nomcli1} ${clienteRecibido.nomcli2 || ''} ${clienteRecibido.apecli1} ${clienteRecibido.apecli2 || ''}`.trim(),
    email: clienteRecibido.correoElectronico || '',
    phone: clienteRecibido.numeroCli ? `+57 ${clienteRecibido.numeroCli}` : '',
    address: clienteRecibido.direCli || 'No especificada',
    document: `CC ${clienteRecibido.doc}`,
  } : {
    id: 1,
    name: "Miguel Paludo",
    email: "miguel@paludo.co",
    phone: "+57 300 123 4567",
    address: "Calle Falsa 123, Barrio Centro",
    document: "CC 12345678",
  };

  const customers = [defaultCustomer];

  const [catalog, setCatalog] = useState([]);
  const [selectedCustomer] = useState(customers[0]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  // Cargar artículos desde la base de datos
  useEffect(() => {
    const cargarArticulos = async () => {
      try {
        const articulosData = await obtenerArticulo();
        // Mapear los artículos de la BD al formato del catálogo
        const articulosMapeados = articulosData.map(art => ({
          id: art.idArt,
          name: art.nombre,
          price: art.precioArt,
          desc: `${art.generoArt} - Talla: ${art.tallaArt} - Color: ${art.colorArt}`,
          categoria: art.nomCate
        }));
        setCatalog(articulosMapeados);
        // Establecer el primer artículo como seleccionado por defecto
        if (articulosMapeados.length > 0) {
          setSelectedProductId(articulosMapeados[0].id);
        }
      } catch (error) {
        console.error("Error al cargar artículos:", error);
        alert("No se pudieron cargar los artículos");
      }
    };

    cargarArticulos();
  }, []);

  const addProductToOrder = () => {
    if (!selectedProductId) {
      alert("Por favor seleccione un artículo");
      return;
    }
    const prod = catalog.find((p) => p.id === Number(selectedProductId));
    if (!prod) return;
    setOrderItems((prev) => {
      const existingIndex = prev.findIndex((it) => it.id === prod.id);
      if (existingIndex > -1) {
        // merge: increment quantity and update subtotal
        const items = [...prev];
        const item = { ...items[existingIndex] };
        item.cantidad = (item.cantidad || 1) + 1;
        item.subtotal = item.cantidad * item.price;
        items[existingIndex] = item;
        return items;
      }
      return [...prev, { ...prod, cantidad: 1, subtotal: prod.price }];
    });
  };

  const buildItemsHtml = () => {
    // returns table rows for the template tbody
    return orderItems.map(it => `
      <tr>
        <td style="padding:8px; border:1px solid #eee;">${it.name}</td>
        <td style="text-align:center; padding:8px; border:1px solid #eee;">${it.cantidad}</td>
        <td style="text-align:right; padding:8px; border:1px solid #eee;">$${(it.cantidad * it.price).toLocaleString()}</td>
      </tr>
    `).join('');
  };

  const updateQuantity = (index, qty) => {
    const items = [...orderItems];
    items[index].cantidad = Number(qty);
    items[index].subtotal = items[index].cantidad * items[index].price;
    setOrderItems(items);
  };

  const total = orderItems.reduce((s, it) => s + (it.subtotal || it.price * it.cantidad), 0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const buildOrderHtml = () => {
    const itemsHtml = orderItems.map(it => `<li>${it.name} x${it.cantidad} - $${(it.price*it.cantidad).toLocaleString()}</li>`).join('');
    return `
      <h3>Orden para ${selectedCustomer.name}</h3>
      <p>Email: ${selectedCustomer.email} - Tel: ${selectedCustomer.phone}</p>
      <p>Dirección: ${selectedCustomer.address}</p>
      <p>Documento: ${selectedCustomer.document}</p>
      <p><strong>Fecha de inicio:</strong> ${startDate}</p>
      <p><strong>Fecha de entrega:</strong> ${endDate}</p>
      <p><strong>Fecha de devolución:</strong> ${returnDate}</p>
      <h4>Items:</h4>
      <ul>${itemsHtml}</ul>
      <p><strong>Total: $${total.toLocaleString()}</strong></p>
    `;
  };

  const handleSendOrder = async () => {
    // Validar que haya productos
    if (orderItems.length === 0) {
      alert("Debe agregar al menos un producto al pedido");
      return;
    }

    // Validar que haya fechas
    if (!startDate || !endDate || !returnDate) {
      alert("Debe completar todas las fechas");
      return;
    }

    setLoading(true);

    try {
      // Crear el objeto de alquiler para enviar al backend
      const alquilerData = {
        clienteDoc: selectedCustomer.id,
        fechaAlquiler: startDate,
        fechaEntrega: endDate,
        fechaRetiro: returnDate,
        totalAlquiler: total,
        articulos: orderItems.map(item => ({
          articuloId: item.id,
          precio: item.price,
          estado: false, // false = no devuelto
          observaciones: null
        }))
      };

      console.log("Guardando alquiler:", alquilerData);

      // Guardar en la base de datos
      const response = await crearAlquiler(alquilerData);
      console.log("Alquiler guardado:", response);

      // Mostrar mensaje de éxito
      setPopupMessage('Alquiler creado exitosamente');
      setShowPopup(true);

      // Ahora enviar el correo
      const toEmail = import.meta.env.VITE_EMAILJS_TO_EMAIL || 'miguelitomendez454@gmail.com';
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        try {
          const html = buildOrderHtml();
          const itemsHtml = buildItemsHtml();
          const itemsText = orderItems.map(it => `${it.name} x${it.cantidad} - $${(it.cantidad * it.price).toLocaleString()}`).join('\n');
          const templateParams = {
            email: toEmail,
            to_email: toEmail,
            reply_to: selectedCustomer.email,
            subject: `Nueva orden - ${selectedCustomer.name}`,
            message_html: html,
            items_html: itemsHtml,
            items_text: itemsText,
            customer_name: selectedCustomer.name,
            total: total,
          };
          console.log('Sending via EmailJS with params:', templateParams);
          await emailjs.send(serviceId, templateId, templateParams, publicKey);
          console.log('EmailJS send success');
        } catch (err) {
          console.error('EmailJS send failed:', err);
          // No bloqueamos si falla el correo, ya se guardó el alquiler
        }
      }

      // Navegar a órdenes después de un pequeño delay
      setTimeout(() => {
        setLoading(false);
        setShowPopup(false);
        navigate('/home-seller/orders');
      }, 1500);

    } catch (error) {
      console.error("Error al crear alquiler:", error);
      setLoading(false);
      setPopupMessage(`Error al crear alquiler: ${error.message}`);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <div
      className="new-order-container"
      style={{ backgroundImage: `url(${HomeSellerImage})` }}
    >
      <NavbarSeller />
      <div className="overlay"></div>

      <div className="order-form-section order-card">
        <h1 className="order-title">Registrar Nueva Orden</h1>

        <div className="customer-info-dates">
          <div className="customer-card">
            <h2>Información del Cliente</h2>
            <div className="customer-field"><strong>Nombre:</strong> {selectedCustomer.name}</div>
            <div className="customer-field"><strong>Email:</strong> {selectedCustomer.email}</div>
            <div className="customer-field"><strong>Teléfono:</strong> {selectedCustomer.phone}</div>
            <div className="customer-field"><strong>Dirección:</strong> {selectedCustomer.address}</div>
            <div className="customer-field"><strong>Documento:</strong> {selectedCustomer.document}</div>
          </div>

          <div className="rental-card">
            <h2>Fechas de Alquiler</h2>
            <label className="small-label">Fecha de inicio</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" />
            <label className="small-label">Fecha de entrega</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
            <label className="small-label">Fecha de devolución</label>
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="input-field" />
          </div>
        </div>

        <div className="products-section">
          <h2>Productos a Alquilar</h2>

          <div className="product-select-row">
            <select 
              className="product-select" 
              value={selectedProductId} 
              onChange={(e) => setSelectedProductId(e.target.value)}
              disabled={catalog.length === 0}
            >
              {catalog.length === 0 ? (
                <option value="">Cargando artículos...</option>
              ) : (
                catalog.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.price.toLocaleString()} — {p.desc}
                  </option>
                ))
              )}
            </select>
            <button 
              className="nc-button add-btn" 
              onClick={addProductToOrder}
              disabled={catalog.length === 0}
            >
              Añadir al pedido
            </button>
          </div>

          <div className="order-items-table">
            <div className="table-header"><span>Artículo</span><span>Cantidad</span><span>Precio</span><span>Subtotal</span></div>
            {orderItems.length === 0 && <div className="empty">No hay productos añadidos</div>}
            {orderItems.map((it, idx) => (
              <div className="table-row" key={idx}>
                <span className="col-name">{it.name}</span>
                <span className="col-qty"><input type="number" min={1} value={it.cantidad} onChange={(e) => updateQuantity(idx, e.target.value)} /></span>
                <span className="col-price">${it.price.toLocaleString()}</span>
                <span className="col-sub">${(it.cantidad * it.price).toLocaleString()}</span>
              </div>
            ))}
            <div className="table-footer"><span>Total</span><span></span><span></span><span className="total-amount">${total.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="form-actions">
          <button className="submit-button primary" onClick={handleSendOrder} disabled={orderItems.length === 0}>
            {orderItems.length === 0 ? 'Agregar productos para enviar' : 'Guardar y enviar orden'}
          </button>
          <button className="submit-button ghost" onClick={() => navigate('/home-seller')}>
            Cancelar
          </button>
        </div>
        {loading && (
          <div className="nc-spinner-overlay">
            <div className="nc-spinner" />
          </div>
        )}

        {showPopup && (
          <div className="nc-popup">
              <div className="nc-popup-content">
                <p>{popupMessage || 'Correo enviado exitosamente'}</p>
              </div>
            </div>
        )}
      </div>
    </div>
  );
}
