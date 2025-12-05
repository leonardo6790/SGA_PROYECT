// Types para la aplicación SGA Mobile

export interface User {
  id: number;
  username: string;
  email: string;
  rol: string;
  activo: boolean;
  numDoc?: number;
  nom1?: string;
  nom2?: string;
  ape1?: string;
  ape2?: string;
  direccion?: string;
  numTel?: number;
  tipoDoc?: string;
  barrio?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Interfaz que coincide con la respuesta del backend (ArticuloDto)
export interface ArticuloBackend {
  idArt: number;
  nombre: string;
  generoArt?: string;
  tallaArt?: string;
  colorArt?: string;
  precioArt: number;
  fotoArt?: string;
  activo: boolean;
  idCategoria: number;
  nomCate: string;
}

// Interfaz para uso interno en la app
export interface Articulo {
  id: number;
  nombreArticulo: string;
  descripcion: string;
  valorAlquiler: number;
  stock: number;
  foto?: string;
  categoria: Categoria;
  activo: boolean;
}

export interface Categoria {
  id: number;
  nombreCategoria: string;
}

export interface Cliente {
  id: number;
  nombreCliente: string;
  apellidoCliente: string;
  telefono: string;
  email: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  barrio: Barrio;
}

export interface TipoDocumento {
  id: number;
  nombre: string;
}

export interface Barrio {
  id: number;
  nombreBarrio: string;
}

export interface Alquiler {
  id: number;
  cliente: Cliente;
  fechaInicio: string;
  fechaFin: string;
  fechaDevolucion?: string;
  valorTotal: number;
  estado: string;
  entregado: boolean;
  articulos: AlquilerArticulo[];
}

export interface AlquilerArticulo {
  id: number;
  articulo: Articulo;
  cantidad: number;
  precioUnitario: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
