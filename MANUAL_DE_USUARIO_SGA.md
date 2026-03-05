# 📖 Manual de Usuario - Sistema de Gestión de Alquileres (SGA)

**Versión:** 1.0  
**Fecha:** Febrero 2026  
**Desarrollado por:** SENA

---

## 📑 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Acceso al Sistema](#acceso-al-sistema)
4. [Roles de Usuario](#roles-de-usuario)
5. [Manual Web - Versión Escritorio](#manual-web---versión-escritorio)
6. [Manual Móvil - Aplicación Android/iOS](#manual-móvil---aplicación-androidios)
7. [Funcionalidades por Módulo](#funcionalidades-por-módulo)
8. [Preguntas Frecuentes (FAQ)](#preguntas-frecuentes-faq)
9. [Solución de Problemas](#solución-de-problemas)
10. [Contacto y Soporte](#contacto-y-soporte)

---

## 🎯 Introducción

### ¿Qué es SGA?

**SGA (Sistema de Gestión de Alquileres)** es una plataforma integral diseñada para gestionar el alquiler de vestidos y artículos de moda. El sistema permite:

- **Administrar inventario** de artículos disponibles
- **Gestionar clientes** y sus datos
- **Crear y controlar alquileres** (órdenes de renta)
- **Registrar pagos** y abonos
- **Generar reportes** administrativos
- **Catálogo público** para que los clientes vean productos

### Características Principales

✅ **Multiplataforma**: Disponible en web y móvil (Android/iOS)  
✅ **Seguro**: Autenticación con email y contraseña cifrada  
✅ **Intuitivo**: Interfaz moderna y fácil de usar  
✅ **Completo**: Gestión integral desde inventario hasta pagos  
✅ **Tiempo Real**: Sincronización automática de datos  

---

## 💻 Requisitos del Sistema

### Para la Versión Web

| Requisito | Especificación |
|-----------|---------------|
| **Navegador** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| **Conexión** | Internet estable (mínimo 2 Mbps) |
| **Resolución** | Mínimo 1280x720px (recomendado 1920x1080px) |
| **JavaScript** | Habilitado |

### Para la Aplicación Móvil

| Requisito | Especificación |
|-----------|---------------|
| **Sistema Operativo** | Android 8.0+ o iOS 12.0+ |
| **Memoria RAM** | Mínimo 2 GB |
| **Almacenamiento** | 100 MB libres |
| **Conexión** | WiFi o datos móviles |
| **Permisos** | Cámara (para fotos de productos) |

---

## 🔐 Acceso al Sistema

### Credenciales de Usuario

El sistema cuenta con tres tipos de usuarios, cada uno con credenciales específicas:

#### 👑 Administrador
- **Correo:** `admin@ejemplo.com`
- **Contraseña:** `admin123`
- **Permisos:** Acceso completo al sistema

#### 👔 Vendedor
- **Correo:** `vendedor@ejemplo.com`
- **Contraseña:** `vendedor123`
- **Permisos:** Inventario, clientes, alquileres, pagos

#### 👤 Cliente
- **Registro:** Desde la aplicación web
- **Permisos:** Ver catálogo, realizar pedidos

### Primer Acceso

1. **Abrir la aplicación** (web o móvil)
2. **Ingresar correo electrónico**
3. **Ingresar contraseña**
4. **Clic en "Ingresar" o "Login"**
5. El sistema le redirigirá automáticamente según su rol

---

## 👥 Roles de Usuario

### 👑 ADMINISTRADOR
**Acceso completo al sistema**

| Módulo | Permisos |
|--------|----------|
| Inventario | ✅ Crear, editar, eliminar artículos |
| Clientes | ✅ Crear, editar, eliminar clientes |
| Alquileres | ✅ Crear, modificar, cancelar alquileres |
| Pagos | ✅ Registrar, consultar, anular pagos |
| Usuarios | ✅ Crear vendedores y administradores |
| Reportes | ✅ Ver todas las estadísticas |
| Categorías | ✅ Crear y gestionar categorías |

### 👔 VENDEDOR
**Operaciones diarias**

| Módulo | Permisos |
|--------|----------|
| Inventario | ✅ Ver, editar precio |
| Clientes | ✅ Crear, editar clientes |
| Alquileres | ✅ Crear y gestionar alquileres |
| Pagos | ✅ Registrar y consultar pagos |
| Usuarios | ❌ Sin acceso |
| Reportes | ❌ Sin acceso (solo Admin) |

### 👤 CLIENTE
**Visualización y consulta**

| Módulo | Permisos |
|--------|----------|
| Catálogo | ✅ Ver productos disponibles |
| Mis Pedidos | ✅ Ver historial de alquileres |
| Perfil | ✅ Editar datos personales |
| Inventario | ❌ Sin acceso |
| Reportes | ❌ Sin acceso |

---

## 🌐 Manual Web - Versión Escritorio

### 1. Página de Inicio Pública

**URL:** `http://localhost:5174/`

#### Funcionalidades
- **Hero Section**: Presentación del negocio
- **Catálogo Público**: Vista previa de productos
- **FAQ**: Preguntas frecuentes
- **Botón "Login"**: Acceso para personal

#### Navegación
```
┌─────────────────────────────┐
│  Logo SGA    Inicio  Catálogo  FAQ  [Login] │
├─────────────────────────────┤
│                             │
│   🏪 Alquiler de Vestidos    │
│   Elegancia para tu evento   │
│   [Ver Catálogo]            │
│                             │
└─────────────────────────────┘
```

---

### 2. Inicio de Sesión (Staff)

**URL:** `http://localhost:5174/login-seller`

#### Paso a paso:
1. **Clic en botón "Login"** desde la página principal
2. **Ingresar correo electrónico**
   - Ejemplo: `admin@ejemplo.com`
3. **Ingresar contraseña**
   - Ejemplo: `admin123`
4. **Clic en "Ingresar"**
5. **Esperar redirección** al panel de control

#### Mensajes:
- ✅ **"Login exitoso"**: Redirige al dashboard
- ❌ **"Credenciales inválidas"**: Verificar email/contraseña
- ⚠️ **"Error al conectar"**: Verificar que el backend esté activo

---

### 3. Panel de Control (Dashboard)

**URL:** `http://localhost:5174/home-seller`

#### Menú Lateral

**Para VENDEDOR:**
```
📊 Dashboard
📦 Inventario
📋 Nueva Orden
👤 Nuevo Cliente
📄 Órdenes
👥 Clientes
🚪 Cerrar Sesión
```

**Para ADMINISTRADOR (adicional):**
```
📊 Dashboard
📦 Inventario
📋 Nueva Orden
👤 Nuevo Cliente
📄 Órdenes
👥 Clientes
📈 Reportes        ← Solo Admin
👔 Usuarios        ← Solo Admin
🚪 Cerrar Sesión
```

---

### 4. Gestión de Inventario

**URL:** `http://localhost:5174/home-seller/inventory`

#### Vista Principal

**Elementos en pantalla:**
- 🔍 **Barra de búsqueda**: Buscar por nombre de artículo
- 🏷️ **Filtro de categorías**: Chips para filtrar rápidamente
- ➕ **Botón "Agregar Artículo"**: Crear nuevo producto
- ➕ **Botón "Nueva Categoría"**: Crear categoría
- 📋 **Lista de artículos**: Cards con información

#### Crear Nuevo Artículo

**Paso a paso:**
1. **Clic en "Agregar Artículo"** (botón verde)
2. **Completar formulario:**
   - **Nombre del artículo** (obligatorio)
   - **Categoría** (seleccionar del dropdown)
   - **Género** (Hombre/Mujer/Unisex)
   - **Talla** (XS, S, M, L, XL, etc.)
   - **Color** (Rojo, Azul, Negro, etc.)
   - **Precio de alquiler** (solo números)
   - **Foto** (clic en "Seleccionar foto")
3. **Clic en "Guardar"**
4. **Confirmación**: "Artículo creado con éxito"

#### Editar Artículo Existente

1. **Clic en ícono ✏️ (lápiz)** en la tarjeta del artículo
2. **Modificar campos** necesarios
3. **Opcional**: Cambiar foto (seleccionar nueva)
4. **Clic en "Actualizar"**
5. **Confirmación**: "Artículo actualizado"

#### Eliminar Artículo

1. **Clic en ícono 🗑️ (papelera)** en la tarjeta
2. **Confirmación**: "¿Estás seguro?"
3. **Clic en "Sí, eliminar"**
4. El artículo se marca como inactivo

#### Filtrar Artículos

**Por categoría:**
- Clic en chip de categoría deseada
- Los resultados se actualizan automáticamente
- Clic nuevamente para quitar filtro

**Por búsqueda:**
- Escribir en la barra de búsqueda
- Filtrado en tiempo real mientras escribe

---

### 5. Gestión de Clientes

**URL:** `http://localhost:5174/home-seller/clients`

#### Registrar Nuevo Cliente

1. **Clic en "Nuevo Cliente"** (menú lateral)
2. **Completar formulario:**
   - **Tipo de documento** (Cédula, Pasaporte, NIT)
   - **Número de documento** (sin puntos ni guiones)
   - **Primer nombre** (obligatorio)
   - **Segundo nombre** (opcional)
   - **Primer apellido** (obligatorio)
   - **Segundo apellido** (opcional)
   - **Correo electrónico** (formato válido)
   - **Teléfono** (10 dígitos)
   - **Dirección completa**
   - **Barrio** (seleccionar del dropdown)
3. **Clic en "Registrar Cliente"**
4. **Confirmación**: "Cliente creado exitosamente"

#### Buscar Cliente

**Métodos de búsqueda:**
- 🔍 **Por nombre**: Escribir en barra de búsqueda
- 📄 **Por documento**: Ingresar número de documento
- 📧 **Por email**: Ingresar correo electrónico

#### Editar Información de Cliente

1. **Buscar al cliente**
2. **Clic en ícono ✏️ (editar)**
3. **Modificar datos** necesarios
4. **Clic en "Actualizar"**
5. **Confirmación**: "Cliente actualizado"

---

### 6. Crear Nuevo Alquiler

**URL:** `http://localhost:5174/home-seller/new-rent`

#### Proceso Completo

**PASO 1: Seleccionar Cliente**
1. **Ingresar número de documento** del cliente
2. **Clic en "Buscar"**
3. **Verificar datos** del cliente mostrados
4. Si no existe: **Clic en "Registrar Nuevo Cliente"**

**PASO 2: Seleccionar Fechas**
1. **Fecha de alquiler** (cuándo se registra)
2. **Fecha de entrega** (cuándo se entrega al cliente)
3. **Fecha de retiro** (cuándo el cliente devuelve)

**PASO 3: Seleccionar Artículos**
1. **Ver lista de artículos** disponibles
2. **Marcar checkbox** de artículos deseados
3. Ver **precio de cada artículo**
4. Ver **total acumulado** en tiempo real

**PASO 4: Observaciones (opcional)**
1. Escribir notas adicionales
2. Ejemplo: "Cliente necesita ajustes", "Evento el sábado"

**PASO 5: Confirmar Alquiler**
1. **Revisar resumen:**
   - Cliente
   - Fechas
   - Artículos seleccionados
   - Total a pagar
2. **Clic en "Crear Alquiler"**
3. **Confirmación**: "Alquiler creado exitosamente"
4. Se genera automáticamente el registro

---

### 7. Gestión de Órdenes/Alquileres

**URL:** `http://localhost:5174/home-seller/orders`

#### Vista de Órdenes

**Dos pestañas principales:**

**📦 Por Entregar**
- Alquileres creados pero aún no entregados al cliente
- **Acción**: Botón "Marcar como Entregado"

**📥 Por Recibir**
- Alquileres entregados, esperando devolución
- **Acción**: Botón "Marcar como Devuelto"

#### Información Mostrada en Cada Orden:

```
┌─────────────────────────────────────┐
│ Alquiler #001                       │
│ Cliente: Juan Pérez                 │
│ Documento: 1234567890               │
│ Teléfono: 3001234567                │
│                                     │
│ Artículos:                          │
│ • Vestido Rojo - Talla M - $50,000  │
│ • Zapatos Negro - Talla 38 - $20,000│
│                                     │
│ 📅 Entrega: 15/Feb/2026             │
│ 📅 Retiro: 17/Feb/2026              │
│ 💰 Total: $70,000                   │
│                                     │
│ [Marcar Entregado] [Registrar Pago] │
└─────────────────────────────────────┘
```

#### Marcar como Entregado

1. **Localizar el alquiler** en pestaña "Por Entregar"
2. **Verificar** que el cliente recogió los artículos
3. **Opcional**: Verificar pago inicial
4. **Clic en "Marcar como Entregado"**
5. **Confirmación**: "Artículo entregado al cliente"
6. La orden se **mueve a "Por Recibir"**

#### Marcar como Devuelto

1. **Localizar el alquiler** en pestaña "Por Recibir"
2. **Verificar estado** de los artículos devueltos
3. **Revisar pagos pendientes**
4. **Clic en "Marcar como Devuelto"**
5. **Confirmación**: "Alquiler completado"
6. Los artículos vuelven a estar **disponibles**

---

### 8. Registro de Pagos

#### Vista de Pagos

**Acceso:** Desde cualquier orden → Botón "Registrar Pago"

#### Registrar Nuevo Pago/Abono

**Información automática:**
- **Total del alquiler**: $70,000
- **Pagos registrados**: $30,000
- **Saldo pendiente**: $40,000

**Paso a paso:**
1. **Ver saldo pendiente**
2. **Ingresar monto** del abono
   - Ejemplo: $20,000
3. **Fecha automática**: Fecha actual
4. **Clic en "Registrar Pago"**
5. **Confirmación**: "Pago registrado correctamente"

#### Ver Historial de Pagos

1. **Clic en "Ver Pagos"** en una orden
2. **Lista de todos los pagos:**
   ```
   Pago 1: $30,000 - 15/Feb/2026
   Pago 2: $20,000 - 16/Feb/2026
   Pago 3: $20,000 - 17/Feb/2026
   ────────────────────────────
   Total pagado: $70,000
   Saldo: $0
   ```

#### Validaciones Automáticas

- ⚠️ **No puede exceder** el saldo pendiente
- ⚠️ **Debe ser mayor a $0**
- ✅ **Al completar pago total**: Marca "Pagado"

---

### 9. Reportes (Solo Administrador)

**URL:** `http://localhost:5174/home-seller/reports`

#### Tipos de Reportes

**📊 Reportes Disponibles:**

1. **Ventas del Día**
   - Total de alquileres creados hoy
   - Monto total generado
   - Artículos más rentados

2. **Ventas del Mes**
   - Comparativa con mes anterior
   - Gráfico de tendencias
   - Top 10 artículos

3. **Estado de Inventario**
   - Artículos disponibles
   - Artículos en alquiler
   - Artículos que necesitan mantenimiento

4. **Clientes Frecuentes**
   - Top 10 clientes
   - Cantidad de alquileres
   - Monto total gastado

5. **Pagos Pendientes**
   - Lista de alquileres con saldo
   - Total de deudas
   - Filtro por antigüedad

#### Exportar Reportes

1. **Seleccionar reporte** deseado
2. **Configurar fechas** (inicio y fin)
3. **Clic en "Generar Reporte"**
4. **Opciones:**
   - 📄 Imprimir
   - 📊 Exportar a Excel
   - 📧 Enviar por email

---

### 10. Gestión de Usuarios (Solo Admin)

#### Crear Nuevo Usuario

**Tipos de usuarios a crear:**
- 👑 Administrador
- 👔 Vendedor

**Formulario:**
1. **Tipo de documento**
2. **Número de documento** (único)
3. **Nombres y apellidos**
4. **Correo electrónico** (se usará para login)
5. **Contraseña** (mínimo 6 caracteres)
6. **Teléfono**
7. **Dirección y barrio**
8. **Rol** (ADMIN o VENDEDOR)
9. **Clic en "Crear Usuario"**

#### Activar/Desactivar Usuario

- **Desactivar**: Usuario no puede iniciar sesión
- **Activar**: Restaurar acceso

---

## 📱 Manual Móvil - Aplicación Android/iOS

### 1. Instalación de la App

#### Android
1. **Descargar APK** desde el enlace proporcionado
2. **Habilitar instalación** de fuentes desconocidas
3. **Instalar aplicación**
4. **Abrir SGA Mobile**

#### iOS
1. **Descargar desde App Store** (cuando esté disponible)
2. **O usar Expo Go** para pruebas
3. **Abrir aplicación**

---

### 2. Pantalla de Inicio (Sin Login)

#### Vista Pública

**Pantalla principal:**
```
┌─────────────────────────┐
│  SGA        [👤 Login]  │
├─────────────────────────┤
│                         │
│  🏪 Alquiler de Vestidos│
│                         │
│  Elegancia y estilo     │
│  para tu evento         │
│                         │
│  [Ver Catálogo Público] │
│                         │
│  ⭐ Características:     │
│  ✓ Amplio catálogo      │
│  ✓ Precios accesibles   │
│  ✓ Asesoría personalizada│
│                         │
└─────────────────────────┘
```

#### Catálogo Público

**Acceso:** Sin necesidad de login

**Funcionalidades:**
- Ver todos los artículos disponibles
- Filtrar por categorías
- Buscar por nombre
- Ver precios
- **No permite alquilar** (solo visualización)

---

### 3. Login en la App Móvil

**Acceso:** Botón "Login" → Pantalla de inicio de sesión

#### Pantalla de Login

```
┌─────────────────────────┐
│                         │
│       👤 LOGIN          │
│                         │
│  📧 Correo Electrónico  │
│  ┌───────────────────┐  │
│  │ admin@ejemplo.com │  │
│  └───────────────────┘  │
│                         │
│  🔒 Contraseña          │
│  ┌───────────────────┐  │
│  │ ●●●●●●●●          │  │
│  └───────────────────┘  │
│                         │
│  [  Iniciar Sesión  ]   │
│                         │
│  Credenciales de prueba:│
│  Admin: admin@ejemplo.com│
│  Pass: admin123         │
│                         │
└─────────────────────────┘
```

#### Proceso de Login

1. **Ingresar correo electrónico**
2. **Ingresar contraseña**
3. **Tap en "Iniciar Sesión"**
4. **Esperar validación** (indicador de carga)
5. **Redirección automática** al dashboard

---

### 4. Navegación Principal (Staff)

#### Para VENDEDOR - 4 Pestañas Inferiores

```
┌─────────────────────────┐
│  Contenido de pantalla  │
│                         │
├─────────────────────────┤
│ 📋  📄  👥  👤         │
│ Inv  Ord  Cli  Perfil  │
└─────────────────────────┘
```

**Pestañas:**
1. **📋 Inventario**: Gestión de artículos
2. **📄 Órdenes**: Alquileres y entregas
3. **👥 Clientes**: Gestión de clientes
4. **👤 Perfil**: Datos del usuario

#### Para ADMINISTRADOR - 5 Pestañas

```
┌─────────────────────────┐
│  Contenido de pantalla  │
│                         │
├─────────────────────────┤
│ 📋 📄 👥 📊 👤        │
│ Inv Ord Cli Rep Perfil │
└─────────────────────────┘
```

**Pestaña extra:**
5. **📊 Reportes**: Estadísticas (solo Admin)

---

### 5. Inventario Móvil

#### Vista Principal

**Elementos:**
- 🔍 **Barra de búsqueda** en la parte superior
- 🏷️ **Chips de categorías** (scroll horizontal)
- 📋 **Lista de artículos** (scroll vertical)
- ➕ **Botón flotante** para crear artículo

#### Card de Artículo

```
┌────────────────────────┐
│ [Imagen del artículo]  │
├────────────────────────┤
│ Vestido Rojo           │
│ Categoría: Vestidos    │
│ Talla M • Color Rojo   │
│ 💰 $50,000             │
│ Stock: Disponible      │
│                        │
│    [✏️ Editar]         │
└────────────────────────┘
```

#### Ver Detalles de Artículo

**Tap en una card** para ver información completa:
- Foto en tamaño grande
- Descripción completa
- Género, talla, color
- Precio
- Categoría
- Estado (activo/inactivo)

#### Filtrar Artículos

**Por categoría:**
- Deslizar chips horizontalmente
- Tap en categoría deseada
- Tap nuevamente para quitar filtro

**Por búsqueda:**
- Tap en barra de búsqueda
- Escribir nombre del artículo
- Resultados en tiempo real

#### Pull to Refresh

- **Deslizar hacia abajo** desde el tope de la lista
- Actualiza la información desde el servidor

---

### 6. Gestión de Órdenes Móvil

#### Vista de Órdenes

**Dos pestañas superiores:**

**TAB 1: Por Entregar**
- Lista de alquileres pendientes de entrega
- Cards con información del cliente y artículos

**TAB 2: Por Recibir**
- Alquileres ya entregados
- Esperando devolución del cliente

#### Card de Orden

```
┌──────────────────────────┐
│ 👤 Juan Pérez            │
│ 📄 Doc: 1234567890       │
│ 📞 300-1234567           │
│                          │
│ 📅 Entrega: 15/Feb/2026  │
│ 📅 Retiro: 17/Feb/2026   │
│                          │
│ 📦 Artículos:            │
│ • Vestido Rojo M         │
│   $50,000                │
│                          │
│ 💰 Total: $50,000        │
│                          │
│ [✓ Marcar Entregado]     │
│ [💵 Registrar Pago]      │
└──────────────────────────┘
```

#### Marcar como Entregado

1. **Ubicar la orden** en pestaña "Por Entregar"
2. **Tap en "Marcar Entregado"**
3. **Confirmación**: ¿Confirmar entrega?
4. **Tap en "Sí"**
5. Toast: "Artículo entregado"
6. Se mueve a "Por Recibir"

#### Marcar como Devuelto

1. **Pestaña "Por Recibir"**
2. **Tap en "Marcar Devuelto"**
3. **Confirmación**: ¿Artículo devuelto?
4. **Tap en "Sí"**
5. Toast: "Devolución registrada"

#### Registrar Pago desde Móvil

1. **Tap en "Registrar Pago"** en una orden
2. **Ver información:**
   - Total: $50,000
   - Pagado: $20,000
   - Saldo: $30,000
3. **Ingresar monto** del nuevo pago
4. **Tap en "Guardar Pago"**
5. **Confirmación**: "Pago registrado"

---

### 7. Crear Nuevo Alquiler (Móvil)

#### Botón de Acceso

**Ubicación:** Botón flotante ➕ en pantalla de Órdenes

#### Proceso Paso a Paso

**PANTALLA 1: Buscar Cliente**

```
┌─────────────────────────┐
│  Nuevo Alquiler         │
├─────────────────────────┤
│                         │
│ 📄 Número de Documento: │
│ ┌─────────────────────┐ │
│ │ 1234567890          │ │
│ └─────────────────────┘ │
│                         │
│ [  🔍 Buscar Cliente ]  │
│                         │
│ ┌─────────────────────┐ │
│ │ ✓ Cliente encontrado│ │
│ │                     │ │
│ │ Juan Pérez          │ │
│ │ 📧 juan@mail.com    │ │
│ │ 📞 3001234567       │ │
│ └─────────────────────┘ │
│                         │
│ [+ Registrar Nuevo]     │
│                         │
└─────────────────────────┘
```

**PANTALLA 2: Fechas**

```
┌─────────────────────────┐
│  Seleccionar Fechas     │
├─────────────────────────┤
│                         │
│ 📅 Fecha de Alquiler:   │
│ ┌─────────────────────┐ │
│ │ 17/Feb/2026     [📆]│ │
│ └─────────────────────┘ │
│                         │
│ 📅 Fecha de Entrega:    │
│ ┌─────────────────────┐ │
│ │ 18/Feb/2026     [📆]│ │
│ └─────────────────────┘ │
│                         │
│ 📅 Fecha de Retiro:     │
│ ┌─────────────────────┐ │
│ │ 20/Feb/2026     [📆]│ │
│ └─────────────────────┘ │
│                         │
└─────────────────────────┘
```

**PANTALLA 3: Seleccionar Artículos**

```
┌─────────────────────────┐
│  Artículos Disponibles  │
├─────────────────────────┤
│                         │
│ ☑️ Vestido Rojo M       │
│    $50,000              │
│ ────────────────────    │
│ ☐ Zapatos Negro 38      │
│    $20,000              │
│ ────────────────────    │
│ ☑️ Bolso Dorado         │
│    $15,000              │
│ ────────────────────    │
│                         │
│ 📦 Artículos: 2         │
│ 💰 Total: $65,000       │
│                         │
│ [  Crear Alquiler  ]    │
│                         │
└─────────────────────────┘
```

#### Confirmación

**Al crear alquiler:**
1. Toast: "Alquiler creado exitosamente"
2. Redirección a pantalla de Órdenes
3. Aparece en pestaña "Por Entregar"

---

### 8. Gestión de Clientes (Móvil)

#### Lista de Clientes

**Vista:**
```
┌─────────────────────────┐
│  👥 Clientes            │
├─────────────────────────┤
│ 🔍 [Buscar cliente...]  │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ 👤 Juan Pérez       │ │
│ │ 📄 CC: 1234567890   │ │
│ │ 📧 juan@mail.com    │ │
│ │ 📞 3001234567       │ │
│ │ 📍 Cra 10 #20-30    │ │
│ │    Bosa el recreo   │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 👤 María García     │ │
│ │ 📄 CE: 9876543210   │ │
│ │ ...                 │ │
│ └─────────────────────┘ │
│                         │
│         ➕              │
└─────────────────────────┘
```

#### Buscar Cliente

**Métodos:**
- Escribir en barra de búsqueda
- Busca por: nombre, documento, email
- Resultados en tiempo real

#### Ver Detalles de Cliente

**Tap en card de cliente** para ver información completa

#### Crear Nuevo Cliente (Formulario completo)

**Campos preparados:**
- Tipo de documento
- Número de documento
- Nombres y apellidos
- Email
- Teléfono
- Dirección
- Barrio

---

### 9. Perfil de Usuario (Móvil)

#### Vista de Perfil

```
┌─────────────────────────┐
│  👤 Mi Perfil           │
├─────────────────────────┤
│                         │
│      👤                 │
│   Admin User            │
│                         │
│ 📧 Email:               │
│ admin@ejemplo.com       │
│                         │
│ 🏷️ Rol:                 │
│ ADMINISTRADOR           │
│                         │
│ 📄 Documento:           │
│ 1234567890              │
│                         │
│ 📞 Teléfono:            │
│ 3001234567              │
│                         │
│ 📍 Dirección:           │
│ Cra 10 #20-30           │
│ Bosa el recreo          │
│                         │
│ [  🚪 Cerrar Sesión  ]  │
│                         │
└─────────────────────────┘
```

#### Cerrar Sesión

1. **Tap en "Cerrar Sesión"**
2. **Confirmación**: ¿Cerrar sesión?
3. **Tap en "Sí"**
4. Limpia datos locales
5. Redirección a pantalla de Login

---

## 📚 Funcionalidades por Módulo

### Módulo: Inventario

| Funcionalidad | Web | Móvil | Descripción |
|---------------|-----|-------|-------------|
| Ver artículos | ✅ | ✅ | Lista completa del inventario |
| Crear artículo | ✅ | ✅ | Agregar nuevo producto |
| Editar artículo | ✅ | ✅ | Modificar información |
| Eliminar artículo | ✅ | 🔄 | Marcar como inactivo |
| Subir foto | ✅ | 📷 | Adjuntar imagen del producto |
| Filtrar por categoría | ✅ | ✅ | Organizar por tipo |
| Buscar | ✅ | ✅ | Por nombre o descripción |

### Módulo: Clientes

| Funcionalidad | Web | Móvil | Descripción |
|---------------|-----|-------|-------------|
| Listar clientes | ✅ | ✅ | Ver todos los registros |
| Registrar cliente | ✅ | ✅ | Nuevo cliente |
| Editar cliente | ✅ | ✅ | Actualizar datos |
| Buscar cliente | ✅ | ✅ | Por documento/nombre |
| Ver historial | ✅ | 🔄 | Alquileres del cliente |

### Módulo: Alquileres

| Funcionalidad | Web | Móvil | Descripción |
|---------------|-----|-------|-------------|
| Crear alquiler | ✅ | ✅ | Nueva orden |
| Listar alquileres | ✅ | ✅ | Todas las órdenes |
| Marcar entregado | ✅ | ✅ | Confirmar entrega |
| Marcar devuelto | ✅ | ✅ | Confirmar devolución |
| Ver por entregar | ✅ | ✅ | Pendientes de entrega |
| Ver por recibir | ✅ | ✅ | Pendientes de devolución |
| Editar alquiler | ✅ | 🔄 | Modificar orden |
| Cancelar alquiler | ✅ | 🔄 | Anular orden |

### Módulo: Pagos

| Funcionalidad | Web | Móvil | Descripción |
|---------------|-----|-------|-------------|
| Registrar pago | ✅ | ✅ | Nuevo abono |
| Ver historial | ✅ | ✅ | Lista de pagos |
| Calcular saldo | ✅ | ✅ | Automático |
| Ver deudas | ✅ | 🔄 | Saldos pendientes |

### Módulo: Reportes (Solo Admin)

| Funcionalidad | Web | Móvil |
|---------------|-----|-------|
| Ventas del día | ✅ | ✅ |
| Ventas del mes | ✅ | ✅ |
| Top artículos | ✅ | ✅ |
| Top clientes | ✅ | ✅ |
| Inventario | ✅ | ✅ |
| Exportar a Excel | ✅ | ❌ |

**Leyenda:**
- ✅ Implementado
- 🔄 Preparado (UI lista)
- ❌ No disponible
- 📷 Requiere permisos

---

## ❓ Preguntas Frecuentes (FAQ)

### General

**P: ¿Necesito internet para usar la aplicación?**  
R: Sí, SGA requiere conexión a internet para sincronizar datos con el servidor.

**P: ¿Puedo usar el sistema en un celular?**  
R: Sí, puedes usar la versión web desde el navegador móvil o descargar la app nativa.

**P: ¿Los datos se guardan automáticamente?**  
R: Sí, al crear o editar información, se guarda inmediatamente en el servidor.

### Inventario

**P: ¿Puedo subir fotos de los artículos?**  
R: Sí, en web puedes seleccionar archivos. En móvil puedes tomar foto directamente con la cámara.

**P: ¿Qué formatos de imagen acepta?**  
R: JPG, JPEG, PNG. Tamaño máximo recomendado: 5 MB.

**P: ¿Puedo tener artículos repetidos?**  
R: Sí, pueden existir varios artículos con el mismo nombre pero diferentes características.

**P: ¿Qué pasa si elimino un artículo?**  
R: Se marca como "inactivo" pero no se borra permanentemente. Admin puede reactivarlo.

### Clientes

**P: ¿Es obligatorio el email del cliente?**  
R: Sí, se requiere para notificaciones y recuperación de información.

**P: ¿Puede un cliente registrarse solo?**  
R: No, actualmente solo el personal (Admin/Vendedor) puede registrar clientes.

**P: ¿Qué hago si el cliente no tiene barrio en la lista?**  
R: Contacta al administrador para que agregue el barrio faltante.

### Alquileres

**P: ¿Puedo alquilar varios artículos a la vez?**  
R: Sí, en un solo alquiler puedes seleccionar múltiples artículos.

**P: ¿Puedo modificar un alquiler ya creado?**  
R: Sí, pero solo antes de marcarlo como entregado.

**P: ¿Qué pasa si olvido marcar como entregado?**  
R: Puedes marcarlo en cualquier momento. No afecta el funcionamiento.

**P: ¿Puedo entregar parcialmente un alquiler?**  
R: Actualmente el sistema marca la entrega completa. Si necesitas entregar parcialmente, crea alquileres separados.

### Pagos

**P: ¿Puedo recibir pagos parciales?**  
R: Sí, puedes registrar múltiples abonos hasta completar el total.

**P: ¿El sistema calcula el saldo automáticamente?**  
R: Sí, resta automáticamente los abonos del total.

**P: ¿Puedo eliminar un pago registrado por error?**  
R: Actualmente no. Contacta al administrador si necesitas corrección.

**P: ¿Qué métodos de pago acepta?**  
R: El sistema registra cualquier tipo de pago (efectivo, transferencia, tarjeta). Es solo registro contable.

### Seguridad

**P: ¿Mi contraseña es segura?**  
R: Sí, las contraseñas se encriptan con BCrypt antes de guardarse.

**P: ¿Cuánto tiempo dura mi sesión?**  
R: El token JWT dura 24 horas. Después debes iniciar sesión nuevamente.

**P: ¿Puedo cambiar mi contraseña?**  
R: Actualmente solo el administrador puede cambiar contraseñas.

**P: ¿Qué hago si olvido mi contraseña?**  
R: Contacta al administrador del sistema.

### Técnico

**P: ¿Funciona offline?**  
R: No, requiere conexión permanente a internet.

**P: ¿Se puede usar en tablet?**  
R: Sí, tanto la versión web como la app móvil funcionan en tablets.

**P: ¿Compatible con qué navegadores?**  
R: Chrome, Firefox, Safari, Edge (versiones recientes).

**P: ¿Requiere instalación?**  
R: La web no. La app móvil sí requiere instalación.

---

## 🔧 Solución de Problemas

### Problemas de Acceso

#### No puedo iniciar sesión

**Síntomas:** Mensaje "Credenciales inválidas"

**Soluciones:**
1. ✅ Verificar que el email esté escrito correctamente
2. ✅ Verificar mayúsculas/minúsculas en la contraseña
3. ✅ Confirmar que tu cuenta está activa (consultar Admin)
4. ✅ Limpiar caché del navegador
5. ✅ Intentar desde navegador de incógnito

#### Error "No se puede conectar al servidor"

**Soluciones:**
1. ✅ Verificar conexión a internet
2. ✅ Ping al servidor: `http://localhost:8080`
3. ✅ Verificar que el backend esté corriendo
4. ✅ Revisar firewall/antivirus
5. ✅ Contactar al administrador del sistema

#### Sesión expirada constantemente

**Causa:** Token JWT vencido (24 horas)

**Solución:**
1. Cerrar sesión manualmente
2. Volver a iniciar sesión
3. Si persiste, limpiar localStorage (Web) o datos de app (Móvil)

### Problemas con Inventario

#### No puedo subir fotos

**Web:**
1. ✅ Verificar formato (JPG, PNG)
2. ✅ Reducir tamaño de archivo (máx 5MB)
3. ✅ Verificar permisos de carpeta uploads/
4. ✅ Revisar consola del navegador (F12)

**Móvil:**
1. ✅ Dar permisos de cámara a la app
2. ✅ Dar permisos de almacenamiento
3. ✅ Reiniciar la app
4. ✅ Verificar espacio disponible en dispositivo

#### La foto no se muestra

**Soluciones:**
1. ✅ Verificar que el servidor esté sirviendo archivos estáticos
2. ✅ Comprobar ruta: `http://localhost:8080/api/uploads/articulos/`
3. ✅ Verificar permisos de lectura en carpeta
4. ✅ Recargar página (F5)

#### No aparecen artículos en la lista

**Soluciones:**
1. ✅ Verificar filtros activos (categoría, búsqueda)
2. ✅ Hacer pull-to-refresh (móvil) o F5 (web)
3. ✅ Verificar que existan artículos activos en BD
4. ✅ Revisar consola para errores de API

### Problemas con Alquileres

#### No encuentro al cliente

**Soluciones:**
1. ✅ Verificar número de documento (sin puntos ni guiones)
2. ✅ Buscar en lista de clientes primero
3. ✅ Verificar que el cliente esté activo
4. ✅ Registrar nuevo cliente si no existe

#### No puedo marcar como entregado

**Posibles causas:**
1. ❌ No tienes permisos (solo Vendedor/Admin)
2. ❌ Ya fue marcado como entregado
3. ❌ Error de conexión

**Soluciones:**
1. ✅ Verificar permisos de usuario
2. ✅ Revisar estado actual del alquiler
3. ✅ Refrescar página e intentar nuevamente

#### Total del alquiler incorrecto

**Verificar:**
1. ✅ Sumar manualmente precios de artículos
2. ✅ Revisar que todos los artículos estén seleccionados
3. ✅ Verificar precios actuales en inventario
4. ✅ Si el error persiste, revisar con Admin

### Problemas con Pagos

#### No puedo registrar pago

**Errores comunes:**
```
❌ "El monto supera el saldo"
→ Verificar saldo pendiente

❌ "Monto inválido"
→ Ingresar solo números, sin puntos ni comas

❌ "Error al guardar"
→ Verificar conexión, reintentar
```

#### Saldo pendiente incorrecto

**Soluciones:**
1. ✅ Verificar todos los pagos registrados
2. ✅ Sumar manualmente los abonos
3. ✅ Si hay discrepancia, contactar Admin
4. ✅ Revisar en reportes para auditoría

### Problemas de Rendimiento

#### La aplicación web va lenta

**Soluciones:**
1. ✅ Cerrar pestañas innecesarias
2. ✅ Limpiar caché del navegador
3. ✅ Actualizar navegador a última versión
4. ✅ Verificar velocidad de internet
5. ✅ Usar conexión por cable en vez de WiFi

#### La app móvil se cierra sola

**Soluciones:**
1. ✅ Liberar memoria RAM (cerrar apps)
2. ✅ Actualizar app a última versión
3. ✅ Limpiar caché de la app
4. ✅ Reiniciar el dispositivo
5. ✅ Desinstalar y reinstalar app

#### Imágenes tardan en cargar

**Web:**
1. ✅ Optimizar imágenes antes de subir
2. ✅ Usar formato JPG comprimido
3. ✅ Verificar velocidad de internet

**Móvil:**
1. ✅ Conectarse a WiFi en vez de datos
2. ✅ Esperar a que cargue completamente
3. ✅ Si persiste, reportar al Admin

### Problemas de Datos

#### Datos no se actualizan

**Web:**
1. ✅ Presionar F5 para refrescar
2. ✅ Limpiar caché (Ctrl + Shift + Del)
3. ✅ Cerrar sesión y volver a entrar

**Móvil:**
1. ✅ Pull-to-refresh (deslizar hacia abajo)
2. ✅ Cerrar y reabrir la app
3. ✅ Cerrar sesión y volver a entrar

#### Cambios no se guardan

**Verificar:**
1. ✅ Mensaje de confirmación aparece
2. ✅ No hay errores en pantalla
3. ✅ Token de sesión no expiró
4. ✅ Conexión a internet estable

**Si persiste:**
1. Cerrar sesión
2. Limpiar caché/datos
3. Iniciar sesión nuevamente
4. Reintentar operación

### Contactar Soporte

Si ninguna solución funciona:

1. **Anotar:**
   - Qué estabas haciendo
   - Mensaje de error exacto
   - Navegador/dispositivo usado
   - Hora del problema

2. **Capturar:**
   - Screenshot del error
   - Consola del navegador (F12 → Console)

3. **Contactar:**
   - Email del administrador
   - WhatsApp de soporte
   - Teléfono de la empresa

---

## 📞 Contacto y Soporte

### Soporte Técnico

**Horario de Atención:**
- Lunes a Viernes: 8:00 AM - 6:00 PM
- Sábados: 9:00 AM - 1:00 PM
- Domingos y festivos: Cerrado

### Canales de Comunicación

📧 **Email:** soporte@sga.com.co  
📱 **WhatsApp:** +57 300 123 4567  
📞 **Teléfono:** (601) 234 5678  
🏢 **Dirección:** Calle 10 #20-30, Bogotá

### Tiempo de Respuesta

| Canal | Tiempo Estimado |
|-------|-----------------|
| WhatsApp | 5-15 minutos |
| Email | 2-4 horas |
| Teléfono | Inmediato |

### Solicitar Asistencia

1. **Describe el problema** claramente
2. **Indica tu rol** (Admin, Vendedor, Cliente)
3. **Envía capturas** si es posible
4. **Proporciona número de orden** si aplica

---

## 📝 Glosario de Términos

| Término | Definición |
|---------|------------|
| **Alquiler** | Orden o préstamo de artículos a un cliente |
| **Artículo** | Producto disponible para alquilar |
| **Cliente** | Persona que alquila artículos |
| **Dashboard** | Panel de control principal |
| **Entrega** | Momento en que el cliente recoge los artículos |
| **Devolución** | Momento en que el cliente retorna los artículos |
| **Inventario** | Conjunto de todos los artículos disponibles |
| **Saldo** | Monto pendiente de pago |
| **Token** | Clave de sesión temporal |
| **Pull-to-refresh** | Deslizar hacia abajo para actualizar |
| **Tap** | Tocar/presionar en pantalla táctil |
| **Chip** | Botón pequeño de categoría/filtro |
| **FAB** | Floating Action Button (botón flotante circular) |
| **Modal** | Ventana emergente sobre el contenido |
| **Toast** | Mensaje temporal en pantalla |

---

## 📋 Checklist de Tareas Comunes

### ✅ Al Iniciar el Día

- [ ] Encender computadora/abrir app
- [ ] Iniciar sesión en SGA
- [ ] Verificar alquileres "Por Entregar" del día
- [ ] Revisar clientes con citas programadas
- [ ] Verificar inventario disponible

### ✅ Al Crear un Alquiler

- [ ] Buscar o registrar cliente
- [ ] Verificar disponibilidad de artículos
- [ ] Seleccionar fechas correctas
- [ ] Elegir todos los artículos necesarios
- [ ] Verificar total calculado
- [ ] Confirmar datos antes de guardar
- [ ] Registrar pago inicial si aplica

### ✅ Al Entregar Artículos

- [ ] Verificar identidad del cliente
- [ ] Revisar estado de los artículos
- [ ] Confirmar que son los correctos
- [ ] Marcar como "Entregado" en sistema
- [ ] Entregar comprobante al cliente

### ✅ Al Recibir Devolución

- [ ] Inspeccionar estado de artículos
- [ ] Registrar daños si existen
- [ ] Verificar pago completo
- [ ] Marcar como "Devuelto" en sistema
- [ ] Devolver comprobante firmado

### ✅ Al Cerrar el Día

- [ ] Revisar alquileres pendientes
- [ ] Verificar pagos del día
- [ ] Guardar todo correctamente
- [ ] Cerrar sesión del sistema

---

## 📊 Anexos

### Anexo A: Atajos de Teclado (Web)

| Atajo | Acción |
|-------|--------|
| F5 | Refrescar página |
| Ctrl + F | Buscar en página |
| Esc | Cerrar modal |
| Tab | Siguiente campo |
| Shift + Tab | Campo anterior |

### Anexo B: Iconografía

| Icono | Significado |
|-------|-------------|
| 📦 | Inventario/Artículos |
| 👤 | Usuario/Cliente |
| 📄 | Órdenes/Alquileres |
| 💰 | Pagos/Dinero |
| 📊 | Reportes |
| ✏️ | Editar |
| 🗑️ | Eliminar |
| ➕ | Agregar/Crear |
| 🔍 | Buscar |
| ✓ | Confirmar |
| ✕ | Cancelar |

### Anexo C: Estados de Alquiler

```
CREADO → Alquiler registrado pero no entregado
    ↓
ENTREGADO → Cliente tiene los artículos
    ↓
DEVUELTO → Artículos retornados
    ↓
FINALIZADO → Alquiler completado y pagado
```

### Anexo D: Flujo de Pago

```
Total Alquiler: $100,000

Pago 1: $40,000 → Saldo: $60,000
Pago 2: $30,000 → Saldo: $30,000
Pago 3: $30,000 → Saldo: $0 ✓ PAGADO
```

---

## 📖 Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | Feb 2026 | Versión inicial del manual |

---

## ✍️ Créditos

**Desarrollado por:**
- SENA - Servicio Nacional de Aprendizaje
- Centro de Gestión de Mercados, Logística y Tecnologías de la Información

**Tecnologías:**
- Frontend Web: React + Vite
- App Móvil: React Native + Expo
- Backend: Spring Boot + MySQL

---

## 📄 Términos y Condiciones

Este software es propiedad de SENA y está destinado exclusivamente para uso académico y de formación. Queda prohibida su distribución, venta o modificación sin autorización expresa.

---

**© 2026 SENA - Sistema de Gestión de Alquileres (SGA)**  
**Todos los derechos reservados**

---

## 🎓 FINAL DEL MANUAL

**Gracias por usar SGA**

Para más información, capacitación o soporte técnico, contacta al administrador del sistema.

**¡Éxito en tu gestión de alquileres!** 🎉
