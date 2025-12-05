import { api } from './axiosConfig';

export interface Categoria {
  idCate: number;
  nomCate: string;
  descCate: string;
}

export interface CategoriaCreate {
  nomCate: string;
  descCate: string;
}

// Obtener todas las categorías
export const obtenerCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await api.get('/cat');
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw new Error('Error al obtener categorías');
  }
};

// Crear nueva categoría
export const crearCategoria = async (categoria: CategoriaCreate): Promise<Categoria> => {
  try {
    const response = await api.post('/cat/crear', categoria);
    return response.data;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw new Error('Error al crear categoría');
  }
};
