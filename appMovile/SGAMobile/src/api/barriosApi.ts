import { api } from './axiosConfig';

export interface Barrio {
  idBarrio: number;
  nombreBarrio: string;
}

// Obtener todos los barrios
export const obtenerBarrios = async (): Promise<Barrio[]> => {
  try {
    const response = await api.get('/barrio');
    return response.data;
  } catch (error) {
    console.error('Error al obtener barrios:', error);
    throw new Error('Error al obtener barrios');
  }
};
