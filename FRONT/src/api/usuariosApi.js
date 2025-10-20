const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/usu";

const jsonHeaders = { "Content-Type": "application/json" };

export const obtenerUsuario = async () => {
    const res = await fetch(`${BASE_URL}/ConsultarUsuarios`, { method: "GET" });
    if (!res.ok) throw new Error("Error al consultar usuarios");
    return await res.json();
};

export const crearUsuario = async (data) => {
    const res = await fetch(`${BASE_URL}/crear`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("No se pudo crear el usuario");
    return await res.json();
};

export const editarUsuario = async (id, data) => {
    const res = await fetch(`${BASE_URL}/actualizar/${id}`, {
        method: "PUT",
        headers: jsonHeaders,
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("No se pudo editar el usuario");
    return await res.json();
};