import { api } from './axiosConfig';

export interface AlquilerArticulo {
  articuloId: number;
  precio: number;
  estado: boolean;
  observaciones?: string | null;
}

export interface AlquilerCreate {
  fechaAlquiler: string;
  fechaEntrega: string;
  fechaRetiro: string;
  totalAlquiler: number;
  clienteDoc: number;
  articulos: AlquilerArticulo[];
}

export interface Alquiler {
  id_alquiler: number;
  fechaAlquiler: string;
  fechaEntrega: string;
  fechaRetiro: string;
  totalAlquiler: number;
  clienteDoc: number;
  activo?: boolean;
  totalPagado?: number;
  saldoPendiente?: number;
}

// Crear nuevo alquiler
export const crearAlquiler = async (alquiler: AlquilerCreate): Promise<Alquiler> => {
  try {
    console.log('=== Enviando alquiler al backend ===');
    console.log('URL:', '/alquiler/CrearAlquiler');
    console.log('Datos:', JSON.stringify(alquiler, null, 2));
    
    const response = await api.post('/alquiler/CrearAlquiler', alquiler);
    
    console.log('=== Respuesta del backend ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('=== Error al crear alquiler ===');
    console.error('Error completo:', error);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.error('Response headers:', error.response?.headers);
    
    if (error.response?.data) {
      const errorMsg = error.response.data.detalle || error.response.data.error || error.response.data.Error || 'Error desconocido';
      throw new Error(errorMsg);
    }
    throw new Error('Error al crear alquiler');
  }
};

// Obtener todos los alquileres
export const obtenerAlquileres = async (): Promise<Alquiler[]> => {
  try {
    const response = await api.get('/alquiler');
    return response.data;
  } catch (error) {
    console.error('Error al obtener alquileres:', error);
    throw new Error('Error al obtener alquileres');
  }
};

// Actualizar alquiler
export const actualizarAlquiler = async (id: number, alquiler: Partial<AlquilerCreate>): Promise<Alquiler> => {
  try {
    const response = await api.put(`/alquiler/Actualizar/${id}`, alquiler);
    return response.data;
  } catch (error: any) {
    console.error('Error al actualizar alquiler:', error);
    const errorMsg = error.response?.data?.detalle || error.response?.data?.error || 'Error al actualizar alquiler';
    throw new Error(errorMsg);
  }
};
