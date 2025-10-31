const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/tipodoc";

const getAuthHeaders = () => {
    const token = localStorage.getItem("sga_token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const obtenerTiposDoc = async () => {
    try {
        const headers = getAuthHeaders();
        
        const res = await fetch(`${BASE_URL}/listar`, { 
            method: "GET",
            headers: headers,
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error response:', res.status, errorText);
            throw new Error(`Error al obtener tipos de documento: ${res.status} - ${errorText}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error al obtener tipos de documento:", error);
        throw error;
    }
};
