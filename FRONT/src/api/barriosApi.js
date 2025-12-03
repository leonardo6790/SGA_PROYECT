const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/barrio";

const getAuthHeaders = () => {
    const token = localStorage.getItem("sga_token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const obtenerBarrios = async () => {
    try {
        const headers = getAuthHeaders();
        
        const res = await fetch(`${BASE_URL}`, { 
            method: "GET",
            headers: headers,
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error response:', res.status, errorText);
            throw new Error(`Error al obtener barrios: ${res.status} - ${errorText}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error al obtener barrios:", error);
        throw error;
    }
};

export const crearBarrio = async (barrioData) => {
    try {
        const headers = getAuthHeaders();
        
        const res = await fetch(`${BASE_URL}/crear`, { 
            method: "POST",
            headers: headers,
            body: JSON.stringify(barrioData),
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error response:', res.status, errorText);
            throw new Error(`Error al crear barrio: ${res.status} - ${errorText}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error al crear barrio:", error);
        throw error;
    }
};
