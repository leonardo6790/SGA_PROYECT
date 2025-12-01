# 🚀 GUÍA RÁPIDA - SGA Mobile

## ✅ Proyecto Creado Exitosamente

El proyecto de React Native con TypeScript está listo y funcionando.

## 📱 CÓMO EJECUTAR LA APP

### **Opción 1: Usando Expo Go (MÁS FÁCIL - RECOMENDADO)**

1. **Descarga Expo Go** desde Play Store en tu celular Android
2. **El servidor ya está corriendo** (verás un código QR en la terminal)
3. **Abre Expo Go** y escanea el código QR
4. **¡Listo!** La app se cargará en tu dispositivo

### **Opción 2: Emulador de Android Studio**

1. **Abre Android Studio**
2. **Inicia un emulador Android** (AVD Manager → Play button)
3. **En la terminal de Expo**, presiona la tecla **`a`** para abrir en Android
4. La app se instalará y ejecutará automáticamente

### **Opción 3: Usar script BAT**

Simplemente ejecuta el archivo: `run-android.bat`

## 🛠️ COMANDOS ÚTILES

```powershell
# Iniciar el servidor (si se cerró)
cd C:\Users\SENA\Desktop\sga\appMovile\SGAMobile
npm start

# O ejecutar el PowerShell script
.\start-expo.ps1

# Ejecutar en Android (con emulador abierto)
npm run android

# Limpiar caché si hay problemas
npm start -- --clear
```

## 🔧 CONFIGURACIÓN DEL BACKEND

La app está configurada para conectarse a:

- **Emulador**: `http://10.0.2.2:8080/api` ✅
- **Dispositivo físico**: Necesitas cambiar la IP

### Para usar en tu celular:

1. Encuentra tu IP local:
   ```powershell
   ipconfig
   # Busca "IPv4 Address" en tu red WiFi
   ```

2. Edita el archivo:
   `src/utils/constants.ts`

3. Cambia:
   ```typescript
   export const API_BASE_URL = 'http://TU_IP:8080/api';
   ```

## 📋 ESTADO DEL PROYECTO

✅ Proyecto inicializado con Expo + TypeScript
✅ Estructura de carpetas profesional creada
✅ Componentes reutilizables implementados
✅ Pantallas principales (Login, Home, Profile)
✅ Navegación configurada
✅ Servicios de API con Axios
✅ Context API para autenticación
✅ AsyncStorage para persistencia
✅ Servidor de desarrollo funcionando

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### 🔐 Autenticación
- Login con validación
- Gestión de tokens JWT
- Persistencia de sesión
- Logout seguro

### 📦 Catálogo
- Lista de artículos
- Búsqueda en tiempo real
- Filtros por categoría
- Imágenes de productos
- Información de stock
- Pull to refresh

### 👤 Perfil
- Información del usuario
- Estado de la cuenta
- Configuración
- Cerrar sesión

## 📱 PANTALLAS DISPONIBLES

1. **LoginScreen** - Autenticación de usuarios
2. **HomeScreen** - Catálogo de artículos
3. **ProfileScreen** - Perfil del usuario

## 🏗️ ARQUITECTURA

```
src/
├── api/              # Configuración de Axios
├── components/       # Componentes UI reutilizables
├── context/          # State management (AuthContext)
├── navigation/       # React Navigation setup
├── screens/          # Pantallas de la app
├── services/         # Servicios de API
├── types/            # TypeScript interfaces
└── utils/            # Constantes y utilidades
```

## 🎨 TECNOLOGÍAS

- **React Native** - Framework móvil
- **TypeScript** - Tipado fuerte
- **Expo** - Desarrollo rápido
- **React Navigation** - Navegación
- **Axios** - HTTP client
- **AsyncStorage** - Storage local

## 🐛 SOLUCIÓN DE PROBLEMAS

### No se conecta al backend
```typescript
// Verifica la URL en src/utils/constants.ts
export const API_BASE_URL = 'http://10.0.2.2:8080/api';
```

### Error al abrir en Android
1. Asegúrate de que el emulador esté abierto
2. Verifica que Android Studio esté instalado
3. Ejecuta: `npm run android`

### Expo no inicia
```powershell
# Limpia el caché
npm start -- --clear

# O reinstala
rm -rf node_modules
npm install
```

## 📸 CAPTURAS (Funcionalidades)

- ✅ Sistema de login funcional
- ✅ Navegación fluida entre pantallas
- ✅ Diseño responsive y moderno
- ✅ Conexión con backend
- ✅ Manejo de estados y errores

## 🚀 PRÓXIMOS PASOS (Opcional)

- Agregar pantalla de detalles de artículo
- Implementar sistema de carrito
- Crear pantalla de órdenes/alquileres
- Agregar notificaciones push
- Implementar modo oscuro
- Agregar animaciones

## 📞 SOPORTE

Si encuentras algún problema:
1. Revisa esta guía
2. Consulta el README.md completo
3. Verifica que el backend esté corriendo
4. Asegúrate de tener conexión a internet

## ✨ ¡FELICIDADES!

Tu aplicación móvil está lista para usar. Ahora puedes:
- Escanear el QR con Expo Go
- Ejecutar en el emulador con `npm run android`
- Comenzar a desarrollar nuevas funcionalidades

---

**Desarrollado con ❤️ - SGA Mobile v1.0**
