// Constantes de la aplicación

// URL del backend - Cambiar según tu configuración
export const API_BASE_URL = 'http://192.168.40.148:8080/api'; // Para dispositivo físico y Expo Go
// export const API_BASE_URL = 'http://10.0.2.2:8080/api'; // Para emulador de Android
// export const API_BASE_URL = 'http://localhost:8080/api'; // Para desarrollo web

// AsyncStorage Keys
export const STORAGE_KEYS = {
  TOKEN: '@sga_token',
  USER: '@sga_user',
};

// Colores del tema
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  background: '#F9F9F9',
  card: '#FFFFFF',
  border: '#E5E5EA',
  text: '#000000',
  textSecondary: '#8E8E93',
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
