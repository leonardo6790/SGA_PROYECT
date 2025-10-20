const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/AlquilerArticulos";

export const obtenerAlquiler = async () => {
    const res = await fetch(`${BASE_URL}`, { method: "GET" });
    if (!res.ok) throw new Error("Error al obtener alquileres");
    return await res.json();
};