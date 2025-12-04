const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/usu";

const getAuthHeaders = () => {
    const token = localStorage.getItem("sga_token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const obtenerUsuario = async () => {
    const res = await fetch(`${BASE_URL}/ConsultarUsuarios`, { 
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Error al consultar usuarios");
    return await res.json();
};

export const crearUsuario = async (data) => {
    const res = await fetch(`${BASE_URL}/crear`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    
    const responseData = await res.json();
    
    if (!res.ok) {
        console.error("Error del servidor:", responseData);
        throw new Error(responseData.error || "No se pudo crear el usuario");
    }
    
    return responseData;
};

export const editarUsuario = async (id, data) => {
    const res = await fetch(`${BASE_URL}/actualizar/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("No se pudo editar el usuario");
    return await res.json();
};