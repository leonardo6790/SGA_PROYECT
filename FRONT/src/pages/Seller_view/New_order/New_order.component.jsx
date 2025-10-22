import React, { useState } from "react";
import "./New_order.styles.css";
import HomeSellerImage from "../../../assets/HomeSellerImage.png";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';

export default function NewOrder() {
  const customers = [
    {
      id: 1,
      name: "Miguel Paludo",
      email: "miguel@paludo.co",
      phone: "+57 300 123 4567",
      address: "Calle Falsa 123, Barrio Centro",
      document: "CC 12345678",
    },
  ];

  const catalog = [
    { id: 1, name: "Vestido Gala Negro", price: 120000, desc: "Seda, corte sirena" },
    { id: 2, name: "Vestido Encaje Champagne", price: 140000, desc: "Encaje fino, corte A" },
    { id: 3, name: "Vestido Largo Burdeos", price: 130000, desc: "Terciopelo elegante" },
    { id: 4, name: "Vestido Halter Plateado", price: 150000, desc: "Brillo sutil" },
    { id: 5, name: "Vestido Corte Imperio Azul", price: 110000, desc: "Gasa ligera" },
    { id: 6, name: "Vestido Asimétrico Verde", price: 125000, desc: "Detalle drapeado" },
    { id: 7, name: "Vestido Satin Rosa", price: 115000, desc: "Satin clásico" },
    { id: 8, name: "Vestido Vintage Marfil", price: 135000, desc: "Bordado artesanal" },
    { id: 9, name: "Vestido Column Negro", price: 145000, desc: "Corte recto elegante" },
    { id: 10, name: "Vestido Tul Noche", price: 155000, desc: "Tul con pedrería" },
  ];

  const [selectedCustomer] = useState(customers[0]);
  const [selectedProductId, setSelectedProductId] = useState(catalog[0].id);
  const [orderItems, setOrderItems] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");

  const addProductToOrder = () => {
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
      <p>Fechas: ${startDate} → ${endDate}</p>
      <h4>Items:</h4>
      <ul>${itemsHtml}</ul>
      <p><strong>Total: $${total.toLocaleString()}</strong></p>
    `;
  };

  const handleSendOrder = async () => {
    // Recipient from env (set in project .env) with hard fallback
    const toEmail = import.meta.env.VITE_EMAILJS_TO_EMAIL || 'miguelitomendez454@gmail.com';
    const html = buildOrderHtml();

    // Prefer EmailJS if configured
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    setLoading(true);
    console.log('handleSendOrder start', { serviceId, templateId, publicKey, toEmail });

    if (serviceId && templateId && publicKey) {
      try {
        const itemsHtml = buildItemsHtml();
        const itemsText = orderItems.map(it => `${it.name} x${it.cantidad} - $${(it.cantidad * it.price).toLocaleString()}`).join('\n');
        const templateParams = {
          // EmailJS template expects {{email}} as recipient variable according to your template settings
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
        const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
        console.log('EmailJS send success', result);
        setPopupMessage('Correo enviado exitosamente');
        setShowPopup(true);
        setTimeout(() => {
          setLoading(false);
          setShowPopup(false);
          navigate('/home-seller/orders');
        }, 900);
        return;
      } catch (err) {
        // EmailJS returns a Response-like error for HTTP failures; log everything we can
        console.error('EmailJS send failed (raw):', err);
        try {
          // some errors come with status and text
          console.error('EmailJS error status:', err?.status);
          console.error('EmailJS error text:', err?.text || err?.message || JSON.stringify(err));
          setPopupMessage(`Error al enviar (EmailJS): ${err?.status || ''} ${err?.text || err?.message || ''}`);
        } catch (logErr) {
          console.error('Error logging EmailJS failure:', logErr);
          setPopupMessage('Error al enviar (detalles en consola)');
        }
        setShowPopup(true);
        // fall through to mailto fallback after logging so user can still send the mail manually
      }
    }

    // mailto fallback: open mail client with prefilled content and navigate after short delay
  const itemsTextForMail = orderItems.map(it => `${it.name} x${it.cantidad} - $${(it.cantidad * it.price).toLocaleString()}`).join('\n');
  const mailBody = `Orden para ${selectedCustomer.name}\nEmail: ${selectedCustomer.email}\nTel: ${selectedCustomer.phone}\nDirección: ${selectedCustomer.address}\nDocumento: ${selectedCustomer.document}\nFechas: ${startDate} -> ${endDate}\n\nItems:\n${itemsTextForMail}\n\nTotal: $${total.toLocaleString()}`;
  const mailto = `mailto:${toEmail}?subject=${encodeURIComponent('Nueva orden - '+selectedCustomer.name)}&body=${encodeURIComponent(mailBody)}`;
    console.log('Using mailto fallback:', mailto);
    window.location.href = mailto;
    setPopupMessage('Se abrió el cliente de correo. Complete y envíe el mensaje para que llegue al correo.');
    setShowPopup(true);
    setTimeout(() => {
      setLoading(false);
      setShowPopup(false);
      navigate('/home-seller/orders');
    }, 900);
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
          </div>
        </div>

        <div className="products-section">
          <h2>Productos a Alquilar</h2>

          <div className="product-select-row">
            <select className="product-select" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
              {catalog.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — ${p.price.toLocaleString()}</option>
              ))}
            </select>
            <button className="nc-button add-btn" onClick={addProductToOrder}>Añadir al pedido</button>
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
