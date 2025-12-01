import React, { useEffect, useState } from "react";
import "./reports.styles.css";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { obtenerAlquileres } from "../../../api/alquilerApi";
import { obtenerPagosPorAlquiler } from "../../../api/pagoApi";
import { HiEye } from "react-icons/hi2";

const Reports = () => {
  const [alquileres, setAlquileres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterByDate, setFilterByDate] = useState(false);
  const [activeTab, setActiveTab] = useState('alquileres'); // 'alquileres' o 'pagos'
  const [reportData, setReportData] = useState([]);
  const [viewingDetail, setViewingDetail] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("sga_token");
      if (!token) {
        console.log("No hay token, no se cargarán los datos");
        setLoading(false);
        return;
      }
      
      const alquileresData = await obtenerAlquileres();
      console.log("Alquileres cargados:", alquileresData);
      setAlquileres(alquileresData || []);
      
      // Procesar datos para reportes
      await procesarReportes(alquileresData || []);
      
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setLoading(false);
    }
  };

  const procesarReportes = async (alquileresData) => {
    if (activeTab === 'alquileres') {
      // Crear reporte de alquileres
      const reporteAlquileres = alquileresData.map(alquiler => ({
        id: alquiler.id_alquiler,
        clienteDoc: alquiler.clienteDoc,
        nombreCliente: alquiler.articulos && alquiler.articulos.length > 0 
          ? alquiler.articulos[0].nomCliente 
          : 'N/A',
        fechaAlquiler: alquiler.fechaAlquiler,
        fechaEntrega: alquiler.fechaEntrega,
        fechaRetiro: alquiler.fechaRetiro,
        cantidadArticulos: alquiler.articulos ? alquiler.articulos.length : 0,
        totalAlquiler: alquiler.totalAlquiler,
        estado: alquiler.articulos && alquiler.articulos.every(a => a.estado === true) 
          ? 'Completado' 
          : 'Pendiente',
        articulos: alquiler.articulos || []
      }));
      setReportData(reporteAlquileres);
    } else {
      // Crear reporte de pagos
      const reportePagos = [];
      for (const alquiler of alquileresData) {
        try {
          const pagos = await obtenerPagosPorAlquiler(alquiler.id_alquiler);
          if (pagos && pagos.length > 0) {
            pagos.forEach(pago => {
              reportePagos.push({
                idPago: pago.idPago,
                idAlquiler: alquiler.id_alquiler,
                clienteDoc: alquiler.clienteDoc,
                nombreCliente: alquiler.articulos && alquiler.articulos.length > 0 
                  ? alquiler.articulos[0].nomCliente 
                  : 'N/A',
                montoPago: pago.montoPago,
                fechaPago: pago.fechaPago,
                metodoPago: pago.metodoPago || 'Efectivo',
                totalAlquiler: alquiler.totalAlquiler
              });
            });
          }
        } catch (error) {
          console.error(`Error al cargar pagos del alquiler ${alquiler.id_alquiler}:`, error);
        }
      }
      setReportData(reportePagos);
    }
  };

  useEffect(() => {
    if (alquileres.length > 0) {
      procesarReportes(alquileres);
    }
  }, [activeTab]);

  const filteredData = reportData.filter(item => {
    // Filtro por búsqueda
    let matchesSearch = true;
    if (searchText) {
      const searchLower = searchText.toLowerCase().trim();
      const isNumericSearch = /^\d+$/.test(searchText.trim());

      if (isNumericSearch) {
        matchesSearch = 
          item.id?.toString().includes(searchText) ||
          item.idAlquiler?.toString().includes(searchText) ||
          item.clienteDoc?.toString().includes(searchText);
      } else {
        matchesSearch = item.nombreCliente?.toLowerCase().includes(searchLower);
      }
    }

    // Filtro por rango de fechas
    let matchesDate = true;
    if (filterByDate && (startDate || endDate)) {
      const itemDate = new Date(activeTab === 'alquileres' ? item.fechaAlquiler : item.fechaPago);
      if (startDate && endDate) {
        matchesDate = itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        matchesDate = itemDate >= startDate;
      } else if (endDate) {
        matchesDate = itemDate <= endDate;
      }
    }

    return matchesSearch && matchesDate;
  });

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    if (activeTab === 'alquileres') {
      const total = filteredData.reduce((sum, item) => sum + (item.totalAlquiler || 0), 0);
      const completados = filteredData.filter(item => item.estado === 'Completado').length;
      const pendientes = filteredData.filter(item => item.estado === 'Pendiente').length;
      
      return {
        total: filteredData.length,
        totalMonto: total,
        completados,
        pendientes
      };
    } else {
      const total = filteredData.reduce((sum, item) => sum + (item.montoPago || 0), 0);
      
      return {
        total: filteredData.length,
        totalMonto: total
      };
    }
  };

  const stats = calcularEstadisticas();

  const handleViewDetail = (item) => {
    setViewingDetail(item);
  };

  const closeDetailModal = () => {
    setViewingDetail(null);
  };

  if (loading) {
    return (
      <div className="reports-wrapper">
        <NavbarSeller />
        <div className="reports-container">
          <p>Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-wrapper">
      <NavbarSeller />
      
      <div className="reports-sidebar">
        <h2>Filtros</h2>
        <input
          type="text"
          placeholder="Buscar por ID, documento o nombre"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        
        <div className="date-filter-toggle">
          <label>
            <input
              type="checkbox"
              checked={filterByDate}
              onChange={(e) => setFilterByDate(e.target.checked)}
            />
            <span>Filtrar por fechas</span>
          </label>
        </div>

        {filterByDate && (
          <div className="date-range-container">
            <div className="date-picker-wrapper">
              <label>Fecha inicial:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Seleccionar fecha"
                className="date-picker-input"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
            <div className="date-picker-wrapper">
              <label>Fecha final:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Seleccionar fecha"
                className="date-picker-input"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
          </div>
        )}

        <button onClick={() => {
          setSearchText("");
          setStartDate(null);
          setEndDate(null);
          setFilterByDate(false);
        }}>
          Limpiar filtros
        </button>
      </div>

      <div className="reports-container">
        <h1 className="reports-title">Reportes</h1>
        <p className="reports-subtitle">Gestión de alquileres y pagos registrados</p>

        {/* Estadísticas */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total {activeTab === 'alquileres' ? 'Alquileres' : 'Pagos'}</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
          <div className="stat-card">
            <h3>Monto Total</h3>
            <p className="stat-number">${stats.totalMonto?.toLocaleString()}</p>
          </div>
          {activeTab === 'alquileres' && (
            <>
              <div className="stat-card">
                <h3>Completados</h3>
                <p className="stat-number">{stats.completados}</p>
              </div>
              <div className="stat-card">
                <h3>Pendientes</h3>
                <p className="stat-number">{stats.pendientes}</p>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="reports-tabs">
          <button
            className={`tab-button ${activeTab === 'alquileres' ? 'active' : ''}`}
            onClick={() => setActiveTab('alquileres')}
          >
            Alquileres
          </button>
          <button
            className={`tab-button ${activeTab === 'pagos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pagos')}
          >
            Pagos
          </button>
        </div>

        {/* Tabla de datos */}
        <div className="reports-list">
          {activeTab === 'alquileres' ? (
            <>
              <div className="report-card">
                <div className="report-header">
                  <span>ID</span>
                  <span>Cliente</span>
                  <span>Documento</span>
                  <span>F. Alquiler</span>
                  <span>F. Entrega</span>
                  <span>F. Retiro</span>
                  <span>Artículos</span>
                  <span>Total</span>
                  <span>Estado</span>
                  <span>Acciones</span>
                </div>
              </div>
              {filteredData.length > 0 ? (
                filteredData.map((alquiler) => (
                  <div key={alquiler.id} className="report-card">
                    <div className="report-body">
                      <span className="report-field">{alquiler.id}</span>
                      <span className="report-field">{alquiler.nombreCliente}</span>
                      <span className="report-field">{alquiler.clienteDoc}</span>
                      <span className="report-field">{alquiler.fechaAlquiler}</span>
                      <span className="report-field">{alquiler.fechaEntrega}</span>
                      <span className="report-field">{alquiler.fechaRetiro}</span>
                      <span className="report-field">{alquiler.cantidadArticulos}</span>
                      <span className="report-field">${alquiler.totalAlquiler?.toLocaleString()}</span>
                      <span className={`report-field status-badge ${alquiler.estado === 'Completado' ? 'completed' : 'pending'}`}>
                        {alquiler.estado}
                      </span>
                      <span className="report-field">
                        <button className="view-btn" onClick={() => handleViewDetail(alquiler)}>
                          <HiEye />
                        </button>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No hay alquileres para mostrar</p>
              )}
            </>
          ) : (
            <>
              <div className="report-card">
                <div className="report-header">
                  <span>ID Pago</span>
                  <span>ID Alquiler</span>
                  <span>Cliente</span>
                  <span>Documento</span>
                  <span>Monto</span>
                  <span>Fecha Pago</span>
                  <span>Método</span>
                  <span>Total Alquiler</span>
                </div>
              </div>
              {filteredData.length > 0 ? (
                filteredData.map((pago) => (
                  <div key={pago.idPago} className="report-card">
                    <div className="report-body-payments">
                      <span className="report-field">{pago.idPago}</span>
                      <span className="report-field">{pago.idAlquiler}</span>
                      <span className="report-field">{pago.nombreCliente}</span>
                      <span className="report-field">{pago.clienteDoc}</span>
                      <span className="report-field">${pago.montoPago?.toLocaleString()}</span>
                      <span className="report-field">{pago.fechaPago}</span>
                      <span className="report-field">{pago.metodoPago}</span>
                      <span className="report-field">${pago.totalAlquiler?.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No hay pagos para mostrar</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      {viewingDetail && activeTab === 'alquileres' && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDetailModal}>×</button>
            <h2>Detalle del Alquiler #{viewingDetail.id}</h2>
            
            <div className="detail-section">
              <h3>Información del Cliente</h3>
              <p><strong>Nombre:</strong> {viewingDetail.nombreCliente}</p>
              <p><strong>Documento:</strong> {viewingDetail.clienteDoc}</p>
            </div>

            <div className="detail-section">
              <h3>Información del Alquiler</h3>
              <p><strong>Fecha de Alquiler:</strong> {viewingDetail.fechaAlquiler}</p>
              <p><strong>Fecha de Entrega:</strong> {viewingDetail.fechaEntrega}</p>
              <p><strong>Fecha de Retiro:</strong> {viewingDetail.fechaRetiro}</p>
              <p><strong>Estado:</strong> <span className={`status-badge ${viewingDetail.estado === 'Completado' ? 'completed' : 'pending'}`}>{viewingDetail.estado}</span></p>
              <p><strong>Total:</strong> ${viewingDetail.totalAlquiler?.toLocaleString()}</p>
            </div>

            <div className="detail-section">
              <h3>Artículos ({viewingDetail.cantidadArticulos})</h3>
              <div className="articles-list">
                {viewingDetail.articulos && viewingDetail.articulos.length > 0 ? (
                  viewingDetail.articulos.map((articulo, index) => (
                    <div key={index} className="article-item">
                      <p><strong>{articulo.nomArticulo}</strong></p>
                      <p>Talla: {articulo.tallaArticulo} - Precio: ${articulo.precio?.toLocaleString()}</p>
                      {articulo.observaciones && <p className="observations">Obs: {articulo.observaciones}</p>}
                    </div>
                  ))
                ) : (
                  <p>No hay artículos</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
