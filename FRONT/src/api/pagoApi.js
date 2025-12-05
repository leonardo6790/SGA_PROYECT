import API_BASE_URL, { getAuthHeaders } from '../config/api.config.js';

const BASE_URL = `${API_BASE_URL}/pagos`;

export const crearPago = async (pagoData) => {
    try {
        const response = await fetch(`${BASE_URL}/AñadirPago`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(pagoData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error al crear pago:", errorText);
            throw new Error(`Error al crear pago: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en crearPago:", error);
        throw error;
    }
};

export const obtenerPagosPorAlquiler = async (idAlquiler) => {
    try {
        const response = await fetch(`${BASE_URL}/alquiler/${idAlquiler}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Error al obtener pagos: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en obtenerPagosPorAlquiler:", error);
        throw error;
    }
};

export const obtenerTodosLosPagos = async () => {
    try {
        const response = await fetch(`${BASE_URL}/ConsultarPagos`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Error al obtener pagos: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en obtenerTodosLosPagos:", error);
        throw error;
    }
};

export const actualizarPago = async (idPago, pagoData) => {
    try {
        const response = await fetch(`${BASE_URL}/actualizar/${idPago}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(pagoData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error al actualizar pago:", errorText);
            throw new Error(`Error al actualizar pago: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en actualizarPago:", error);
        throw error;
    }
};

export const eliminarPago = async (idPago) => {
    try {
        const response = await fetch(`${BASE_URL}/Eliminar/${idPago}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar pago: ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error("Error en eliminarPago:", error);
        throw error;
    }
};
