import api from '../api/axiosConfig';

export interface AlquilerArticuloBackend {
  articuloId: number;
  nomArticulo: string;
  tallaArticulo?: string;
  precio: number;
  estado: boolean;
  entregado: boolean;
  observaciones?: string;
  nomCliente?: string;
  telCliente?: number;
}

export interface AlquilerBackend {
  id_alquiler: number;
  clienteDoc: number;
  fechaAlquiler: string;
  fechaEntrega: string;
  fechaRetiro: string;
  totalAlquiler: number;
  articulos: AlquilerArticuloBackend[];
}

export interface AlquilerArticulo {
  articuloId: number;
  nombreArticulo: string;
  talla?: string;
  precio: number;
  estado: boolean;
  entregado: boolean;
  observaciones?: string;
}

export interface Alquiler {
  id: number;
  clienteDocumento: number;
  fechaAlquiler: string;
  fechaEntrega: string;
  fechaRetiro: string;
  total: number;
  articulos: AlquilerArticulo[];
}

export interface CreateAlquilerDTO {
  clienteDoc: number;
  fechaAlquiler: string;
  fechaEntrega: string;
  fechaRetiro: string;
  articulos: {
    articuloId: number;
    cantidad: number;
  }[];
}

// Mapper
const mapAlquilerBackendToAlquiler = (backend: AlquilerBackend): Alquiler => {
  return {
    id: backend.id_alquiler,
    clienteDocumento: backend.clienteDoc,
    fechaAlquiler: backend.fechaAlquiler,
    fechaEntrega: backend.fechaEntrega,
    fechaRetiro: backend.fechaRetiro,
    total: backend.totalAlquiler,
    articulos: backend.articulos.map(art => ({
      articuloId: art.articuloId,
      nombreArticulo: art.nomArticulo,
      talla: art.tallaArticulo,
      precio: art.precio,
      estado: art.estado,
      entregado: art.entregado,
      observaciones: art.observaciones,
    })),
  };
};

export const alquileresService = {
  // Obtener todos los alquileres
  async getAll(): Promise<Alquiler[]> {
    try {
      const response = await api.get<AlquilerBackend[]>('/alquiler');
      return response.data.map(mapAlquilerBackendToAlquiler);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener alquileres');
    }
  },

  // Obtener alquiler por ID
  async getById(id: number): Promise<Alquiler> {
    try {
      const response = await api.get<AlquilerBackend>(`/alquiler/ConsultarById/${id}`);
      return mapAlquilerBackendToAlquiler(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener alquiler');
    }
  },

  // Crear alquiler
  async create(alquilerData: CreateAlquilerDTO): Promise<Alquiler> {
    try {
      const response = await api.post<AlquilerBackend>('/alquiler/CrearAlquiler', alquilerData);
      return mapAlquilerBackendToAlquiler(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear alquiler');
    }
  },

  // Marcar artículo como entregado
  async marcarComoEntregado(alquilerId: number, articuloId: number): Promise<void> {
    try {
      await api.put(`/AlquilerArticulos/Actualizar/${articuloId}/${alquilerId}`, {
        entregado: true,
        estado: false // false = no devuelto
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al marcar como entregado');
    }
  },

  // Marcar artículo como devuelto
  async marcarComoDevuelto(alquilerId: number, articuloId: number): Promise<void> {
    try {
      await api.put(`/AlquilerArticulos/Actualizar/${articuloId}/${alquilerId}`, {
        entregado: true,
        estado: true // true = devuelto
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al marcar como devuelto');
    }
  },

  // Eliminar artículo de alquiler
  async eliminarArticulo(alquilerId: number, articuloId: number): Promise<void> {
    try {
      await api.delete(`/AlquilerArticulos/eliminar/${alquilerId}/${articuloId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar artículo');
    }
  },
};
