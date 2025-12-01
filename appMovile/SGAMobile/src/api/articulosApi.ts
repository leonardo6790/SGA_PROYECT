import axios from 'axios';

const API_URL = 'http://172.16.110.42:8080/api/articulos';

// Configurar axios para incluir el token
const getAuthHeaders = () => {
  // En React Native usarías AsyncStorage
  const token = ''; // Obtener de AsyncStorage
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export interface Articulo {
  idArt: number;
  nombre: string;
  generoArt: string;
  tallaArt: string;
  colorArt: string;
  precioArt: number;
  fotoArt: string;
  activo: boolean;
  idCategoria: number;
  nomCate: string;
}

export interface ArticuloCreate {
  nombre: string;
  generoArt: string;
  tallaArt: string;
  colorArt: string;
  precioArt: number;
  fotoArt?: string;
  activo: boolean;
  idCategoria: number;
}

// Obtener todos los artículos disponibles
export const obtenerArticulos = async (): Promise<Articulo[]> => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener artículos:', error);
    throw error;
  }
};

// Obtener artículo por ID
export const obtenerArticuloPorId = async (id: number): Promise<Articulo> => {
  try {
    const response = await axios.get(`${API_URL}/ConsultarById/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener artículo:', error);
    throw error;
  }
};

// Crear artículo
export const crearArticulo = async (articulo: ArticuloCreate): Promise<Articulo> => {
  try {
    const response = await axios.post(`${API_URL}/Crear`, articulo, {
      headers: getAuthHeaders(),
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al crear artículo:', error);
    throw error;
  }
};

// Crear artículo con foto
export const crearArticuloConFoto = async (formData: FormData): Promise<Articulo> => {
  try {
    const token = ''; // Obtener de AsyncStorage
    const response = await axios.post(`${API_URL}/CrearConFoto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al crear artículo con foto:', error);
    throw error;
  }
};

// Actualizar artículo
export const actualizarArticulo = async (
  id: number,
  articulo: Partial<ArticuloCreate> & { idArt: number }
): Promise<Articulo> => {
  try {
    const response = await axios.put(`${API_URL}/Actualizar/${id}`, articulo, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar artículo:', error);
    throw error;
  }
};

// Buscar artículos por nombre
export const buscarArticulosPorNombre = async (nombre: string): Promise<Articulo[]> => {
  try {
    const response = await axios.get(`${API_URL}/BuscarPorNombre/${nombre}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar artículos:', error);
    throw error;
  }
};

// Buscar artículos por categoría
export const buscarArticulosPorCategoria = async (categoria: string): Promise<Articulo[]> => {
  try {
    const response = await axios.get(`${API_URL}/BuscarPorCategoria/${categoria}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error al buscar artículos por categoría:', error);
    throw error;
  }
};
