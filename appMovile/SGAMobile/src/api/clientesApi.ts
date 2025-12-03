import { api } from './axiosConfig';

export interface Cliente {
  doc: number;
  nomcli1: string;
  nomcli2?: string;
  apecli1: string;
  apecli2?: string;
  direCli: string;
  numeroCli: number;
  correoElectronico: string;
  idBarrio: number;
  idTipoDoc: number;
  nombreBarrio?: string;
  nomDoc?: string;
}

export interface ClienteCreate {
  doc: number;
  nomcli1: string;
  nomcli2?: string | null;
  apecli1: string;
  apecli2?: string | null;
  direCli: string;
  numeroCli: number;
  correoElectronico: string;
  idBarrio: number;
  idTipoDoc: number;
}

// Obtener todos los clientes
export const obtenerClientes = async (): Promise<Cliente[]> => {
  try {
    const response = await api.get('/cli');
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw new Error('Error al obtener clientes');
  }
};

// Obtener cliente por documento
export const obtenerClientePorDoc = async (doc: number): Promise<Cliente> => {
  try {
    const response = await api.get(`/cli/consultarDoc/${doc}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    throw error;
  }
};

// Crear nuevo cliente
export const crearCliente = async (cliente: ClienteCreate): Promise<Cliente> => {
  try {
    const response = await api.post('/cli/crear', cliente);
    return response.data;
  } catch (error) {
    console.error('Error al crear cliente:', error);
    throw new Error('Error al crear cliente');
  }
};
