import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';
import { LoginCredentials, User, ApiResponse } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      // Transformar las credenciales al formato esperado por el backend
      const loginData = {
        correoElec: credentials.username,
        contraseña: credentials.password,
      };
      
      console.log('🔐 Intentando login con:', loginData);
      
      const response = await api.post('/auth/login', loginData);
      console.log('✅ Respuesta del servidor:', response.data);
      
      // El backend devuelve datos completos del usuario
      const { token, email, rol, numDoc, nom1, nom2, ape1, ape2, direccion, numTel, activo, tipoDoc, barrio } = response.data;

      // Crear objeto de usuario compatible con la interfaz User
      const user: User = {
        id: numDoc || 0,
        username: `${nom1 || ''} ${ape1 || ''}`.trim() || email.split('@')[0],
        email: email,
        rol: rol,
        activo: activo !== undefined ? activo : true,
        numDoc: numDoc,
        nom1: nom1,
        nom2: nom2,
        ape1: ape1,
        ape2: ape2,
        direccion: direccion,
        numTel: numTel,
        tipoDoc: tipoDoc,
        barrio: barrio,
      };

      // Guardar token y usuario en AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      console.log('✅ Usuario autenticado:', user);

      return { user, token };
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      console.error('❌ Error response:', error.response?.data);
      const errorMsg = error.response?.data?.mensaje || error.response?.data?.message || error.message || 'Error al iniciar sesión';
      throw new Error(errorMsg);
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  },

  // Verificar si hay sesión activa
  async checkAuth(): Promise<{ user: User; token: string } | null> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      const userStr = await AsyncStorage.getItem(STORAGE_KEYS.USER);

      if (token && userStr) {
        const user = JSON.parse(userStr);
        return { user, token };
      }

      return null;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return null;
    }
  },

  // Verificar token con el backend
  async verifyToken(): Promise<boolean> {
    try {
      const response = await api.get('/auth/verify');
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },
};
