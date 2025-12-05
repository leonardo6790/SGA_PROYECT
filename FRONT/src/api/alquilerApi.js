import API_BASE_URL, { getAuthHeaders } from '../config/api.config.js';

const API_URL = `${API_BASE_URL}/alquiler`;

export const obtenerAlquileres = async () => {
  try {
    console.log("Solicitando alquileres...");
    const response = await fetch(API_URL, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    console.log("Respuesta GET alquileres:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al obtener alquileres (texto):", errorText);
      try {
        const errorData = JSON.parse(errorText);
        console.error("Error al obtener alquileres (JSON):", errorData);
      } catch (e) {
        console.error("No se pudo parsear el error como JSON");
      }
      throw new Error(`Error al obtener alquileres: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Datos recibidos:", data);
    return data;
  } catch (error) {
    console.error("Error en obtenerAlquileres:", error);
    throw error;
  }
};

export const crearAlquiler = async (alquilerData) => {
  try {
    console.log("Enviando alquiler al backend:", alquilerData);
    const response = await fetch(`${API_URL}/CrearAlquiler`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(alquilerData),
    });

    console.log("Respuesta del backend:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error del backend (texto):", errorText);
      try {
        const errorData = JSON.parse(errorText);
        console.error("Error del backend (JSON):", errorData);
        throw new Error(errorData.error || errorData.Error || errorData.mensaje || `Error al crear alquiler: ${response.statusText}`);
      } catch (parseError) {
        throw new Error(`Error al crear alquiler: ${response.status} - ${errorText}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error en crearAlquiler:", error);
    throw error;
  }
};

export const obtenerAlquilerPorId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/ConsultarById/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al obtener alquiler: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en obtenerAlquilerPorId:", error);
    throw error;
  }
};

export const eliminarAlquiler = async (id) => {
  try {
    const response = await fetch(`${API_URL}/Eliminar/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar alquiler: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error en eliminarAlquiler:", error);
    throw error;
  }
};

export const actualizarAlquiler = async (id, alquilerData) => {
  try {
    const response = await fetch(`${API_URL}/Actualizar/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(alquilerData),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar alquiler: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en actualizarAlquiler:", error);
    throw error;
  }
};

export const marcarComoEntregado = async (id) => {
  try {
    const response = await fetch(`${API_URL}/entregar/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al marcar como entregado: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en marcarComoEntregado:", error);
    throw error;
  }
};

export const marcarComoDevuelto = async (id) => {
  try {
    const response = await fetch(`${API_URL}/devolver/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error al marcar como devuelto: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en marcarComoDevuelto:", error);
    throw error;
  }
};
