import { api } from './axiosConfig';

export interface PagoCreate {
  montoAbono: number;
  fechaPago: string;
  formaPago: string;
  idAlquiler: number;
}

export interface Pago {
  idPago: number;
  montoAbono: number;
  fechaPago: string;
  formaPago: string;
  idAlquiler: number;
}

// Crear nuevo pago
export const crearPago = async (pago: PagoCreate): Promise<Pago> => {
  try {
    const response = await api.post('/pagos/CrearPago', pago);
    return response.data;
  } catch (error) {
    console.error('Error al crear pago:', error);
    throw new Error('Error al crear pago');
  }
};
