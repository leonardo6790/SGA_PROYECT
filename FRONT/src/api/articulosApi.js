const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/articulos";

const getAuthHeaders = () => {
    const token = localStorage.getItem("sga_token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const obtenerArticulo = async () => {
    try {
        const headers = getAuthHeaders();
        console.log("Headers enviados:", headers);
        
        const res = await fetch(`${BASE_URL}`, { 
            method: "GET",
            headers: headers,
        });
        
        console.log("Respuesta recibida:", res.status, res.statusText);
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error response:', res.status, errorText);
            throw new Error(`Error al obtener articulos: ${res.status} - ${errorText}`);
        }
        
        const data = await res.json();
        console.log("Datos recibidos:", data);
        return data;
    } catch (error) {
        console.error('Error completo en obtenerArticulo:', error);
        throw error;
    }
};

export const crearArticulo = async (data) => {
    const res = await fetch(`${BASE_URL}/Crear`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("No se pudo crear el articulo");
    return await res.json();
};

export const actualizarArticulo = async (id, data) => {
    const res = await fetch(`${BASE_URL}/Actualizar/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar el articulo");
    return await res.json();
};

export const obtenerArticuloporId = async (id) => {
    const res = await fetch(`${BASE_URL}/ConsultarById/${id}`, { 
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Articulo no encontrado");
    return await res.json();
};