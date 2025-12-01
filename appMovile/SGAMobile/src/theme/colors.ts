// 🎨 Paleta de Colores - Basada en el Frontend Web
export const colors = {
  // Colores Primarios
  primary: '#6366f1',        // Azul índigo principal
  primaryDark: '#4f46e5',    // Versión más oscura
  primaryLight: '#818cf8',   // Versión más clara
  
  // Colores Secundarios
  secondary: '#8b5cf6',      // Púrpura
  secondaryDark: '#7c3aed',
  secondaryLight: '#a78bfa',
  
  // Grises
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Colores de Estado
  success: '#10b981',
  successDark: '#059669',
  successLight: '#34d399',
  
  error: '#ef4444',
  errorDark: '#dc2626',
  errorLight: '#f87171',
  
  warning: '#f59e0b',
  warningDark: '#d97706',
  warningLight: '#fbbf24',
  
  info: '#3b82f6',
  infoDark: '#2563eb',
  infoLight: '#60a5fa',
  
  // Colores de Fondo
  background: '#ffffff',
  backgroundGray: '#f8f9fa',
  backgroundDark: '#0f172a',
  
  // Texto
  textPrimary: '#222222',
  textSecondary: '#374151',
  textMuted: '#6b7280',
  textWhite: '#ffffff',
  
  // Bordes
  border: '#e5e7eb',
  borderDark: '#d1d5db',
  
  // Transparencias
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Colores Especiales del Sistema
  cardBackground: '#ffffff',
  inputBackground: '#ffffff',
  inputBorder: '#d1d5db',
  inputFocus: '#6366f1',
  
  // Estados de Disponibilidad
  available: '#10b981',
  rented: '#f59e0b',
  returned: '#3b82f6',
};

// Gradientes (para usar con LinearGradient de expo-linear-gradient)
export const gradients = {
  primary: ['#6366f1', '#8b5cf6'],          // Gradiente principal
  primaryVertical: ['#6366f1', '#4f46e5'],  // Gradiente vertical
  success: ['#10b981', '#059669'],
  error: ['#ef4444', '#dc2626'],
  purple: ['#667eea', '#764ba2'],           // Gradiente morado del inventario
  pink: ['#f093fb', '#f5576c'],             // Gradiente rosa
  card: ['rgba(255,255,255,0.98)', 'rgba(248,249,250,0.96)'],
};

// Sombras (para usar con shadow props)
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
};

// Espaciados (para mantener consistencia)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Tamaños de fuente
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  title: 36,
};

// Radios de borde
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
