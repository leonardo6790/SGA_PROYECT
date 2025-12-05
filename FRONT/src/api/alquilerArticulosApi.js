import API_BASE_URL, { getAuthHeaders } from '../config/api.config.js';

const BASE_URL = `${API_BASE_URL}/AlquilerArticulos`;

export const obtenerAlquiler = async () => {
    const res = await fetch(`${BASE_URL}`, { 
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener alquileres");
    return await res.json();
};

export const eliminarArticuloDeAlquiler = async (idArticulo, idAlquiler) => {
    try {
        console.log(`Eliminando artículo ${idArticulo} del alquiler ${idAlquiler}`);
        const response = await fetch(`${BASE_URL}/Eliminar/${idArticulo}/${idAlquiler}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error al eliminar artículo:", errorText);
            throw new Error(`Error al eliminar artículo: ${response.statusText}`);
        }

        console.log("Artículo eliminado exitosamente");
        return true;
    } catch (error) {
        console.error("Error en eliminarArticuloDeAlquiler:", error);
        throw error;
    }
};

export const marcarArticuloComoEntregado = async (idArticulo, idAlquiler) => {
    try {
        console.log(`Marcando artículo ${idArticulo} del alquiler ${idAlquiler} como entregado`);
        const bodyData = { 
            entregado: true,
            estado: false
        };
        console.log("Body enviado:", JSON.stringify(bodyData));
        console.log("URL:", `${BASE_URL}/Actualizar/${idArticulo}/${idAlquiler}`);
        
        const response = await fetch(`${BASE_URL}/Actualizar/${idArticulo}/${idAlquiler}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(bodyData),
        });

        console.log("Response status:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            let errorMessage = "Error al marcar como entregado";
            
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || errorData.message || errorData.detalle || errorText;
            } catch (e) {
                errorMessage = errorText || response.statusText;
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("Artículo marcado como entregado exitosamente:", data);
        return data;
    } catch (error) {
        console.error("Error en marcarArticuloComoEntregado:", error);
        throw error;
    }
};

export const marcarArticuloComoDevuelto = async (idArticulo, idAlquiler) => {
    try {
        console.log(`Marcando artículo ${idArticulo} del alquiler ${idAlquiler} como devuelto`);
        const response = await fetch(`${BASE_URL}/Actualizar/${idArticulo}/${idAlquiler}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ 
                estado: true,  // Marcado como devuelto
                entregado: true  // Ya fue entregado antes
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            const errorMessage = errorData.message || errorData.detalle || response.statusText;
            console.error("Error al marcar como devuelto:", errorMessage);
            throw new Error(errorMessage);
        }

        console.log("Artículo marcado como devuelto exitosamente");
        return await response.json();
    } catch (error) {
        console.error("Error en marcarArticuloComoDevuelto:", error);
        throw error;
    }
};