import api from '../api/axiosConfig';
import { API_BASE_URL } from '../utils/constants';

export interface ClienteBackend {
  idCliente: number;
  doc: number;
  nomcli1: string;
  nomcli2?: string;
  apecli1: string;
  apecli2?: string;
  direCli: string;
  numeroCli: number;
  correoElectronico: string;
  idBarrio: number;
  nomBarrio: string;
  idTipoDoc: number;
  nomTipoDoc: string;
}

export interface Cliente {
  id: number;
  documento: number;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  direccion: string;
  telefono: number;
  email: string;
  barrio: {
    id: number;
    nombre: string;
  };
  tipoDocumento: {
    id: number;
    nombre: string;
  };
}

export interface CreateClienteDTO {
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
}

// Mapper
const mapClienteBackendToCliente = (backend: ClienteBackend): Cliente => {
  return {
    id: backend.idCliente,
    documento: backend.doc,
    primerNombre: backend.nomcli1,
    segundoNombre: backend.nomcli2,
    primerApellido: backend.apecli1,
    segundoApellido: backend.apecli2,
    direccion: backend.direCli,
    telefono: backend.numeroCli,
    email: backend.correoElectronico,
    barrio: {
      id: backend.idBarrio,
      nombre: backend.nomBarrio,
    },
    tipoDocumento: {
      id: backend.idTipoDoc,
      nombre: backend.nomTipoDoc,
    },
  };
};

export const clientesService = {
  // Obtener todos los clientes
  async getAll(): Promise<Cliente[]> {
    try {
      const response = await api.get<ClienteBackend[]>('/clientes');
      return response.data.map(mapClienteBackendToCliente);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener clientes');
    }
  },

  // Obtener cliente por ID
  async getById(id: number): Promise<Cliente> {
    try {
      const response = await api.get<ClienteBackend>(`/clientes/${id}`);
      return mapClienteBackendToCliente(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener cliente');
    }
  },

  // Buscar cliente por documento
  async getByDocumento(documento: number): Promise<Cliente | null> {
    try {
      const clientes = await this.getAll();
      const cliente = clientes.find(c => c.documento === documento);
      return cliente || null;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al buscar cliente');
    }
  },

  // Crear cliente
  async create(clienteData: CreateClienteDTO): Promise<Cliente> {
    try {
      const response = await api.post<ClienteBackend>('/clientes/Crear', clienteData);
      return mapClienteBackendToCliente(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear cliente');
    }
  },

  // Actualizar cliente
  async update(id: number, clienteData: Partial<CreateClienteDTO>): Promise<Cliente> {
    try {
      const response = await api.put<ClienteBackend>(`/clientes/Actualizar/${id}`, clienteData);
      return mapClienteBackendToCliente(response.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar cliente');
    }
  },

  // Eliminar cliente
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/clientes/Eliminar/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar cliente');
    }
  },
};
