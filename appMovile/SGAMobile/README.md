# SGA Mobile - Aplicación Móvil

Sistema de Gestión de Alquileres - Aplicación móvil desarrollada con React Native, TypeScript y Expo.

## 🚀 Características

- **Autenticación**: Login con JWT
- **Catálogo de Artículos**: Visualización y búsqueda de productos
- **Filtros por Categoría**: Organización de artículos
- **Perfil de Usuario**: Gestión de información personal
- **Diseño Responsivo**: Optimizado para dispositivos móviles
- **TypeScript**: Tipado fuerte para mayor seguridad

## 📋 Requisitos Previos

### Para desarrollo:
- Node.js 18 o superior
- npm o yarn
- Expo CLI
- Android Studio (para emulador Android)
- Java JDK 17 o superior

### Para ejecutar en dispositivo físico:
- Expo Go app (disponible en Play Store)

## 🛠️ Instalación

1. **Navegar a la carpeta del proyecto:**
```bash
cd C:\Users\SENA\Desktop\sga\appMovile\SGAMobile
```

2. **Las dependencias ya están instaladas, pero si necesitas reinstalarlas:**
```bash
npm install
```

## 🏃‍♂️ Ejecutar la Aplicación

### Opción 1: Expo Go (Más rápido - Recomendado para pruebas)

1. **Iniciar el servidor de desarrollo:**
```bash
npm start
```

2. **Escanear el código QR con la app Expo Go desde tu dispositivo Android**

### Opción 2: Emulador de Android Studio

1. **Iniciar Android Studio y el emulador**

2. **Ejecutar la app en el emulador:**
```bash
npm run android
```

### Opción 3: Generar APK para instalación

1. **Instalar EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Iniciar sesión en Expo:**
```bash
eas login
```

3. **Configurar el proyecto:**
```bash
eas build:configure
```

4. **Generar el APK:**
```bash
eas build --platform android --profile preview
```

El APK se generará en la nube y podrás descargarlo para instalarlo en cualquier dispositivo Android.

## 📱 Configuración del Backend

La aplicación se conecta al backend en la siguiente URL:

- **Emulador Android**: `http://10.0.2.2:8080/api`
- **Dispositivo físico**: Necesitas cambiar la URL en `src/utils/constants.ts`

Para usar en dispositivo físico:

1. Encuentra tu IP local (ejecuta `ipconfig` en Windows)
2. Edita `src/utils/constants.ts`:
```typescript
export const API_BASE_URL = 'http://TU_IP_LOCAL:8080/api';
```

## 📂 Estructura del Proyecto

```
SGAMobile/
├── src/
│   ├── api/              # Configuración de Axios
│   ├── components/       # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── ArticuloCard.tsx
│   ├── context/          # Context API (AuthContext)
│   ├── navigation/       # Navegación de la app
│   ├── screens/          # Pantallas principales
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/         # Servicios de API
│   │   ├── authService.ts
│   │   └── articulosService.ts
│   ├── types/            # Definiciones de TypeScript
│   └── utils/            # Constantes y utilidades
├── App.tsx               # Punto de entrada
├── app.json              # Configuración de Expo
└── package.json          # Dependencias
```

## 🎨 Pantallas

### 1. Login
- Autenticación con usuario y contraseña
- Validación de formularios
- Manejo de errores

### 2. Home (Catálogo)
- Lista de artículos disponibles
- Búsqueda de productos
- Filtros por categoría
- Pull to refresh

### 3. Perfil
- Información del usuario
- Configuración
- Cerrar sesión

## 🔧 Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo con Expo
- `npm run android`: Ejecuta la app en Android
- `npm run ios`: Ejecuta la app en iOS (solo macOS)
- `npm run web`: Ejecuta la app en el navegador

## 🐛 Solución de Problemas

### Error de conexión con el backend

Si no puedes conectarte al backend:

1. Verifica que el backend esté corriendo en `http://localhost:8080`
2. Si usas emulador, asegúrate de usar `http://10.0.2.2:8080`
3. Si usas dispositivo físico, usa tu IP local

### El emulador no inicia

1. Abre Android Studio
2. Ve a Tools → AVD Manager
3. Inicia un dispositivo virtual manualmente
4. Ejecuta `npm run android` nuevamente

### Error al instalar dependencias

```bash
# Limpia el caché
npm cache clean --force
rm -rf node_modules
rm package-lock.json

# Reinstala
npm install
```

## 📦 Dependencias Principales

- **React Native**: Framework móvil
- **TypeScript**: Tipado estático
- **Expo**: Plataforma de desarrollo
- **React Navigation**: Navegación
- **Axios**: Cliente HTTP
- **AsyncStorage**: Almacenamiento local

## 🔐 Seguridad

- Tokens JWT almacenados de forma segura con AsyncStorage
- Interceptores de Axios para manejo automático de autenticación
- Validación de formularios en el cliente

## 👥 Credenciales de Prueba

Usa las mismas credenciales del sistema web para iniciar sesión.

## 📄 Licencia

Este proyecto es parte del Sistema de Gestión de Alquileres (SGA).

## 🆘 Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.

---

**Desarrollado con ❤️ usando React Native y TypeScript**
