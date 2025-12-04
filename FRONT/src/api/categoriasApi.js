const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/cat";

const getAuthHeaders = () => {
    const token = localStorage.getItem("sga_token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

export const obtenerCategorias = async () => {
    try {
        const res = await fetch(`${BASE_URL}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error al obtener categorías:', res.status, errorText);
            throw new Error(`Error al obtener categorías: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Error completo en obtenerCategorias:', error);
        throw error;
    }
};

export const crearCategoria = async (data) => {
    try {
        const res = await fetch(`${BASE_URL}/crear`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error al crear categoría:', res.status, errorText);
            throw new Error(`Error al crear categoría: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Error completo en crearCategoria:', error);
        throw error;
    }
};

export const actualizarCategoria = async (id, data) => {
    try {
        const res = await fetch(`${BASE_URL}/actualizar/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error al actualizar categoría:', res.status, errorText);
            throw new Error(`Error al actualizar categoría: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Error completo en actualizarCategoria:', error);
        throw error;
    }
};

export const eliminarCategoria = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/borrar/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Error al eliminar categoría:', res.status, errorText);
            throw new Error(`Error al eliminar categoría: ${res.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error completo en eliminarCategoria:', error);
        throw error;
    }
};
