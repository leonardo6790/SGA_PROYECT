// Constantes de la aplicación

// URL del backend - Cambiar según tu configuración
// export const API_BASE_URL = 'http://192.168.40.148:8080/api'; // Para dispositivo físico y Expo Go
export const API_BASE_URL = 'http://10.0.2.2:8080/api'; // Para emulador de Android
// export const API_BASE_URL = 'http://localhost:8080/api'; // Para desarrollo web

// URL base del servidor (sin /api) para archivos estáticos como imágenes
// export const SERVER_BASE_URL = 'http://192.168.40.148:8080'; // Para dispositivo físico y Expo Go
export const SERVER_BASE_URL = 'http://10.0.2.2:8080'; // Para emulador de Android
// export const SERVER_BASE_URL = 'http://localhost:8080'; // Para desarrollo web

// AsyncStorage Keys
export const STORAGE_KEYS = {
  TOKEN: '@sga_token',
  USER: '@sga_user',
};

// Colores del tema (Igual a la web)
export const COLORS = {
  primary: '#9b59b6', // Morado principal de la web
  secondary: '#8e44ad', // Morado más oscuro
  success: '#34C759',
  danger: '#e74c3c', // Rojo de admin
  warning: '#FF9500',
  info: '#5AC8FA',
  light: '#F2F2F7',
  dark: '#1e1e1e', // Contenedor oscuro de la web
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  background: '#0d0d0d', // Fondo oscuro de la web
  backgroundGradientStart: '#0d0d0d',
  backgroundGradientEnd: '#1a1a1a',
  card: '#1e1e1e', // Igual a contenedor de la web
  border: '#2c2c2c',
  text: '#ffffff',
  textSecondary: '#cccccc', // Texto secundario de la web
  textTertiary: '#8E8E93',
};

// Tamaños de fuente
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Espaciado
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
