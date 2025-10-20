# Autenticación JWT - Sistema de Gestión de Alquileres (SGA)

## 🔐 Configuración de Seguridad Implementada

Se ha implementado un sistema completo de autenticación JWT con Spring Security.

## 📋 Usuarios Predefinidos

El sistema crea automáticamente dos usuarios al iniciar:

### Usuario Administrador
- **Email**: `admin@ejemplo.com`
- **Contraseña**: `admin123`
- **Rol**: `ADMIN`
- **Permisos**: Acceso completo a todos los endpoints

### Usuario Vendedor
- **Email**: `vendedor@ejemplo.com`
- **Contraseña**: `vendedor123`
- **Rol**: `VENDEDOR`
- **Permisos**: Acceso limitado (lectura y escritura sin eliminación)

## 🚀 Endpoints de Autenticación

### Login
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "correoElec": "admin@ejemplo.com",
  "contraseña": "admin123"
}
```

**Respuesta Exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "email": "admin@ejemplo.com",
  "rol": "ADMIN",
  "mensaje": "Login exitoso"
}
```

## 🔑 Uso del Token JWT

Una vez obtenido el token, debes incluirlo en el header `Authorization` de todas las peticiones protegidas:

```http
GET http://localhost:8080/api/articulos
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

## 📌 Endpoints Protegidos

### Públicos (sin autenticación)
- `POST /api/auth/login` - Login

### Solo ADMIN
- `GET /api/usu/**` - Gestión de usuarios
- `POST /api/usu/**`
- `PUT /api/usu/**`
- `DELETE /api/usu/**`
- `DELETE /api/articulos/**` - Eliminar artículos

### ADMIN y VENDEDOR
- `GET /api/articulos/**` - Ver artículos
- `POST /api/articulos/**` - Crear artículos
- `PUT /api/articulos/**` - Actualizar artículos
- `GET /api/AlquilerArticulos/**` - Ver alquileres
- `POST /api/AlquilerArticulos/**` - Crear alquileres
- `GET /api/categoria/**` - Ver categorías
- `GET /api/pago/**` - Ver pagos

## 🧪 Pruebas en Postman

### 1. Login como Admin

```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "correoElec": "admin@ejemplo.com",
  "contraseña": "admin123"
}
```

### 2. Copiar el token de la respuesta

### 3. Usar el token en peticiones protegidas

```
GET http://localhost:8080/api/articulos
Authorization: Bearer {TOKEN_AQUI}
```

## ⚙️ Configuración del Token

Los tokens JWT tienen las siguientes características:
- **Tiempo de expiración**: 24 horas (86400000 ms)
- **Algoritmo**: HMAC-SHA con clave secreta
- **Claims incluidos**: 
  - `sub` (subject): Email del usuario
  - `rol`: Rol del usuario
  - `iat` (issued at): Fecha de emisión
  - `exp` (expiration): Fecha de expiración

## 🛠️ Configuración Personalizada (Opcional)

Puedes personalizar la configuración JWT en `application.properties`:

```properties
# Clave secreta para firmar los tokens (mínimo 64 caracteres)
jwt.secret=miClaveSecretaSuperSeguraParaJWT2024ConMasDeChar

# Tiempo de expiración en milisegundos (24 horas por defecto)
jwt.expiration=86400000
```

## 📝 Notas Importantes

1. **Primera ejecución**: Los usuarios se crean automáticamente al iniciar la aplicación si no existen.
2. **Base de datos**: Asegúrate de tener al menos un registro en las tablas `barrio` y `tipo_doc` antes de iniciar.
3. **Contraseñas**: Las contraseñas se almacenan encriptadas con BCrypt.
4. **Token expirado**: Si el token expira, debes hacer login nuevamente para obtener uno nuevo.
5. **CORS**: El endpoint de autenticación está configurado para permitir peticiones desde `http://localhost:5173` (frontend).

## 🐛 Troubleshooting

### Error: "No hay barrios en la base de datos"
**Solución**: Inserta al menos un barrio en la tabla `barrio`:
```sql
INSERT INTO barrio (nom_barrio) VALUES ('Centro');
```

### Error: "No hay tipos de documento en la base de datos"
**Solución**: Inserta al menos un tipo de documento:
```sql
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Cédula de Ciudadanía');
```

### Error: "Credenciales inválidas"
**Solución**: Verifica que estés usando el email y contraseña correctos:
- Admin: `admin@ejemplo.com` / `admin123`
- Vendedor: `vendedor@ejemplo.com` / `vendedor123`

### Error: "401 Unauthorized" en endpoints protegidos
**Solución**: 
1. Verifica que el token esté incluido en el header `Authorization`
2. Asegúrate de usar el formato: `Bearer {token}`
3. Verifica que el token no haya expirado

## 📚 Archivos Creados

- `JwtUtil.java` - Utilidades para generar y validar tokens
- `JwtAuthenticationFilter.java` - Filtro para validar tokens en cada petición
- `CustomUserDetailsService.java` - Servicio para cargar detalles del usuario
- `SecurityConfig.java` - Configuración de Spring Security
- `AuthController.java` - Controlador de autenticación
- `LoginRequest.java` - DTO para la petición de login
- `LoginResponse.java` - DTO para la respuesta de login
- `ProjectApplication.java` (modificado) - Inicialización automática de usuarios

## 🎯 Próximos Pasos

1. Ejecuta la aplicación Spring Boot
2. Verifica que los usuarios se hayan creado correctamente (revisa la consola)
3. Prueba el login en Postman
4. Usa el token para acceder a los endpoints protegidos
