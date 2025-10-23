const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/cli";

const getAuthHeaders = () => {
    const token = localStorage.getItem("sga_token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const obtenerClientes = async () => {
    try {
        const res = await fetch(`${BASE_URL}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error al obtener clientes:', res.status, errorText);
            throw new Error(`Error al obtener clientes: ${res.status}`);
        }
        
        return await res.json();
    } catch (error) {
        console.error('Error completo en obtenerClientes:', error);
        throw error;
    }
};

export const crearCliente = async (data) => {
    try {
        const res = await fetch(`${BASE_URL}/crear`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error al crear cliente:', res.status, errorText);
            throw new Error(`Error al crear cliente: ${res.status}`);
        }
        
        return await res.json();
    } catch (error) {
        console.error('Error completo en crearCliente:', error);
        throw error;
    }
};

export const actualizarCliente = async (id, data) => {
    try {
        const res = await fetch(`${BASE_URL}/actualizar/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error al actualizar cliente:', res.status, errorText);
            throw new Error(`Error al actualizar cliente: ${res.status}`);
        }
        
        return await res.json();
    } catch (error) {
        console.error('Error completo en actualizarCliente:', error);
        throw error;
    }
};

export const obtenerClientePorId = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/consultarId/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error al obtener cliente:', res.status, errorText);
            throw new Error(`Error al obtener cliente: ${res.status}`);
        }
        
        return await res.json();
    } catch (error) {
        console.error('Error completo en obtenerClientePorId:', error);
        throw error;
    }
};

export const eliminarCliente = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/borrar/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error al eliminar cliente:', res.status, errorText);
            throw new Error(`Error al eliminar cliente: ${res.status}`);
        }
        
        return true;
    } catch (error) {
        console.error('Error completo en eliminarCliente:', error);
        throw error;
    }
};
