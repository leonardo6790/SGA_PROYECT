import { api } from './axiosConfig';

export interface TipoDoc {
  id_tipoDoc: number;
  nomDoc: string;
}

// Obtener todos los tipos de documento
export const obtenerTiposDoc = async (): Promise<TipoDoc[]> => {
  try {
    const response = await api.get('/tipodoc');
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos de documento:', error);
    throw new Error('Error al obtener tipos de documento');
  }
};
