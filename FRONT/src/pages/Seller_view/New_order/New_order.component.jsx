import React, { useState, useEffect } from "react";
import "./New_order.styles.css";
import HomeSellerImage from "../../../assets/HomeSellerImage.png";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import { useNavigate, useLocation } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { obtenerArticulo } from "../../../api/articulosApi";
import { crearAlquiler } from "../../../api/alquilerApi";
import { crearPago } from "../../../api/pagoApi";
import { obtenerVendedores } from "../../../api/usuariosApi";

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
  const [showObsModal, setShowObsModal] = useState(false);
  const [currentObsIndex, setCurrentObsIndex] = useState(null);
  const [tempObservacion, setTempObservacion] = useState("");

  // Estados para buscador de artículos
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Estados para pagos
  const [showPaymentPanel, setShowPaymentPanel] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [registeredPayments, setRegisteredPayments] = useState([]);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [isClosingPanel, setIsClosingPanel] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editPaymentAmount, setEditPaymentAmount] = useState("");

  // Estados para vendedores
  const [vendedores, setVendedores] = useState([]);
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState("");

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

  // Cargar vendedores desde la base de datos
  useEffect(() => {
    const cargarVendedores = async () => {
      try {
        const vendedoresData = await obtenerVendedores();
        setVendedores(vendedoresData);
        // Seleccionar el primer vendedor por defecto si hay alguno
        if (vendedoresData.length > 0) {
          setVendedorSeleccionado(vendedoresData[0].numDocumento);
        }
      } catch (error) {
        console.error("Error al cargar vendedores:", error);
      }
    };

    cargarVendedores();
  }, []);

  // Función para buscar artículos
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.trim() === "") {
      setShowSearchResults(false);
      setFilteredProducts([]);
      return;
    }

    // Filtrar artículos que NO estén ya en el pedido
    const articulosEnPedido = orderItems.map(item => item.id);
    const filtered = catalog.filter(product =>
      !articulosEnPedido.includes(product.id) && // Excluir artículos ya agregados
      (product.name.toLowerCase().includes(value) ||
        product.desc.toLowerCase().includes(value) ||
        product.categoria.toLowerCase().includes(value))
    );

    setFilteredProducts(filtered);
    setShowSearchResults(true);
  };

  const handleSelectFromSearch = (product) => {
    setSelectedProductId(product.id);
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
  };

  const addProductToOrder = () => {
    if (!selectedProductId) {
      alert("Por favor seleccione un artículo");
      return;
    }
    const prod = catalog.find((p) => p.id === Number(selectedProductId));
    if (!prod) return;

    // Verificar si el artículo ya está en el pedido
    const existingIndex = orderItems.findIndex((it) => it.id === prod.id);
    if (existingIndex > -1) {
      alert("Este artículo ya está agregado al pedido. Cada vestido es único y solo se puede agregar una vez.");
      return;
    }

    // Agregar el artículo con cantidad fija de 1
    setOrderItems((prev) => [...prev, { ...prod, cantidad: 1, subtotal: prod.price, observaciones: "" }]);

    // Limpiar la selección y refrescar búsqueda si está activa
    setSelectedProductId("");
    if (searchTerm.trim() !== "") {
      handleSearchChange({ target: { value: searchTerm } });
    }
  };

  const removeProductFromOrder = (index) => {
    setOrderItems((prev) => prev.filter((_, idx) => idx !== index));
    // Si hay una búsqueda activa, refrescar los resultados
    if (searchTerm.trim() !== "") {
      setTimeout(() => {
        handleSearchChange({ target: { value: searchTerm } });
      }, 100);
    }
  };

  // Funciones para pagos
  const calculateTotal = () => {
    return orderItems.reduce((sum, it) => sum + (it.cantidad * it.price), 0);
  };

  const calculateTotalPaid = () => {
    return registeredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const calculateBalance = () => {
    return calculateTotal() - calculateTotalPaid();
  };

  const handleAddPayment = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      alert("Por favor ingresa un monto válido");
      return;
    }

    const amount = parseInt(paymentAmount);
    const balance = calculateBalance();

    if (amount > balance) {
      alert(`El monto del pago ($${amount.toLocaleString()}) supera el saldo pendiente ($${balance.toLocaleString()})`);
      return;
    }

    setLoadingPayment(true);
    try {
      // Agregar el pago localmente (se guardará en la BD después al crear la orden)
      setRegisteredPayments([...registeredPayments, {
        amount,
        date: new Date().toLocaleDateString(),
        id: Date.now()
      }]);
      setPaymentAmount("");
      alert("Pago registrado exitosamente");
    } catch (error) {
      console.error("Error al registrar pago:", error);
      alert("Error al registrar el pago");
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleDeletePayment = (paymentId) => {
    if (window.confirm("¿Estás seguro de eliminar este pago?")) {
      setRegisteredPayments(registeredPayments.filter(p => p.id !== paymentId));
    }
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment.id);
    setEditPaymentAmount(payment.amount.toString());
  };

  const handleCancelEditPayment = () => {
    setEditingPayment(null);
    setEditPaymentAmount("");
  };

  const handleSaveEditPayment = (payment) => {
    if (!editPaymentAmount || editPaymentAmount <= 0) {
      alert("Por favor ingresa un monto válido");
      return;
    }

    const amount = parseInt(editPaymentAmount);
    const balance = calculateBalance() + payment.amount; // Agregar el monto original al balance

    if (amount > balance) {
      alert(`El monto del pago ($${amount.toLocaleString()}) supera el saldo disponible ($${balance.toLocaleString()})`);
      return;
    }

    // Actualizar el pago
    setRegisteredPayments(registeredPayments.map(p =>
      p.id === payment.id
        ? { ...p, amount, date: new Date().toLocaleDateString() }
        : p
    ));

    setEditingPayment(null);
    setEditPaymentAmount("");
    alert("Pago actualizado exitosamente");
  };

  const handleTogglePaymentPanel = () => {
    if (showPaymentPanel) {
      setIsClosingPanel(true);
      setTimeout(() => {
        setShowPaymentPanel(false);
        setIsClosingPanel(false);
      }, 300);
    } else {
      setShowPaymentPanel(true);
      setIsClosingPanel(false);
    }
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

  const openObsModal = (index) => {
    setCurrentObsIndex(index);
    setTempObservacion(orderItems[index].observaciones || "");
    setShowObsModal(true);
  };

  const saveObservacion = () => {
    if (currentObsIndex !== null) {
      const items = [...orderItems];
      items[currentObsIndex].observaciones = tempObservacion;
      setOrderItems(items);
    }
    setShowObsModal(false);
    setCurrentObsIndex(null);
    setTempObservacion("");
  };

  const updateObservacionQuick = (index, value) => {
    const items = [...orderItems];
    items[index].observaciones = value;
    setOrderItems(items);
  };

  const truncateText = (text, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const total = calculateTotal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const buildOrderHtml = () => {
    const itemsHtml = orderItems.map(it => `<li>${it.name} x${it.cantidad} - $${(it.price * it.cantidad).toLocaleString()}</li>`).join('');
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

    // Validar que haya al menos un pago registrado
    if (registeredPayments.length === 0) {
      alert("Debe registrar al menos un pago antes de crear el alquiler");
      return;
    }

    // Validar que haya un vendedor seleccionado
    if (!vendedorSeleccionado) {
      alert("Debe seleccionar un vendedor");
      return;
    }

    setLoading(true);

    try {
      // Crear el objeto de alquiler para enviar al backend
      const alquilerData = {
        clienteDoc: selectedCustomer.id,
        vendedorDoc: parseInt(vendedorSeleccionado),
        fechaAlquiler: startDate,
        fechaEntrega: endDate,
        fechaRetiro: returnDate,
        totalAlquiler: total,
        articulos: orderItems.map(item => ({
          articuloId: item.id,
          precio: item.price,
          estado: false, // false = no devuelto
          observaciones: item.observaciones || null
        }))
      };

      console.log("Guardando alquiler:", alquilerData);

      // Guardar en la base de datos
      const response = await crearAlquiler(alquilerData);
      console.log("Alquiler guardado:", response);

      // Guardar los pagos registrados si existen
      if (registeredPayments.length > 0) {
        try {
          const idAlquiler = response.data?.id_alquiler || response.id_alquiler || response.data?.id || response.id;

          if (!idAlquiler) {
            console.error("No se pudo obtener el ID del alquiler. Response:", response);
            alert("Advertencia: Se creó el alquiler pero no se pudieron registrar los pagos automáticamente. Por favor, regístralos manualmente en la sección de órdenes.");
            throw new Error("ID de alquiler no disponible");
          }

          for (const payment of registeredPayments) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const fechaFormatted = parseInt(`${year}${month}${day}`);

            const pagoData = {
              idAlquiler: idAlquiler,
              valAbo: payment.amount,
              fechaUltimoAbono: fechaFormatted
            };

            console.log("Registrando pago:", pagoData);
            await crearPago(pagoData);
          }
          console.log("Pagos registrados exitosamente");
        } catch (errorPago) {
          console.error("Error al registrar pagos:", errorPago);
          // No bloqueamos si falla el registro de pagos
        }
      }

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

      // Parsear el mensaje de error de forma más amigable
      let mensajeError = 'Lo sentimos, hubo un error al crear el alquiler';

      if (error.message && error.message.includes('409')) {
        mensajeError = 'Lo sentimos, este artículo ya está alquilado para esa fecha';
      } else if (error.message && error.message.includes('ya está alquilado')) {
        mensajeError = 'Lo sentimos, este artículo ya está alquilado para esa fecha';
      } else if (error.message) {
        mensajeError = error.message;
      }

      setPopupMessage(mensajeError);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
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
            
            <label className="small-label" style={{ marginTop: '15px' }}>Vendedor responsable</label>
            <select 
              value={vendedorSeleccionado} 
              onChange={(e) => setVendedorSeleccionado(e.target.value)} 
              className="input-field"
              style={{ padding: '10px', marginBottom: '10px' }}
            >
              <option value="">Seleccione un vendedor</option>
              {vendedores.map((vendedor) => (
                <option key={vendedor.numDocumento} value={vendedor.numDocumento}>
                  {vendedor.nombre1} {vendedor.apellido1} - {vendedor.nomRol}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="products-section">
          <h2>Productos a Alquilar</h2>

          <div className="product-select-row">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="🔍 Buscar por nombre, talla, color, categoría..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm && setShowSearchResults(true)}
              />
              {showSearchResults && (
                <div className="search-results">
                  {filteredProducts.length === 0 ? (
                    <div className="search-no-results">No se encontraron artículos</div>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="search-result-item"
                        onClick={() => handleSelectFromSearch(product)}
                      >
                        <div className="result-name">{product.name}</div>
                        <div className="result-desc">{product.desc}</div>
                        <div className="result-price">${product.price.toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Vista previa del producto seleccionado */}
            {selectedProductId && catalog.find((p) => p.id === Number(selectedProductId)) && (
              <div className="selected-product-preview">
                <div className="preview-content">
                  <div className="preview-name">
                    {catalog.find((p) => p.id === Number(selectedProductId)).name}
                  </div>
                  <div className="preview-desc">
                    {catalog.find((p) => p.id === Number(selectedProductId)).desc}
                  </div>
                  <div className="preview-price">
                    ${catalog.find((p) => p.id === Number(selectedProductId)).price.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <button
              className="nc-button add-btn"
              onClick={addProductToOrder}
              disabled={catalog.length === 0 || !selectedProductId}
            >
              Añadir al pedido
            </button>
          </div>

          <div className="order-items-table">
            <div className="table-header">
              <span>Artículo</span>
              <span>Precio</span>
              <span>Observaciones</span>
              <span>Acciones</span>
            </div>
            {orderItems.length === 0 && <div className="empty">No hay productos añadidos</div>}
            {orderItems.map((it, idx) => (
              <div className="table-row" key={idx}>
                <span className="col-name">{it.name}</span>
                <span className="col-price">${it.price.toLocaleString()}</span>
                <span className="col-obs">
                  <div className="obs-container">
                    <input
                      type="text"
                      className="obs-input"
                      placeholder="Arreglos necesarios..."
                      value={it.observaciones || ""}
                      onChange={(e) => updateObservacionQuick(idx, e.target.value)}
                      maxLength={50}
                    />
                    <button
                      className="obs-expand-btn"
                      onClick={() => openObsModal(idx)}
                      title="Ampliar para escribir más"
                    >
                      🔍
                    </button>
                  </div>
                </span>
                <span className="col-actions">
                  <button
                    className="remove-item-btn"
                    onClick={() => removeProductFromOrder(idx)}
                    title="Quitar producto"
                  >
                    −
                  </button>
                </span>
              </div>
            ))}
            <div className="table-footer">
              <span>Total</span>
              <span></span>
              <span className="total-amount">${total.toLocaleString()}</span>
              <span></span>
            </div>
          </div>
        </div>

        {/* Panel de Pagos */}
        <div className="payment-panel">
          <div className="payment-header">
            <h2>💳 Pagos del Cliente</h2>
            <button
              className="payment-toggle-btn"
              onClick={handleTogglePaymentPanel}
              aria-expanded={showPaymentPanel}
              title={showPaymentPanel ? 'Contraer panel' : 'Expandir panel'}
            >
              {showPaymentPanel ? '▼' : '▶'}
            </button>
          </div>

          {showPaymentPanel && (
            <div className={`payment-content ${isClosingPanel ? 'closing' : ''}`}>
              <div className="payment-summary">
                <div className="summary-item">
                  <span className="label">Total a Pagar:</span>
                  <span className="amount">${total.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Total Pagado:</span>
                  <span className="amount paid">${calculateTotalPaid().toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Saldo Pendiente:</span>
                  <span className={`amount ${calculateBalance() > 0 ? 'pending' : 'complete'}`}>
                    ${calculateBalance().toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="payment-form">
                <label>Agregar Pago</label>
                <div className="payment-input-group">
                  <input
                    type="number"
                    className="payment-input"
                    placeholder="Monto del pago"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    min="0"
                    disabled={loadingPayment || calculateBalance() <= 0}
                  />
                  <button
                    className="payment-add-btn"
                    onClick={handleAddPayment}
                    disabled={loadingPayment || calculateBalance() <= 0 || !paymentAmount}
                  >
                    {loadingPayment ? 'Registrando...' : 'Registrar Pago'}
                  </button>
                </div>
              </div>

              {registeredPayments.length > 0 && (
                <div className="payments-history">
                  <h3>Pagos Registrados</h3>
                  <div className="payments-list">
                    {registeredPayments.map((payment) => (
                      <div key={payment.id} className="payment-item">
                        {editingPayment === payment.id ? (
                          // Modo edición
                          <>
                            <div className="payment-edit-form">
                              <input
                                type="number"
                                className="payment-edit-input"
                                value={editPaymentAmount}
                                onChange={(e) => setEditPaymentAmount(e.target.value)}
                                min="0"
                                autoFocus
                              />
                              <div className="payment-edit-actions">
                                <button
                                  className="payment-save-btn"
                                  onClick={() => handleSaveEditPayment(payment)}
                                  title="Guardar cambios"
                                >
                                  ✓
                                </button>
                                <button
                                  className="payment-cancel-btn"
                                  onClick={handleCancelEditPayment}
                                  title="Cancelar edición"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          // Modo normal
                          <>
                            <div className="payment-info">
                              <span className="payment-amount">${payment.amount.toLocaleString()}</span>
                              <span className="payment-date">{payment.date}</span>
                            </div>
                            <div className="payment-actions">
                              <button
                                className="payment-edit-btn"
                                onClick={() => handleEditPayment(payment)}
                                title="Editar pago"
                              >
                                ✏️
                              </button>
                              <button
                                className="payment-delete-btn"
                                onClick={() => handleDeletePayment(payment.id)}
                                title="Eliminar pago"
                              >
                                🗑️
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
          <div className="nc-popup nc-popup-error">
            <div className="nc-popup-content">
              <div className="nc-popup-icon">⚠️</div>
              <p className="nc-popup-message">{popupMessage || 'Correo enviado exitosamente'}</p>
            </div>
          </div>
        )}

        {showObsModal && (
          <div className="obs-modal-overlay" onClick={() => setShowObsModal(false)}>
            <div className="obs-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>📝 Observaciones y Arreglos</h3>
              <p className="obs-modal-subtitle">
                {orderItems[currentObsIndex]?.name}
              </p>
              <textarea
                className="obs-modal-textarea"
                placeholder="Ejemplo: Doblar 2cm la bota del pantalón, ajustar cintura 3cm, acortar mangas 5cm..."
                value={tempObservacion}
                onChange={(e) => setTempObservacion(e.target.value)}
                maxLength={200}
                rows={6}
              />
              <div className="obs-modal-footer">
                <small>{tempObservacion.length}/200 caracteres</small>
              </div>
              <div className="obs-modal-actions">
                <button className="obs-modal-btn save" onClick={saveObservacion}>
                  Guardar
                </button>
                <button className="obs-modal-btn cancel" onClick={() => setShowObsModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
