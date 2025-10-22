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