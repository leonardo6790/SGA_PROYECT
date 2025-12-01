import api from '../api/axiosConfig';

export interface BarrioBackend {
  idBarrio: number;
  nomBarrio: string;
}

export interface Barrio {
  id: number;
  nombre: string;
}

export interface TipoDocumentoBackend {
  id_tipoDoc: number;
  nomTipoDoc: string;
}

export interface TipoDocumento {
  id: number;
  nombre: string;
}

// Mappers
const mapBarrioBackendToBarrio = (backend: BarrioBackend): Barrio => ({
  id: backend.idBarrio,
  nombre: backend.nomBarrio,
});

const mapTipoDocBackendToTipoDoc = (backend: TipoDocumentoBackend): TipoDocumento => ({
  id: backend.id_tipoDoc,
  nombre: backend.nomTipoDoc,
});

export const catalogosService = {
  // Obtener barrios
  async getBarrios(): Promise<Barrio[]> {
    try {
      const response = await api.get<BarrioBackend[]>('/barrios');
      return response.data.map(mapBarrioBackendToBarrio);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener barrios');
    }
  },

  // Obtener tipos de documento
  async getTiposDocumento(): Promise<TipoDocumento[]> {
    try {
      const response = await api.get<TipoDocumentoBackend[]>('/tipoDoc');
      return response.data.map(mapTipoDocBackendToTipoDoc);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener tipos de documento');
    }
  },
};
