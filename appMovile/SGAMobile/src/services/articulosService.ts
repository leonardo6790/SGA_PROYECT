import api from '../api/axiosConfig';
import { Articulo, ArticuloBackend, Categoria } from '../types';
import { API_BASE_URL } from '../utils/constants';

// Mapper para convertir ArticuloBackend a Articulo
const mapArticuloBackendToArticulo = (backendArticulo: ArticuloBackend): Articulo => {
  // Construir URL completa de la foto si existe
  const fotoUrl = backendArticulo.fotoArt 
    ? `${API_BASE_URL}${backendArticulo.fotoArt}`
    : undefined;

  return {
    id: backendArticulo.idArt,
    nombreArticulo: backendArticulo.nombre,
    descripcion: `${backendArticulo.generoArt || ''} ${backendArticulo.tallaArt || ''} ${backendArticulo.colorArt || ''}`.trim() || 'Sin descripción',
    valorAlquiler: backendArticulo.precioArt,
    stock: 1, // El backend no tiene stock, asumimos 1
    foto: fotoUrl,
    categoria: {
      id: backendArticulo.idCategoria,
      nombreCategoria: backendArticulo.nomCate
    },
    activo: backendArticulo.activo
  };
};

export const articulosService = {
  // Obtener todos los artículos
  async getAll(): Promise<Articulo[]> {
    try {
      const response = await api.get<ArticuloBackend[]>('/articulos');
      return response.data.map(mapArticuloBackendToArticulo);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener artículos');
    }
  },

  // Obtener artículo por ID
  async getById(id: number): Promise<Articulo> {
    try {
      const response = await api.get<ArticuloBackend>(`/articulos/ConsultarById/${id}`);
      return mapArticuloBackendToArticulo(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener artículo');
    }
  },

  // Obtener artículos por categoría
  async getByCategoria(nombreCategoria: string): Promise<Articulo[]> {
    try {
      const response = await api.get<ArticuloBackend[]>(`/articulos/ConsultarByCate/${nombreCategoria}`);
      return response.data.map(mapArticuloBackendToArticulo);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener artículos por categoría');
    }
  },

  // Obtener categorías
  async getCategorias(): Promise<Categoria[]> {
    try {
      const response = await api.get('/categorias');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener categorías');
    }
  },

  // Buscar artículos por nombre
  async search(query: string): Promise<Articulo[]> {
    try {
      const response = await api.get<ArticuloBackend[]>(`/articulos/ConsultarByName/${query}`);
      return response.data.map(mapArticuloBackendToArticulo);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al buscar artículos');
    }
  },
};
