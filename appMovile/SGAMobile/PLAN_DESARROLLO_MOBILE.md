# 📱 Plan de Desarrollo - App Móvil SGA

## 🎨 Paleta de Colores (Web)
- **Primario**: `#6366f1` (Azul Índigo)
- **Secundario**: `#8b5cf6` (Púrpura)
- **Gradiente Principal**: `linear-gradient(90deg, #6366f1, #8b5cf6)`
- **Fondo**: `#ffffff` / `#f8f9fa`
- **Texto**: `#222222` / `#374151`
- **Éxito**: `#10b981`
- **Error**: `#ef4444`
- **Advertencia**: `#f59e0b`

## 📋 Módulos a Desarrollar

### ✅ Módulo 1: Configuración Base y Tema
- [📝] Crear archivo de colores y tema global
- [📝] Configurar estilos base (tipografía, espaciados)
- [📝] Crear componentes UI base (Button, Input, Card)

### ✅ Módulo 2: Autenticación
- [📝] Login Screen (ya existe, actualizar estilos)
- [📝] Manejo de sesión y tokens
- [📝] Pantalla de perfil

### ✅ Módulo 3: Gestión de Clientes
- [📝] Lista de clientes
- [📝] Búsqueda y filtros
- [📝] Ver detalle de cliente
- [📝] Crear nuevo cliente
- [📝] Editar cliente (sin delete)

### ✅ Módulo 4: Gestión de Inventario/Artículos
- [📝] Lista de artículos disponibles
- [📝] Búsqueda por nombre, talla, color
- [📝] Filtros por categoría
- [📝] Ver detalle de artículo
- [📝] Crear nuevo artículo con foto
- [📝] Editar artículo (sin delete)
- [📝] Indicador de disponibilidad

### ✅ Módulo 5: Gestión de Alquileres/Órdenes
- [📝] Lista de órdenes (Entregar/Recibir)
- [📝] Crear nuevo alquiler
  - Seleccionar cliente
  - Seleccionar artículos disponibles
  - Configurar fechas
  - Agregar observaciones
- [📝] Ver detalle de alquiler
- [📝] Marcar como entregado
- [📝] Marcar como devuelto
- [📝] Gestión de pagos

### ✅ Módulo 6: Gestión de Pagos
- [📝] Ver pagos de un alquiler
- [📝] Registrar nuevo pago
- [📝] Ver saldo pendiente
- [📝] Historial de pagos

## 🚀 Orden de Implementación

1. **Fase 1: Base** (Sesión actual)
   - Tema y colores
   - Componentes UI base
   - Actualizar Login

2. **Fase 2: Clientes**
   - CRUD Clientes (sin Delete)
   
3. **Fase 3: Inventario**
   - CRUD Artículos (sin Delete)
   - Gestión de fotos

4. **Fase 4: Alquileres**
   - Crear alquiler
   - Listar alquileres
   - Entregar/Devolver

5. **Fase 5: Pagos**
   - Gestión de pagos
   - Integración con alquileres

## 📦 Estructura de Archivos

```
src/
├── theme/
│   ├── colors.ts          # Paleta de colores
│   └── styles.ts          # Estilos globales
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   └── ... (otros componentes)
├── screens/
│   ├── Auth/
│   ├── Clients/
│   ├── Inventory/
│   ├── Orders/
│   └── Payments/
└── api/
    ├── clientesApi.ts
    ├── articulosApi.ts
    ├── alquileresApi.ts
    └── pagosApi.ts
```

## 🎯 Próximo Paso
Empezar con Fase 1: Configuración de tema y componentes base
