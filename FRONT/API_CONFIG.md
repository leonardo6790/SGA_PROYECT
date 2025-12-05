# Configuración de API - Frontend

## 📝 Descripción
Este documento explica la configuración centralizada de las APIs del frontend.

## 🔧 Configuración

### Archivo `.env`
```env
VITE_API_URL=http://localhost:8080/api
```

### Archivo de configuración centralizado
**Ubicación:** `src/config/api.config.js`

Este archivo contiene:
- `API_BASE_URL`: URL base de la API (desde .env o por defecto)
- `getAuthHeaders()`: Helper para headers con autenticación
- `getAuthHeadersForFormData()`: Helper para FormData con autenticación

## 📂 Estructura de APIs

Todas las APIs importan la configuración centralizada:

```javascript
import API_BASE_URL, { getAuthHeaders } from '../config/api.config.js';

const BASE_URL = `${API_BASE_URL}/endpoint`;
```

### APIs configuradas:
- ✅ `authApi.js` → `/api/auth`
- ✅ `articulosApi.js` → `/api/articulos`
- ✅ `categoriasApi.js` → `/api/cat`
- ✅ `clientesApi.js` → `/api/cli`
- ✅ `alquilerApi.js` → `/api/alquiler`
- ✅ `alquilerArticulosApi.js` → `/api/AlquilerArticulos`
- ✅ `barriosApi.js` → `/api/barrio`
- ✅ `pagoApi.js` → `/api/pagos`
- ✅ `tipoDocApi.js` → `/api/tipodoc`
- ✅ `usuariosApi.js` → `/api/usu`

## 🚀 Uso

### Para desarrollo local:
```bash
# El .env ya está configurado para localhost
npm run dev
```

### Para producción:
Actualiza el archivo `.env` con la URL del servidor:
```env
VITE_API_URL=https://tu-servidor.com/api
```

## 🔐 Autenticación

Todas las APIs usan el token JWT almacenado en `localStorage` con la clave `sga_token`.

Los headers se configuran automáticamente:
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

## ✨ Ventajas de esta configuración

1. **Centralizada**: Un solo lugar para cambiar la URL de la API
2. **Consistente**: Todas las APIs usan la misma configuración
3. **Flexible**: Fácil cambio entre desarrollo y producción
4. **Mantenible**: Cambios en un solo archivo afectan todo el proyecto
