import { api } from './axiosConfig';

export interface TipoDoc {
  idTipoDoc?: number; // Java devuelve en camelCase
  id_tipoDoc?: number; // para compatibilidad
  nomDoc?: string;
  nomTipoDoc?: string; // alias for compatibility
  activo?: boolean;
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
