# 📱 Documentación SGA Mobile App

## 🎯 Descripción General

**SGA Mobile** es una aplicación móvil multiplataforma para la gestión de alquiler de vestidos y artículos de moda. Es la versión móvil del sistema SGA (Sistema de Gestión de Alquileres) que permite tanto a usuarios públicos explorar el catálogo como a administradores y vendedores gestionar inventario, clientes y órdenes de alquiler.

---

## 🛠️ Tecnologías y Frameworks

### **Framework Principal**
- **React Native 0.81.5** - Framework para desarrollo móvil multiplataforma
- **Expo SDK ~54.0.25** - Plataforma para desarrollo y despliegue de apps React Native
- **TypeScript ~5.9.2** - Superset de JavaScript con tipado estático

### **Navegación**
- **React Navigation 7.x** - Sistema de navegación
  - `@react-navigation/native` - Core de navegación
  - `@react-navigation/native-stack` - Navegación por pilas (stack)
  - `@react-navigation/bottom-tabs` - Navegación por pestañas inferiores

### **Gestión de Estado y Datos**
- **React Context API** - Gestión de estado global (AuthContext)
- **AsyncStorage** - Almacenamiento local persistente
- **Axios 1.13.2** - Cliente HTTP para comunicación con API REST

### **UI/UX**
- **Expo Linear Gradient** - Gradientes para UI moderna
- **Expo Image Picker** - Selección de imágenes
- **React Native Reanimated** - Animaciones fluidas
- **React Native Gesture Handler** - Gestos táctiles
- **React Native Safe Area Context** - Manejo de áreas seguras

---

## 📁 Estructura del Proyecto

```
SGAMobile/
├── App.tsx                    # Punto de entrada principal
├── index.ts                   # Registro de la app con Expo
├── app.json                   # Configuración de Expo
├── package.json               # Dependencias y scripts
├── tsconfig.json              # Configuración de TypeScript
│
├── assets/                    # Recursos estáticos (iconos, imágenes)
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
│
└── src/                       # Código fuente
    ├── api/                   # Configuración de APIs
    ├── components/            # Componentes reutilizables
    ├── context/               # Context providers (estado global)
    ├── navigation/            # Configuración de navegación
    ├── screens/               # Pantallas de la app
    ├── services/              # Lógica de negocio y servicios
    ├── theme/                 # Temas y estilos
    ├── types/                 # Definiciones de TypeScript
    └── utils/                 # Utilidades y constantes
```

---

## 📂 Descripción Detallada de Carpetas

### **📁 src/api/** - Configuración de APIs

Contiene los módulos de comunicación con el backend:

- **`axiosConfig.ts`** - Configuración central de Axios
  - Instancia de axios con URL base del backend
  - Interceptor de request para agregar token JWT automáticamente
  - Interceptor de response para manejar errores 401 (no autenticado)
  - Timeout de 10 segundos

- **APIs específicas por módulo:**
  - `alquilerApi.ts` - Gestión de alquileres
  - `articulosApi.ts` - CRUD de artículos/productos
  - `barriosApi.ts` - Catálogo de barrios
  - `categoriasApi.ts` - Categorías de productos
  - `clientesApi.ts` - Gestión de clientes
  - `pagoApi.ts` - Métodos de pago
  - `tipoDocApi.ts` - Tipos de documentos

### **📁 src/components/** - Componentes Reutilizables

Componentes UI compartidos en toda la aplicación:

- **`ArticuloCard.tsx`** - Tarjeta para mostrar artículos en el catálogo
  - Muestra imagen, nombre, categoría, precio y stock
  - Maneja imagen placeholder cuando no hay foto
  - Eventos de press para navegación

- **`Button.tsx`** - Botón personalizado reutilizable
  - Variantes de estilo (primary, secondary, danger)
  - Estados de carga y deshabilitado

- **`Input.tsx`** - Campo de entrada personalizado
  - Validación visual
  - Iconos y placeholders
  - Soporte para contraseñas

- **`PublicHeader.tsx`** - Header para pantallas públicas
  - Logo de la app
  - Botón de login

- **`ui/`** - Componentes UI adicionales

### **📁 src/context/** - Gestión de Estado Global

- **`AuthContext.tsx`** - Contexto de autenticación
  - Gestiona el estado del usuario autenticado
  - Proporciona funciones `login()` y `logout()`
  - Persiste sesión en AsyncStorage
  - Verifica autenticación al iniciar la app
  - Proporciona: `user`, `token`, `isAuthenticated`, `isLoading`

### **📁 src/navigation/** - Sistema de Navegación

- **`AppNavigator.tsx`** - Configurador principal de navegación
  - **PublicStack**: Navegación para usuarios no autenticados
    - PublicHomeScreen (página de inicio)
    - PublicCatalogScreen (catálogo público)
    - PrivateLoginScreen (login de staff)
  
  - **SellerTabNavigator**: Navegación para ADMIN/VENDEDOR autenticado
    - Tab 1: Inventario (InventoryScreen)
    - Tab 2: Órdenes (OrdersScreen)
    - Tab 3: Clientes (ClientsScreen)
    - Tab 4: Perfil (ProfileScreen)
    - Tab extra para Admin: Reportes (AdminReportsScreen)

### **📁 src/screens/** - Pantallas de la Aplicación

#### **Pantallas Públicas (sin autenticación):**
- **`PublicHomeScreen.tsx`** - Página de inicio pública
  - Hero section con gradiente morado
  - Información sobre SGA
  - Características destacadas
  - Botón para ver catálogo

- **`PublicCatalogScreen.tsx`** - Catálogo público
  - Lista de artículos disponibles
  - Filtro por categorías
  - Búsqueda de artículos
  - Sin opción de alquilar (solo visualización)

- **`PrivateLoginScreen.tsx`** - Login para personal (staff)
  - Selección de rol (ADMIN o VENDEDOR)
  - Formulario de login con email y contraseña
  - Credenciales de prueba mostradas
  - Diseño con gradiente diferente al público

#### **Pantallas Privadas (requieren autenticación):**

**Gestión de Inventario:**
- **`InventoryScreen.tsx`** - Lista de artículos en inventario
- **`AddArticleScreen.tsx`** - Agregar nuevo artículo
- **`CatalogScreen.tsx`** - Catálogo completo con opciones de gestión

**Gestión de Órdenes:**
- **`OrdersScreen.tsx`** - Lista de todas las órdenes de alquiler
- **`NewOrderScreen.tsx`** - Crear nueva orden
- **`NewRentScreen.tsx`** - Procesar nuevo alquiler
- **`MyOrdersScreen.tsx`** - Mis órdenes (vista de vendedor)

**Gestión de Clientes:**
- **`ClientsScreen.tsx`** - Lista de clientes
- **`NewClientScreen.tsx`** - Registrar nuevo cliente

**Administración:**
- **`AdminReportsScreen.tsx`** - Reportes y estadísticas (solo ADMIN)
- **`ProfileScreen.tsx`** - Perfil del usuario y configuración

**Dashboard:**
- **`HomeScreen.tsx`** - Dashboard principal después del login

### **📁 src/services/** - Lógica de Negocio

Capa de servicios que abstrae la lógica de negocio:

- **`authService.ts`** - Servicio de autenticación
  - `login()` - Iniciar sesión
  - `logout()` - Cerrar sesión
  - `checkAuth()` - Verificar si hay sesión activa
  - Manejo de AsyncStorage para persistencia

- **`articulosService.ts`** - Gestión de artículos
  - CRUD de artículos
  - Búsqueda y filtrado

- **`clientesService.ts`** - Gestión de clientes
  - CRUD de clientes
  - Validaciones

- **`alquileresService.ts`** - Gestión de alquileres
  - Crear alquileres
  - Consultar historial
  - Gestionar devoluciones

- **`catalogosService.ts`** - Catálogos auxiliares
  - Categorías
  - Barrios
  - Tipos de documento

### **📁 src/types/** - Definiciones de TypeScript

- **`index.ts`** - Interfaces y tipos de datos
  - `User` - Usuario del sistema
  - `Articulo` - Artículo/producto
  - `Cliente` - Cliente
  - `Alquiler` - Orden de alquiler
  - `AuthState` - Estado de autenticación
  - `LoginCredentials` - Credenciales de login
  - Y más...

### **📁 src/utils/** - Utilidades y Constantes

- **`constants.ts`** - Constantes de la aplicación
  - `API_BASE_URL` - URL del backend (configurable para dispositivo físico/emulador)
  - `SERVER_BASE_URL` - URL base para archivos estáticos
  - `STORAGE_KEYS` - Claves de AsyncStorage
  - `COLORS` - Paleta de colores (coherente con web)
  - `SPACING` - Espaciados consistentes
  - `FONT_SIZES` - Tamaños de fuente
  - `BORDER_RADIUS` - Radios de borde

### **📁 src/theme/** - Temas y Estilos

- **`colors.ts`** - Definiciones de colores
  - Color primario: `#9b59b6` (morado)
  - Color secundario: `#8e44ad`
  - Colores de estado (success, danger, warning)
  - Coherente con el frontend web

---

## 🔐 Autenticación y Seguridad

### **Flujo de Autenticación**

1. **Usuario abre la app** → `AuthContext` verifica si hay sesión guardada
2. **No hay sesión** → Muestra `PublicStack` (navegación pública)
3. **Usuario presiona Login** → Navega a `PrivateLoginScreen`
4. **Selecciona rol** → ADMIN o VENDEDOR
5. **Ingresa credenciales** → Email y contraseña
6. **AuthService.login()** → Envía petición al backend
7. **Backend valida** → Retorna usuario + token JWT
8. **Guarda en AsyncStorage** → Persiste sesión
9. **Actualiza AuthContext** → `isAuthenticated = true`
10. **Cambia navegación** → Muestra `SellerTabNavigator`

### **Persistencia de Sesión**

- Token JWT guardado en `AsyncStorage` con clave `@sga_token`
- Datos de usuario guardados con clave `@sga_user`
- Al abrir la app, verifica automáticamente si hay sesión válida
- Si token es inválido (401), cierra sesión automáticamente

### **Protección de Rutas**

- `AppNavigator` decide qué stack mostrar según `isAuthenticated`
- Pantallas privadas solo accesibles si `user !== null`

---

## 🎨 Diseño y UX

### **Paleta de Colores**

```typescript
COLORS = {
  primary: '#9b59b6',      // Morado principal (igual a web)
  secondary: '#8e44ad',    // Morado oscuro
  success: '#34C759',      // Verde
  danger: '#e74c3c',       // Rojo
  warning: '#FF9500',      // Naranja
  info: '#5AC8FA',         // Azul
  light: '#F2F2F7',        // Gris claro
  dark: '#1e1e1e',         // Negro
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  border: '#E5E5EA',
}
```

### **Características de Diseño**

- **Gradientes lineales** en hero sections
- **Tarjetas con sombras** para artículos y contenido
- **Iconos emoji** para identificar secciones rápidamente
- **Espaciado consistente** usando constantes
- **Tipografía escalable** con tamaños definidos
- **Safe Areas** para dispositivos con notch
- **Diseño responsivo** compatible con diferentes tamaños

---

## 🌐 Comunicación con el Backend

### **Configuración de API**

```typescript
// Configuración en src/utils/constants.ts
API_BASE_URL = 'http://192.168.10.7:8080/api'  // Dispositivo físico con Expo Go
// API_BASE_URL = 'http://10.0.2.2:8080/api'   // Emulador Android
// API_BASE_URL = 'http://localhost:8080/api'  // Web
```

### **Interceptores de Axios**

**Request Interceptor:**
- Agrega automáticamente el token JWT en header `Authorization: Bearer <token>`
- Se ejecuta antes de cada petición

**Response Interceptor:**
- Detecta errores 401 (no autenticado)
- Limpia sesión automáticamente si token es inválido
- Maneja errores de red y timeout

### **Endpoints Principales**

```
POST   /api/auth/login              # Login
GET    /api/articulos               # Listar artículos
POST   /api/articulos               # Crear artículo
PUT    /api/articulos/{id}          # Actualizar artículo
DELETE /api/articulos/{id}          # Eliminar artículo
GET    /api/clientes                # Listar clientes
POST   /api/clientes                # Crear cliente
GET    /api/alquileres              # Listar alquileres
POST   /api/alquileres              # Crear alquiler
GET    /api/categorias              # Listar categorías
GET    /api/barrios                 # Listar barrios
GET    /api/tipo-documento          # Tipos de documento
```

---

## 🚀 Comandos de Ejecución

### **Instalación de Dependencias**
```bash
cd c:\Users\Nicolas\OneDrive\Desktop\SGAAAAAAA\appMovile\SGAMobile
npm install
```

### **Iniciar en Modo Desarrollo**
```bash
npm start
```
- Abre el servidor de desarrollo de Expo
- Escanear código QR con **Expo Go** en dispositivo físico
- Presionar teclas para abrir en emulador

### **Ejecutar en Android**
```bash
npm run android
```

### **Ejecutar en iOS**
```bash
npm run ios
```

### **Ejecutar en Web**
```bash
npm run web
```

---

## 👥 Roles y Permisos

### **Roles Disponibles**

1. **ADMIN** (Administrador)
   - Acceso completo al sistema
   - Gestión de usuarios
   - Reportes y estadísticas
   - Gestión de inventario
   - Gestión de clientes
   - Gestión de alquileres

2. **VENDEDOR**
   - Gestión de inventario (ver y editar)
   - Gestión de clientes
   - Crear y gestionar alquileres
   - Ver órdenes

### **Credenciales de Prueba**

Según el archivo mostrado:
```
Email: admin@ejemplo.com
Contraseña: admin123
Rol: ADMIN
```

---

## 📊 Flujos Principales de la App

### **Flujo Público (Usuario no autenticado)**

```
1. Abrir App
   ↓
2. PublicHomeScreen (información sobre SGA)
   ↓
3. [Ver Catálogo] → PublicCatalogScreen
   ↓
4. Explorar artículos (solo lectura)
   ↓
5. [👤 Login] → PrivateLoginScreen
```

### **Flujo de Login**

```
1. PrivateLoginScreen → Seleccionar Rol
   ↓
2. Rol ADMIN o VENDEDOR
   ↓
3. Ingresar email y contraseña
   ↓
4. [Iniciar Sesión] → AuthService.login()
   ↓
5. Backend valida → Retorna token + datos usuario
   ↓
6. Guardar en AsyncStorage
   ↓
7. Actualizar AuthContext
   ↓
8. Navegar a Dashboard (SellerTabNavigator)
```

### **Flujo de Gestión de Inventario**

```
1. Tab "Inventario"
   ↓
2. InventoryScreen (lista de artículos)
   ↓
3. [+ Agregar] → AddArticleScreen
   ↓
4. Completar formulario (nombre, precio, categoría, foto)
   ↓
5. [Guardar] → articulosService.create()
   ↓
6. Backend guarda → Retorna artículo creado
   ↓
7. Actualizar lista en InventoryScreen
```

### **Flujo de Crear Alquiler**

```
1. Tab "Órdenes"
   ↓
2. OrdersScreen → [+ Nueva Orden]
   ↓
3. NewRentScreen
   ↓
4. Seleccionar cliente
   ↓
5. Agregar artículos
   ↓
6. Definir fechas (inicio/fin)
   ↓
7. [Confirmar] → alquileresService.create()
   ↓
8. Backend procesa → Retorna alquiler creado
   ↓
9. Navegar a OrdersScreen (lista actualizada)
```

---

## 🔧 Configuración Importante

### **app.json - Configuración de Expo**

```json
{
  "name": "SGA Mobile",
  "slug": "SGAMobile",
  "version": "1.0.0",
  "orientation": "portrait",
  "newArchEnabled": true,
  "android": {
    "package": "com.sga.mobile",
    "permissions": ["INTERNET", "ACCESS_NETWORK_STATE"]
  },
  "ios": {
    "bundleIdentifier": "com.sga.mobile"
  }
}
```

### **tsconfig.json - TypeScript**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

---

## 📝 Notas Importantes

### **Diferencias con el Frontend Web**

1. **Navegación Inicial:**
   - Web: Login directo
   - Mobile: Página pública primero, luego login opcional

2. **Roles:**
   - Web: ADMIN, VENDEDOR, CLIENTE
   - Mobile: Solo ADMIN y VENDEDOR (no hay rol CLIENTE)

3. **Catálogo:**
   - Web: Requiere login para ver precios
   - Mobile: Catálogo público sin login, pero no se puede alquilar

4. **UI:**
   - Web: Dashboard con cards grandes
   - Mobile: Bottom tabs para navegación rápida

### **Configuración de Red**

**Para Expo Go en dispositivo físico:**
- Usar IP local de tu PC (ej: `192.168.10.7`)
- Dispositivo y PC deben estar en la misma red WiFi
- Backend debe permitir CORS desde la IP del dispositivo

**Para emulador Android:**
- Usar `10.0.2.2` (IP especial que apunta a localhost de la PC)

**Para desarrollo web:**
- Usar `localhost`

---

## 🐛 Troubleshooting

### **"Network Error" al hacer login**

1. Verificar que el backend esté corriendo en `http://IP:8080`
2. Verificar IP en `src/utils/constants.ts`
3. Dispositivo y PC en misma red WiFi
4. Firewall no bloquea puerto 8080

### **"Token inválido"**

1. Limpiar AsyncStorage
2. Cerrar sesión y volver a iniciar
3. Verificar formato de respuesta del backend

### **"Cannot read property 'navigate' of undefined"**

- Navigation no está disponible en ese contexto
- Pasar `navigation` como prop o usar `useNavigation()` hook

---

## 📚 Recursos y Documentación

- [React Native](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)

---

## 🎯 Próximos Pasos / Mejoras Futuras

- [ ] Implementar notificaciones push
- [ ] Agregar modo offline con sincronización
- [ ] Implementar búsqueda avanzada con filtros
- [ ] Agregar soporte para múltiples idiomas
- [ ] Implementar dark mode
- [ ] Agregar animaciones de transición
- [ ] Implementar caché de imágenes
- [ ] Agregar validación de formularios mejorada

---

**Última actualización:** Diciembre 15, 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Funcional y en producción
