import { api } from './axiosConfig';

export interface PagoCreate {
  montoAbono?: number;
  valAbo?: number;
  fechaPago?: string;
  fechaUltimoAbono?: number;
  formaPago?: string;
  idAlquiler: number;
}

export interface Pago {
  idPago: number;
  valAbo: number;
  fechaUltimoAbono: string;
  montoAbono?: number;
  fechaPago?: string;
  formaPago?: string;
  idAlquiler: number;
  id_pago?: number;
  montoAbonado?: number;
  alquiler?: any;
}

// Obtener todos los pagos
export const obtenerTodosLosPagos = async (): Promise<Pago[]> => {
  try {
    const response = await api.get('/pagos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    throw new Error('Error al obtener pagos');
  }
};

// Obtener pagos por alquiler
export const obtenerPagosPorAlquiler = async (idAlquiler: number): Promise<Pago[]> => {
  try {
    const response = await api.get(`/pagos/alquiler/${idAlquiler}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener pagos por alquiler:', error);
    throw new Error('Error al obtener pagos');
  }
};

// Crear nuevo pago
export const crearPago = async (pago: PagoCreate): Promise<Pago> => {
  try {
    const response = await api.post('/pagos/AñadirPago', pago);
    return response.data;
  } catch (error: any) {
    console.error('Error al crear pago:', error);
    const errorMsg = error.response?.data?.detalle || error.response?.data?.error || error.message;
    throw new Error(errorMsg || 'Error al crear pago');
  }
};

// Actualizar pago
export const actualizarPago = async (idPago: number, pago: Partial<PagoCreate>): Promise<Pago> => {
  try {
    const response = await api.put(`/pagos/${idPago}`, pago);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar pago:', error);
    throw new Error('Error al actualizar pago');
  }
};

// Eliminar pago
export const eliminarPago = async (idPago: number): Promise<void> => {
  try {
    await api.delete(`/pagos/${idPago}`);
  } catch (error) {
    console.error('Error al eliminar pago:', error);
    throw new Error('Error al eliminar pago');
  }
};

export const pagoApi = {
  obtenerTodosLosPagos,
  obtenerPagosPorAlquiler,
  crearPago,
  actualizarPago,
  eliminarPago,
};
