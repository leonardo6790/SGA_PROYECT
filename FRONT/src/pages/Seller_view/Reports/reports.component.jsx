import React, { useEffect, useState } from "react";
import "./reports.styles.css";
import NavbarSeller from "../../../components/Seller_components/Navbar_Seller/Navbar_seller.component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { obtenerAlquileres } from "../../../api/alquilerApi";
import { obtenerTodosLosPagos } from "../../../api/pagoApi";
import { obtenerUsuario, crearUsuario } from "../../../api/usuariosApi";
import { obtenerBarrios } from "../../../api/barriosApi";
import { obtenerTiposDoc } from "../../../api/tipoDocApi";
import { HiEye, HiPlus } from "react-icons/hi2";

const Reports = () => {
  const [alquileres, setAlquileres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterByDate, setFilterByDate] = useState(false);
  const [activeTab, setActiveTab] = useState('alquileres'); // 'alquileres', 'pagos', 'devueltos' o 'vendedores'
  const [reportData, setReportData] = useState([]);
  const [viewingDetail, setViewingDetail] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  const [showCreateVendedorModal, setShowCreateVendedorModal] = useState(false);
  const [barrios, setBarrios] = useState([]);
  const [tiposDoc, setTiposDoc] = useState([]);
  const [newVendedorData, setNewVendedorData] = useState({
    numDocumento: "",
    nombre1: "",
    nombre2: "",
    apellido1: "",
    apellido2: "",
    dire: "",
    tele: "",
    correoElectronico: "",
    contra: "",
    idBarrio: null,
    idTipoDoc: null,
    idRol: 2 // 2 = VENDEDOR
  });

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
      
      const [alquileresData, vendedoresData, barriosData, tiposDocData] = await Promise.all([
        obtenerAlquileres(),
        obtenerUsuario(),
        obtenerBarrios(),
        obtenerTiposDoc()
      ]);
      
      console.log("Alquileres cargados:", alquileresData);
      console.log("Usuarios cargados:", vendedoresData);
      console.log("Usuarios con roles:", vendedoresData?.map(u => ({ numDoc: u.numDocumento, nombre: u.nombre1, idRol: u.idRol })));
      setAlquileres(alquileresData || []);
      setVendedores(vendedoresData || []);
      setBarrios(barriosData || []);
      setTiposDoc(tiposDocData || []);
      
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
    } else if (activeTab === 'pagos') {
      // Crear reporte de pagos - Obtener TODOS los pagos de una sola vez
      try {
        const todosPagos = await obtenerTodosLosPagos();
        const reportePagos = todosPagos.map(pago => ({
          idPago: pago.idPago,
          idAlquiler: pago.alquiler?.id_alquiler || pago.idAlquiler,
          clienteDoc: pago.alquiler?.clienteDoc || 'N/A',
          nombreCliente: pago.alquiler?.articulos && pago.alquiler.articulos.length > 0 
            ? pago.alquiler.articulos[0].nomCliente 
            : 'N/A',
          montoPago: pago.valAbo || pago.valorAbono || pago.montoPago,
          fechaPago: pago.fechaUltimoAbono || pago.fechaPago,
          metodoPago: pago.metodoPago || 'Efectivo',
          totalAlquiler: pago.alquiler?.totalAlquiler || 0
        }));
        setReportData(reportePagos);
      } catch (error) {
        console.error("Error al cargar pagos:", error);
        setReportData([]);
      }
    } else if (activeTab === 'devueltos') {
      // Crear reporte de alquileres completados (entregados y devueltos)
      const reporteDevueltos = alquileresData
        .flatMap(alquiler => 
          (alquiler.articulos || [])
            .filter(articulo => articulo.entregado && articulo.estado)
            .map(articulo => ({
              id: `${alquiler.id_alquiler}-${articulo.articuloId}`,
              idAlquiler: alquiler.id_alquiler,
              clienteDoc: alquiler.clienteDoc,
              nombreCliente: articulo.nomCliente || 'N/A',
              articulo: articulo.nomArticulo,
              talla: articulo.tallaArticulo,
              precio: articulo.precio,
              fechaAlquiler: alquiler.fechaAlquiler,
              fechaEntrega: alquiler.fechaEntrega,
              fechaRetiro: alquiler.fechaRetiro,
              estado: '✓ Devuelto',
              articulos: [articulo]
            }))
        );
      setReportData(reporteDevueltos);
    } else if (activeTab === 'vendedores') {
      // Crear reporte de vendedores (filtrar solo vendedores, no admins)
      console.log("Filtrando vendedores de:", vendedores);
      console.log("Total de usuarios:", vendedores.length);
      
      const reporteVendedores = vendedores
        .filter(user => {
          console.log(`Usuario: ${user.nombre1}, idRol: ${user.idRol}, tipo: ${typeof user.idRol}`);
          return user.idRol === 2 || user.idRol === '2';  // Aceptar both number y string
        })
        .map(vendedor => ({
          numDocumento: vendedor.numDocumento,
          nombreCompleto: `${vendedor.nombre1} ${vendedor.nombre2 || ''} ${vendedor.apellido1} ${vendedor.apellido2 || ''}`.trim(),
          correo: vendedor.correoElectronico,
          telefono: vendedor.tele,
          direccion: vendedor.dire,
          barrio: vendedor.nomBar || 'N/A',
          activo: vendedor.activo,
          idRol: vendedor.idRol
        }));
      
      console.log("Vendedores filtrados:", reporteVendedores);
      setReportData(reporteVendedores);
    }
  };

  useEffect(() => {
    if (alquileres.length > 0 || vendedores.length > 0) {
      procesarReportes(alquileres);
    }
  }, [activeTab, vendedores, alquileres]);

  const filteredData = reportData.filter(item => {
    // Filtro por búsqueda
    let matchesSearch = true;
    if (searchText) {
      const searchLower = searchText.toLowerCase().trim();
      const searchTrimmed = searchText.trim();
      const isNumericSearch = /^\d+$/.test(searchTrimmed);

      if (isNumericSearch) {
        // Buscar por ID de alquiler o documento del cliente
        const searchNum = searchTrimmed;
        
        // Verificar todas las variaciones posibles de ID
        const idAlquilerMatch = item.idAlquiler?.toString() === searchNum || item.id?.toString() === searchNum;
        const idAlquilerContains = item.idAlquiler?.toString().includes(searchNum) || item.id?.toString().includes(searchNum);
        const docContains = item.clienteDoc?.toString().includes(searchNum);
        const numDocContains = item.numDocumento?.toString().includes(searchNum);
        
        matchesSearch = idAlquilerMatch || idAlquilerContains || docContains || numDocContains;
      } else {
        // Buscar por nombre del cliente
        const nombreClienteMatch = item.nombreCliente?.toLowerCase().includes(searchLower);
        const nombreCompletoMatch = item.nombreCompleto?.toLowerCase().includes(searchLower);
        
        matchesSearch = nombreClienteMatch || nombreCompletoMatch;
      }
    }

    // Filtro por rango de fechas
    let matchesDate = true;
    if (filterByDate && (startDate || endDate)) {
      // Obtener la fecha del item según el tab activo
      let dateFieldName;
      if (activeTab === 'alquileres') {
        dateFieldName = 'fechaAlquiler';
      } else if (activeTab === 'pagos') {
        dateFieldName = 'fechaPago';
      } else {
        dateFieldName = 'fechaEntrega';
      }

      const itemDateValue = item[dateFieldName];
      if (itemDateValue) {
        let itemDate;
        
        // Manejar tanto strings como números (Integer timestamps)
        if (typeof itemDateValue === 'string') {
          // Convertir string de fecha (YYYY-MM-DD) a Date
          const [year, month, day] = itemDateValue.split('-').map(Number);
          itemDate = new Date(year, month - 1, day);
        } else if (typeof itemDateValue === 'number') {
          // Si es un número, interpretarlo como un timestamp o formato YYYYMMDD
          const dateStr = itemDateValue.toString();
          if (dateStr.length === 8) {
            // Formato YYYYMMDD
            const year = parseInt(dateStr.substring(0, 4));
            const month = parseInt(dateStr.substring(4, 6));
            const day = parseInt(dateStr.substring(6, 8));
            itemDate = new Date(year, month - 1, day);
          } else {
            // Si es un timestamp, convertir directamente
            itemDate = new Date(itemDateValue);
          }
        }

        if (itemDate) {
          // Convertir las fechas del picker a dates normalizadas
          const start = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) : null;
          const end = endDate ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) : null;

          if (start && end) {
            matchesDate = itemDate >= start && itemDate <= end;
          } else if (start) {
            matchesDate = itemDate >= start;
          } else if (end) {
            matchesDate = itemDate <= end;
          }
        }
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
    } else if (activeTab === 'pagos') {
      const total = filteredData.reduce((sum, item) => sum + (item.montoPago || 0), 0);
      
      return {
        total: filteredData.length,
        totalMonto: total
      };
    } else {
      // devueltos
      const total = filteredData.reduce((sum, item) => sum + (item.precio || 0), 0);
      
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

  const handleOpenCreateVendedorModal = () => {
    // Limpiar el estado antes de abrir el modal
    setNewVendedorData({
      numDocumento: "",
      nombre1: "",
      nombre2: "",
      apellido1: "",
      apellido2: "",
      dire: "",
      tele: "",
      correoElectronico: "",
      contra: "",
      idBarrio: null,
      idTipoDoc: null,
      idRol: 2
    });
    setShowCreateVendedorModal(true);
  };

  const handleCloseCreateVendedorModal = () => {
    setShowCreateVendedorModal(false);
    setNewVendedorData({
      numDocumento: "",
      nombre1: "",
      nombre2: "",
      apellido1: "",
      apellido2: "",
      dire: "",
      tele: "",
      correoElectronico: "",
      contra: "",
      idBarrio: null,
      idTipoDoc: null,
      idRol: 2
    });
  };

  const handleCreateVendedor = async (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!newVendedorData.numDocumento || !newVendedorData.nombre1 || !newVendedorData.apellido1 || 
        !newVendedorData.correoElectronico || !newVendedorData.contra || !newVendedorData.tele) {
      alert("Por favor complete los campos obligatorios (Documento, Nombre, Apellido, Correo, Contraseña, Teléfono)");
      return;
    }

    // Validar que documento sea un número válido
    const numDocumento = parseInt(newVendedorData.numDocumento);
    if (isNaN(numDocumento) || numDocumento <= 0) {
      alert("El número de documento debe ser un número válido");
      return;
    }

    // Validar que teléfono sea un número válido
    const telefono = parseInt(newVendedorData.tele);
    if (isNaN(telefono) || telefono <= 0) {
      alert("El teléfono debe ser un número válido");
      return;
    }

    // Validar que seleccione barrio y tipo de documento
    if (!newVendedorData.idBarrio) {
      alert("Por favor selecciona un barrio");
      return;
    }

    if (!newVendedorData.idTipoDoc) {
      alert("Por favor selecciona un tipo de documento");
      return;
    }

    try {
      const vendedorData = {
        numDocumento: parseInt(newVendedorData.numDocumento),
        nombre1: newVendedorData.nombre1.trim(),
        nombre2: newVendedorData.nombre2.trim() || null,
        apellido1: newVendedorData.apellido1.trim(),
        apellido2: newVendedorData.apellido2.trim() || null,
        dire: newVendedorData.dire.trim() || null,
        tele: parseInt(newVendedorData.tele),
        correoElectronico: newVendedorData.correoElectronico.trim(),
        contra: newVendedorData.contra,
        activo: true,
        idBarrio: parseInt(newVendedorData.idBarrio),
        idTipoDoc: parseInt(newVendedorData.idTipoDoc),
        idRol: 2 // VENDEDOR
      };
      
      console.log("Enviando datos del vendedor:", vendedorData);
      console.log("Tipo de datos:", {
        numDocumento: typeof vendedorData.numDocumento,
        tele: typeof vendedorData.tele,
        idBarrio: typeof vendedorData.idBarrio,
        idTipoDoc: typeof vendedorData.idTipoDoc,
        idRol: typeof vendedorData.idRol
      });
      
      // Validar que los IDs se convirtieron correctamente a números
      if (isNaN(vendedorData.idBarrio) || vendedorData.idBarrio <= 0) {
        throw new Error("El barrio seleccionado no es válido");
      }
      
      if (isNaN(vendedorData.idTipoDoc) || vendedorData.idTipoDoc <= 0) {
        throw new Error("El tipo de documento seleccionado no es válido");
      }
      
      const response = await crearUsuario(vendedorData);
      console.log("Respuesta del servidor:", response);
      
      // Recargar vendedores
      const vendedoresActualizados = await obtenerUsuario();
      setVendedores(vendedoresActualizados);
      
      // Actualizar reporte si estamos en el tab de vendedores
      if (activeTab === 'vendedores') {
        await procesarReportes(alquileres);
      }
      
      handleCloseCreateVendedorModal();
      alert("Vendedor creado exitosamente");
    } catch (error) {
      console.error("Error al crear vendedor:", error);
      const errorMsg = error.message || "Error desconocido";
      alert(`Error al crear el vendedor: ${errorMsg}`);
    }
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
          placeholder="Buscar por ID o nombre del cliente"
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
          <button
            className={`tab-button ${activeTab === 'devueltos' ? 'active' : ''}`}
            onClick={() => setActiveTab('devueltos')}
          >
            ✓ Entregados y Devueltos
          </button>
          <button
            className={`tab-button ${activeTab === 'vendedores' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendedores')}
          >
            👥 Vendedores
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
          ) : activeTab === 'pagos' ? (
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
          ) : activeTab === 'devueltos' ? (
            <>
              <div className="report-card">
                <div className="report-header">
                  <span>ID</span>
                  <span>Cliente</span>
                  <span>Documento</span>
                  <span>F. Entrega</span>
                  <span>F. Retiro</span>
                  <span>Artículos</span>
                  <span>Total</span>
                  <span>Estado</span>
                  <span>Acciones</span>
                </div>
              </div>
              {filteredData.length > 0 ? (
                filteredData.map((articulo) => (
                  <div key={articulo.id} className="report-card">
                    <div className="report-body">
                      <span className="report-field">{articulo.idAlquiler}</span>
                      <span className="report-field">{articulo.nombreCliente}</span>
                      <span className="report-field">{articulo.clienteDoc}</span>
                      <span className="report-field">{articulo.fechaEntrega}</span>
                      <span className="report-field">{articulo.fechaRetiro}</span>
                      <span className="report-field">{articulo.articulo}</span>
                      <span className="report-field">${articulo.precio?.toLocaleString()}</span>
                      <span className={`report-field status-badge ${articulo.estado === '✓ Devuelto' ? 'completed' : 'pending'}`}>
                        {articulo.estado}
                      </span>
                      <span className="report-field">
                        <button className="view-btn" onClick={() => handleViewDetail(articulo)}>
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
            // Tab de Vendedores
            <>
              <div className="vendedores-header">
                <button className="create-vendedor-btn" onClick={handleOpenCreateVendedorModal}>
                  <HiPlus /> Crear Nuevo Vendedor
                </button>
              </div>
              <div className="report-card">
                <div className="vendedores-report-header">
                  <span>Documento</span>
                  <span>Nombre Completo</span>
                  <span>Correo</span>
                  <span>Teléfono</span>
                  <span>Dirección</span>
                  <span>Barrio</span>
                  <span>Estado</span>
                </div>
              </div>
              {filteredData.length > 0 ? (
                filteredData.map((vendedor) => (
                  <div key={vendedor.numDocumento} className="report-card">
                    <div className="report-body-vendedores">
                      <span className="report-field">{vendedor.numDocumento}</span>
                      <span className="report-field">{vendedor.nombreCompleto}</span>
                      <span className="report-field">{vendedor.correo}</span>
                      <span className="report-field">{vendedor.telefono}</span>
                      <span className="report-field">{vendedor.direccion || 'N/A'}</span>
                      <span className="report-field">{vendedor.barrio}</span>
                      <span className={`report-field status-badge ${vendedor.activo ? 'completed' : 'pending'}`}>
                        {vendedor.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No hay vendedores para mostrar</p>
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

      {/* Modal de crear vendedor */}
      {showCreateVendedorModal && (
        <div className="modal-overlay" onClick={handleCloseCreateVendedorModal}>
          <form className="modal-content vendedor-modal" onSubmit={handleCreateVendedor} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={handleCloseCreateVendedorModal}>×</button>
            <h2>Crear Nuevo Vendedor</h2>
            
            <div className="vendedor-form-grid">
              <div className="form-field">
                <label>Número de Documento *</label>
                <input
                  type="number"
                  value={newVendedorData.numDocumento}
                  onChange={(e) => setNewVendedorData({ ...newVendedorData, numDocumento: e.target.value })}
                  placeholder="Ej: 1234567890"
                  required
                />
              </div>

              <div className="form-field">
                <label>Tipo de Documento *</label>
                <select
                  value={newVendedorData.idTipoDoc || ""}
                  onChange={(e) => setNewVendedorData({ ...newVendedorData, idTipoDoc: e.target.value })}
                  required
                >
                  <option value="">Seleccione</option>
                  {tiposDoc.map(tipo => (
                    <option key={tipo.idTipoDoc} value={tipo.idTipoDoc}>
                      {tipo.nomDoc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Primer Nombre *</label>
                <input
                  type="text"
                  value={newVendedorData.nombre1}
                  onChange={(e) => setNewVendedorData({ ...newVendedorData, nombre1: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>Segundo Nombre</label>
                <input
                  type="text"
                  value={newVendedorData.nombre2}
                  onChange={(e) => setNewVendedorData({ ...newVendedorData, nombre2: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Primer Apellido *</label>
                <input
                  type="text"
                  value={newVendedorData.apellido1}
                  onChange={(e) => setNewVendedorData({ ...newVendedorData, apellido1: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>Segundo Apellido</label>
                <input
                  type="text"
                  value={newVendedorData.apellido2}
                  onChange={(e) => setNewVendedorData({ ...newVendedorData, apellido2: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Correo Electrónico *</label>
                <input
                  type="email"
                  value={newVendedorData.correoElectronico}
                  onChange={(e) => setNewVendedorData({ ...newVendedorData, correoElectronico: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>Teléfono *</label>
                <input
                  type="number"
                  value={newVendedorData.tele}
                  onChange={(e) => setNewVendedorData({ ...newVendedorData, tele: e.target.value })}
                  placeholder="Ej: 3001234567"
                  required
                />
              </div>

              <div className="form-field">
                <label>Contraseña *</label>
                <input
                  type="password"
                  value={newVendedorData.contra}
                  onChange={(e) => setNewVendedorData({ ...newVendedorData, contra: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>Dirección</label>
                <input
                  type="text"
                  value={newVendedorData.dire}
                  onChange={(e) => setNewVendedorData({ ...newVendedorData, dire: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Barrio</label>
                <select
                  value={newVendedorData.idBarrio || ""}
                  onChange={(e) => setNewVendedorData({ ...newVendedorData, idBarrio: e.target.value })}
                >
                  <option value="">Seleccione</option>
                  {barrios.map(barrio => (
                    <option key={barrio.idBarrio} value={barrio.idBarrio}>
                      {barrio.nombreBarrio}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-buttons">
              <button type="submit" className="submit-btn">Crear Vendedor</button>
              <button type="button" className="cancel-btn" onClick={handleCloseCreateVendedorModal}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reports;
