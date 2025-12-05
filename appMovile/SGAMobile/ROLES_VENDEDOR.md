# 🔐 Sistema de Roles - App Móvil SGA

## Descripción General

La aplicación móvil SGA ahora cuenta con un sistema de roles elegante y profesional que permite diferentes niveles de acceso según el tipo de usuario:

- **👑 Admin**: Acceso completo a todas las funcionalidades incluyendo reportes y configuración
- **👨‍💼 Vendedor**: Acceso completo a gestión de inventario, clientes y órdenes
- **👤 Cliente**: Acceso simplificado al catálogo

## 🎨 Nueva Interfaz de Selección

La pantalla de selección presenta tres tarjetas con gradientes de colores distintivos:

### 1. **Portal de Administrador** 👑 (Rojo)
   - Color: Gradiente rojo (#FF6B6B → #EE5A6F)
   - Badge: ADMIN
   - **Funcionalidades:**
     - 📊 **Reportes**: Análisis completo de ventas y rendimiento
     - 👥 **Usuarios**: Gestión de vendedores y clientes
     - ⚙️ **Configuración**: Control total del sistema
     - 📋 **Inventario**: Gestión completa de artículos
     - 📄 **Órdenes**: Control de todos los alquileres
     - 💰 **Finanzas**: Gestión de pagos y balance

### 2. **Portal de Vendedores** 👨‍💼 (Morado)
   - Color: Gradiente morado (#667eea → #764ba2)
   - Badge: VENDEDOR
   - **Funcionalidades:**
     - 📋 **Inventario**: Gestión completa de artículos
       - Ver todos los artículos
       - Crear nuevos artículos
       - Editar artículos existentes
       - Filtrar por categorías
       - Agregar categorías nuevas
     
     - 📄 **Órdenes**: Control de alquileres
       - Ver todos los alquileres
       - Marcar como entregado
       - Marcar como devuelto
     
     - 👥 **Clientes**: Administración de clientes
       - Ver lista de clientes
       - Agregar nuevos clientes
       - Editar información
     
     - 💳 **Pagos**: Gestión de pagos
     - 📦 **Entregas**: Control de entregas
     - 🏷️ **Categorías**: Crear y gestionar categorías

### 3. **Acceso Cliente** 👤 (Verde)
   - Color: Gradiente verde (#4ECDC4 → #44A08D)
   - Badge: CLIENTE
   - **Funcionalidades:**
     - 🏪 **Catálogo**: Explorar productos disponibles
     - 🔍 **Búsqueda**: Encontrar productos fácilmente
     - 📱 **Mis Pedidos**: Ver historial
     - ⭐ **Favoritos**: Guardar productos preferidos

## 🔑 Credenciales de Prueba

### Para Administrador:
```
Email: admin@ejemplo.com
Contraseña: admin123
Rol: ADMIN
Color: Rojo
```

### Para Vendedor:
```
Email: vendedor@ejemplo.com
Contraseña: vendedor123
Rol: VENDEDOR
Color: Morado
```

### Para Cliente:
```
Email: cliente@ejemplo.com
Contraseña: cliente123
Rol: CLIENTE
Color: Verde
```

## 🎯 Flujo de Inicio de Sesión

1. **Selección de Rol**
   - Al abrir la app, aparece la pantalla de selección
   - Elige "Vendedor" o "Cliente"

2. **Formulario de Login**
   - Ingresa tu correo electrónico
   - Ingresa tu contraseña
   - Toca "Iniciar Sesión"

3. **Validación**
   - El sistema verifica las credenciales
   - Identifica automáticamente el rol del usuario
   - Redirige a la interfaz correspondiente

4. **Navegación**
   - **Vendedores/Admin**: Acceden a 4 pestañas (Inventario, Órdenes, Clientes, Perfil)
   - **Clientes**: Acceden a 2 pestañas (Catálogo, Perfil)

## 🔄 Cambiar de Rol

Si te equivocaste de selección:
1. Desde cualquier formulario de login, toca "← Volver"
2. Selecciona el rol correcto
3. Ingresa tus credenciales

## 🛡️ Seguridad

- **Token JWT**: Todas las peticiones están autenticadas
- **Validación de Rol**: El backend verifica los permisos
- **Sesión Persistente**: La sesión se mantiene aunque cierres la app
- **Cerrar Sesión**: Disponible en la pestaña de Perfil

## 📊 Roles en el Backend

El sistema reconoce los siguientes roles:

```typescript
type Rol = 'ADMIN' | 'VENDEDOR' | 'CLIENTE';
```

### Permisos por Rol:

| Funcionalidad | ADMIN | VENDEDOR | CLIENTE |
|--------------|-------|----------|---------|
| Ver Reportes | ✅ | ❌ | ❌ |
| Gestionar Usuarios | ✅ | ❌ | ❌ |
| Configuración Sistema | ✅ | ❌ | ❌ |
| Ver Inventario | ✅ | ✅ | ❌ |
| Crear Artículos | ✅ | ✅ | ❌ |
| Editar Artículos | ✅ | ✅ | ❌ |
| Ver Órdenes | ✅ | ✅ | ❌ |
| Gestionar Pagos | ✅ | ✅ | ❌ |
| Ver Clientes | ✅ | ✅ | ❌ |
| Crear Clientes | ✅ | ✅ | ❌ |
| Ver Catálogo | ✅ | ✅ | ✅ |
| Crear Categorías | ✅ | ✅ | ❌ |

## 🎨 Interfaz por Rol

### Administrador:
```
┌─────────────────────────────────┐
│   📋      📄      👥      👤    │
│ Inventario Órdenes Clientes Perfil│
└─────────────────────────────────┘
```
**Color del tema**: Gradiente Rojo

### Vendedor:
```
┌─────────────────────────────────┐
│   📋      📄      👥      👤    │
│ Inventario Órdenes Clientes Perfil│
└─────────────────────────────────┘
```
**Color del tema**: Gradiente Morado

### Cliente:
```
┌─────────────────────────────────┐
│        🏪          👤           │
│      Catálogo     Perfil        │
└─────────────────────────────────┘
```
**Color del tema**: Gradiente Verde

## ✨ Características de Diseño

### Pantalla de Selección:
- **Fondo con gradiente animado** (Morado a púrpura)
- **3 tarjetas con colores distintivos**:
  - Admin: Rojo elegante
  - Vendedor: Morado profesional
  - Cliente: Verde fresco
- **Badges identificativos** en cada tarjeta
- **Lista de funcionalidades** con iconos
- **Sombras y elevaciones** para efecto 3D
- **Animaciones suaves** al tocar

### Diseño Responsivo:
- Adaptado para diferentes tamaños de pantalla
- Scroll suave en pantallas pequeñas
- Iconos grandes y texto legible
- Espaciado generoso entre elementos

## 🔧 Configuración Técnica

### Archivo: `AppNavigator.tsx`
```typescript
const isAdminOrSeller = user?.rol === 'ADMIN' || user?.rol === 'VENDEDOR';
```

### Archivo: `LoginScreen.tsx`
- Pantalla de selección de rol
- Formularios separados para cada tipo de usuario
- Iconos diferenciados (👨‍💼 para vendedor, 👤 para cliente)

## 📝 Notas Importantes

1. **Mayúsculas**: Los roles en el backend están en MAYÚSCULAS (`ADMIN`, `VENDEDOR`, `CLIENTE`)
2. **Auto-detección**: No necesitas seleccionar manualmente si eres admin o vendedor, el sistema lo detecta automáticamente
3. **Consistencia**: Las mismas secciones están disponibles en web y móvil para vendedores
4. **Sincronización**: Los cambios realizados en la app móvil se reflejan en el panel web y viceversa

## 🐛 Solución de Problemas

### No puedo ver las opciones de vendedor
- Verifica que hayas ingresado con credenciales de ADMIN o VENDEDOR
- Cierra sesión e intenta nuevamente
- Verifica que el backend esté corriendo en `http://10.0.2.2:8080/api`

### Las pestañas no aparecen correctamente
- Verifica tu rol en la pestaña de Perfil
- Asegúrate de que el token JWT sea válido
- Intenta cerrar sesión y volver a ingresar

### Error al iniciar sesión
- Verifica que el backend esté corriendo
- Revisa la URL de la API en `src/api/axiosConfig.ts`
- Confirma que las credenciales sean correctas

## 🚀 Próximas Mejoras

- [ ] Registro de nuevos vendedores desde la app
- [ ] Recuperación de contraseña
- [ ] Notificaciones push para nuevos pedidos
- [ ] Modo offline con sincronización
- [ ] Escaneo de códigos QR para artículos
