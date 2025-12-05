import API_BASE_URL, { getAuthHeaders } from '../config/api.config.js';

const BASE_URL = `${API_BASE_URL}/auth`;
const jsonHeaders = { "Content-Type": "application/json" };

export const login = async (correoElec, contraseña) => {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ correoElec, contraseña }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ mensaje: "Error de autenticación" }));
        throw new Error(errorData.mensaje || "Credenciales inválidas");
    }

    return await res.json();
};

// Re-exportar getAuthHeaders para compatibilidad con código existente
export { getAuthHeaders };
