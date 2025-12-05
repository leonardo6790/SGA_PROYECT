import API_BASE_URL, { getAuthHeaders } from '../config/api.config.js';

const BASE_URL = `${API_BASE_URL}/barrio`;

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

export const eliminarBarrio = async (idBarrio) => {
    try {
        const headers = getAuthHeaders();
        
        const res = await fetch(`${BASE_URL}/borrar/${idBarrio}`, { 
            method: "DELETE",
            headers: headers,
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error response:', res.status, errorText);
            throw new Error(`Error al eliminar barrio: ${res.status} - ${errorText}`);
        }
        
        return res.status === 204 ? null : await res.json();
    } catch (error) {
        console.error("Error al eliminar barrio:", error);
        throw error;
    }
};
