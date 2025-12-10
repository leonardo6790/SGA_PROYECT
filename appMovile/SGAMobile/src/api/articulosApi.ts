import { api } from './axiosConfig';
import { SERVER_BASE_URL } from '../utils/constants';

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
    const response = await api.get('/articulos');
    // Transformar URLs de fotos
    const articulos = response.data.map((art: Articulo) => ({
      ...art,
      fotoArt: art.fotoArt ? `${SERVER_BASE_URL}${art.fotoArt}` : ''
    }));
    return articulos;
  } catch (error) {
    console.error('Error al obtener artículos:', error);
    throw error;
  }
};

// Obtener artículo por ID
export const obtenerArticuloPorId = async (id: number): Promise<Articulo> => {
  try {
    const response = await api.get(`/articulos/ConsultarById/${id}`);
    const articulo = response.data;
    // Transformar URL de foto
    if (articulo.fotoArt) {
      articulo.fotoArt = `${SERVER_BASE_URL}${articulo.fotoArt}`;
    }
    return articulo;
  } catch (error) {
    console.error('Error al obtener artículo:', error);
    throw error;
  }
};

// Crear artículo
export const crearArticulo = async (articulo: ArticuloCreate): Promise<Articulo> => {
  try {
    const response = await api.post('/articulos/Crear', articulo);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error al crear artículo:', error);
    throw error;
  }
};

// Crear artículo con foto
export const crearArticuloConFoto = async (formData: FormData): Promise<Articulo> => {
  try {
    const response = await api.post('/articulos/CrearConFoto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
    const response = await api.put(`/articulos/Actualizar/${id}`, articulo);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar artículo:', error);
    throw error;
  }
};

// Buscar artículos por nombre
export const buscarArticulosPorNombre = async (nombre: string): Promise<Articulo[]> => {
  try {
    const response = await api.get(`/articulos/BuscarPorNombre/${nombre}`);
    return response.data;
  } catch (error) {
    console.error('Error al buscar artículos:', error);
    throw error;
  }
};

// Buscar artículos por categoría
export const buscarArticulosPorCategoria = async (categoria: string): Promise<Articulo[]> => {
  try {
    const response = await api.get(`/articulos/BuscarPorCategoria/${categoria}`);
    return response.data;
  } catch (error) {
    console.error('Error al buscar artículos por categoría:', error);
    throw error;
  }
};
