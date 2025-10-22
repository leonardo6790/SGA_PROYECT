const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const jsonHeaders = { "Content-Type": "application/json" };

export const login = async (correoElec, contraseña) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
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

export const getAuthHeaders = () => {
    const token = localStorage.getItem("sga_token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};
