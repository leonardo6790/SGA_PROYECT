# 🔐 Autenticación JWT - Frontend Conectado al Backend

## ✅ Cambios Realizados

### 1. **API de Autenticación** (`src/api/authApi.js`)
- Creado nuevo archivo para manejar la autenticación
- Endpoint: `POST http://localhost:8080/api/auth/login`
- Envía credenciales y recibe token JWT
- Función `getAuthHeaders()` para incluir el token en las peticiones

### 2. **AuthContext Actualizado** (`src/context/AuthContext.jsx`)
- Función `login()` ahora es **asíncrona** y conecta con el backend
- Guarda el **token JWT** en `localStorage` como `sga_token`
- Guarda información del usuario (email y rol)
- Función `logout()` limpia token y datos del usuario
- Redirección automática según el rol del usuario

### 3. **Página Sign-in Actualizada** (`src/pages/Customer_view/Sign-in/Sign-in.page.jsx`)
- Manejo de estados de carga (`loading`)
- Manejo de errores mejorado
- Petición asíncrona al backend
- Redirección según rol:
  - **ADMIN/VENDEDOR** → `/home-seller`
  - **CLIENTE** → `/home`

### 4. **APIs Actualizadas con JWT**
Todos los archivos API ahora incluyen el token JWT en las peticiones:
- ✅ `usuariosApi.js` - Gestión de usuarios
- ✅ `articulosApi.js` - Gestión de artículos
- ✅ `alquilerArticulosApi.js` - Gestión de alquileres

## 🔑 Credenciales de Prueba

### Usuario Administrador
```
Email: admin@ejemplo.com
Contraseña: admin123
Rol: ADMIN
```

### Usuario Vendedor
```
Email: vendedor@ejemplo.com
Contraseña: vendedor123
Rol: VENDEDOR
```

## 🚀 Cómo Probar

### 1. Verificar que el Backend esté corriendo
```bash
# El backend debe estar en: http://localhost:8080
netstat -ano | findstr :8080
```

### 2. Iniciar el Frontend
```bash
cd FRONT
npm run dev
# Acceder a: http://localhost:5174
```

### 3. Probar Login
1. Ir a la página de Sign-in
2. Ingresar credenciales (admin o vendedor)
3. Al iniciar sesión correctamente:
   - Se guarda el token JWT en localStorage
   - Se redirige a `/home-seller`
   - El token se incluye automáticamente en todas las peticiones

### 4. Verificar en DevTools
```javascript
// Abrir consola del navegador (F12)
localStorage.getItem('sga_token')    // Ver el token JWT
localStorage.getItem('sga_user')      // Ver datos del usuario
```

## 🔧 Flujo de Autenticación

```
1. Usuario ingresa email y contraseña
   ↓
2. Frontend envía POST a /api/auth/login
   ↓
3. Backend valida credenciales
   ↓
4. Backend genera token JWT y lo retorna
   ↓
5. Frontend guarda token en localStorage
   ↓
6. Frontend guarda datos del usuario
   ↓
7. Todas las peticiones incluyen: Authorization: Bearer {token}
```

## 📡 Endpoints Protegidos

### Públicos (sin token)
- `POST /api/auth/login` - Login

### Protegidos (requieren token)
- `GET /api/usu/ConsultarUsuarios` - Solo ADMIN
- `POST /api/usu/crear` - Solo ADMIN
- `PUT /api/usu/actualizar/{id}` - Solo ADMIN
- `GET /api/articulos` - ADMIN y VENDEDOR
- `POST /api/articulos/Crear` - ADMIN y VENDEDOR
- `PUT /api/articulos/Actualizar/{id}` - ADMIN y VENDEDOR
- `GET /api/AlquilerArticulos` - ADMIN y VENDEDOR

## 🛡️ Seguridad

- ✅ Token JWT con expiración de 24 horas
- ✅ Contraseñas hasheadas con BCrypt
- ✅ Token incluido en header Authorization
- ✅ Validación en cada petición protegida
- ✅ Logout limpia token y datos del usuario

## 🐛 Solución de Problemas

### Error: "Error al conectar con el servidor"
- Verificar que el backend esté corriendo en puerto 8080
- Revisar la consola del navegador para más detalles

### Error: "Credenciales inválidas"
- Verificar email y contraseña
- Usar las credenciales de prueba proporcionadas

### Error: 401 Unauthorized en peticiones
- El token puede haber expirado (24 horas)
- Hacer logout y login nuevamente

## ✨ Estado Actual

✅ Frontend completamente conectado al backend  
✅ Autenticación JWT funcionando  
✅ Todas las APIs incluyen el token JWT  
✅ Redirección según rol del usuario  
✅ Manejo de errores implementado  
✅ 0 errores de ESLint  
