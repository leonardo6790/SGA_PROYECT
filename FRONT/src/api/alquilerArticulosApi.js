const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/AlquilerArticulos";

const getAuthHeaders = () => {
    const token = localStorage.getItem("sga_token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

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
        const response = await fetch(`${BASE_URL}/Actualizar/${idArticulo}/${idAlquiler}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ entregado: true }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error al marcar como entregado:", errorText);
            throw new Error(`Error al marcar como entregado: ${response.statusText}`);
        }

        console.log("Artículo marcado como entregado exitosamente");
        return await response.json();
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
            body: JSON.stringify({ estado: true }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error al marcar como devuelto:", errorText);
            throw new Error(`Error al marcar como devuelto: ${response.statusText}`);
        }

        console.log("Artículo marcado como devuelto exitosamente");
        return await response.json();
    } catch (error) {
        console.error("Error en marcarArticuloComoDevuelto:", error);
        throw error;
    }
};