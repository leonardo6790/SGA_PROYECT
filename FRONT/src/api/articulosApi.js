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
            const errorText = await res.text(); ya
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
    try {
        console.log("Creando artículo con datos:", data);
        const res = await fetch(`${BASE_URL}/Crear`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        console.log("Respuesta del servidor:", res.status, res.statusText);

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error response:', res.status, errorText);
            throw new Error(`Error al crear el articulo: ${res.status} - ${errorText}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Error completo en crearArticulo:', error);
        throw error;
    }
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

export const actualizarArticuloConFoto = async (id, formData) => {
    try {
        const token = localStorage.getItem("sga_token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`${BASE_URL}/ActualizarConFoto/${id}`, {
            method: "PUT",
            headers: headers,
            body: formData,
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error al actualizar artículo con foto:', res.status, errorText);
            throw new Error(`Error al actualizar el artículo: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Error completo en actualizarArticuloConFoto:', error);
        throw error;
    }
};

export const obtenerArticuloporId = async (id) => {
    const res = await fetch(`${BASE_URL}/ConsultarById/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Articulo no encontrado");
    return await res.json();
};

export const eliminarArticulo = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/Eliminar/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error al eliminar artículo:', res.status, errorText);
            throw new Error(`Error al eliminar el artículo: ${res.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error completo en eliminarArticulo:', error);
        throw error;
    }
};
