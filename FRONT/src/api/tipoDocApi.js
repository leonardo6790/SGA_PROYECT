import API_BASE_URL, { getAuthHeaders } from '../config/api.config.js';

const BASE_URL = `${API_BASE_URL}/tipodoc`;

export const obtenerTiposDoc = async () => {
    try {
        const headers = getAuthHeaders();
        
        const res = await fetch(`${BASE_URL}`, { 
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
