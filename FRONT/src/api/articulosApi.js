const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/articulos";

const jsonHeaders = { "Content-Type": "application/json" };

export const obtenerArticulo = async () => {
    const res = await fetch(`${BASE_URL}`, { method: "GET" });
    if (!res.ok) throw new Error("Error al obtener articulos");
    return await res.json();
};

export const crearArticulo = async (data) => {
    const res = await fetch(`${BASE_URL}/Crear`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("No se pudo crear el articulo");
    return await res.json();
};

export const actualizarArticulo = async (id, data) => {
    const res = await fetch(`${BASE_URL}/Actualizar/${id}`, {
        method: "PUT",
        headers: jsonHeaders,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar el articulo");
    return await res.json();
};

export const obtenerArticuloporId = async (id) => {
    const res = await fetch(`${BASE_URL}/ConsultarById/${id}`, { method: "GET" });
    if (!res.ok) throw new Error("Articulo no encontrado");
    return await res.json();
};