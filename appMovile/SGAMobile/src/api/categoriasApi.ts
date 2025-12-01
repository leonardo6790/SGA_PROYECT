import axios from 'axios';

const API_URL = 'http://172.16.110.42:8080/api/categorias';

export interface Categoria {
  idCate: number;
  nomCate: string;
  descCate: string;
}

const getAuthHeaders = () => {
  const token = ''; // Obtener de AsyncStorage
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Obtener todas las categorías
export const obtenerCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};
