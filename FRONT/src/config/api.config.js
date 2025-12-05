// Configuración centralizada de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export default API_BASE_URL;

// Helper para obtener headers con autenticación
export const getAuthHeaders = () => {
    const token = localStorage.getItem("sga_token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Helper para obtener headers sin Content-Type (para FormData)
export const getAuthHeadersForFormData = () => {
    const token = localStorage.getItem("sga_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};
