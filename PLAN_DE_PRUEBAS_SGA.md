# 📋 Plan de Pruebas - Sistema de Gestión de Alquileres (SGA)

**Versión:** 1.0  
**Fecha:** Marzo 2026  
**Proyecto:** Sistema de Gestión de Alquileres  
**Desarrollado por:** SENA

---

## 📑 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Objetivos del Plan de Pruebas](#objetivos-del-plan-de-pruebas)
3. [Alcance](#alcance)
4. [Estrategia de Pruebas](#estrategia-de-pruebas)
5. [Casos de Prueba por Módulo](#casos-de-prueba-por-módulo)
6. [Matriz de Trazabilidad](#matriz-de-trazabilidad)
7. [Criterios de Aceptación](#criterios-de-aceptación)

---

## 🎯 Introducción

Este documento define el plan de pruebas para el Sistema de Gestión de Alquileres (SGA), el cual incluye una aplicación web y una aplicación móvil para la gestión integral de alquiler de vestidos y artículos de moda.

---

## 📊 Objetivos del Plan de Pruebas

1. Verificar que todas las funcionalidades cumplan con los requerimientos especificados
2. Garantizar la integridad y seguridad de los datos
3. Validar la correcta integración entre frontend, backend y base de datos
4. Asegurar una experiencia de usuario óptima
5. Detectar y documentar defectos antes del despliegue en producción

---

## 🔍 Alcance

### Componentes a Probar:
- ✅ Backend (Spring Boot + Java)
- ✅ Frontend Web (React + Vite)
- ✅ Aplicación Móvil (React Native + Expo)
- ✅ API REST
- ✅ Base de datos (MySQL)
- ✅ Autenticación JWT
- ✅ Gestión de archivos (imágenes)

### Tipos de Pruebas:
- **Funcionales**: Verificación de requerimientos funcionales
- **Integración**: Comunicación entre componentes
- **Seguridad**: Autenticación y autorización
- **Usabilidad**: Experiencia del usuario
- **Regresión**: Validación tras cambios

---

## 📝 Estrategia de Pruebas

### Niveles de Prueba:
1. **Unitarias**: Componentes individuales
2. **Integración**: Módulos integrados
3. **Sistema**: Sistema completo
4. **Aceptación**: Validación con usuario final

### Prioridades:
- **Alta (P1)**: Funcionalidades críticas del negocio
- **Media (P2)**: Funcionalidades importantes
- **Baja (P3)**: Funcionalidades complementarias

---

# 📋 Casos de Prueba por Módulo

---

## 🔐 RF-01: MÓDULO DE AUTENTICACIÓN

### Requerimiento Funcional:
El sistema debe permitir a los usuarios autenticarse mediante correo electrónico y contraseña, validando credenciales y retornando un token JWT.

---

## 📊 TABLAS DE CASOS DE PRUEBA - MÓDULO DE AUTENTICACIÓN

---

| | **<Código del CP>** | **¿Prueba de despliegue?** | **Sí/No** |
|-------|----------|----------|----------|
| **<Nombre caso prueba>** | **CP-AUTH-001** | | **No** |

**Descripción:**  
Verificar que un usuario administrador pueda iniciar sesión exitosamente con credenciales válidas, recibir un token JWT y acceder al dashboard con permisos de administrador.

**Prerrequisitos:**
- Sistema backend en ejecución
- Usuario administrador existe en BD: `admin@ejemplo.com` / `admin123`
- Base de datos configurada y accesible
- Frontend web corriendo en `http://localhost:5174`

**Pasos:**
1. Abrir navegador en `http://localhost:5174/login-seller`
2. Ingresar correo electrónico en campo "Email": `admin@ejemplo.com`
3. Ingresar contraseña en campo "Password": `admin123`
4. Hacer clic en botón "Ingresar"
5. Observar redirección y menú de opciones

**Resultado esperado:**
- Se muestra mensaje "Login exitoso"
- Se recibe token JWT válido conteniendo rol "ADMIN"
- Se redirige a `/home-seller`
- Token se almacena en LocalStorage
- Menú muestra opciones de ADMIN (incluye Reportes y Usuarios)
- Tiempo de respuesta menor a 2 segundos
- Sesión permanece activa hasta logout

**Resultado obtenido:**
✅ **PRUEBA EXITOSA**
- ✅ Se mostró mensaje "Login exitoso" inmediatamente después del clic
- ✅ Token JWT recibido y validado: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (contiene rol "ADMIN")
- ✅ Redirección exitosa a `/home-seller` en 1.2 segundos
- ✅ Token almacenado correctamente en LocalStorage con clave "authToken"
- ✅ Menú lateral muestra todas las opciones de ADMIN:
  - Inicio
  - Inventario
  - Clientes
  - Pedidos
  - Alquileres
  - **Reportes** ✓
  - **Usuarios** ✓
  - Cerrar Sesión
- ✅ Tiempo de respuesta: 1.2 segundos (cumple con < 2 seg)
- ✅ Sesión permanece activa al navegar entre secciones
- ✅ No hay errores en consola del navegador

**Observaciones:** La autenticación funcionó correctamente en el primer intento. El sistema validó las credenciales, generó el token JWT y otorgó permisos de administrador sin problemas.

**Estado:** ✅ APROBADO  
**Fecha de ejecución:** 03/03/2026  
**Ejecutor:** Equipo QA SENA

---

| | **<Código del CP>** | **¿Prueba de despliegue?** | **Sí/No** |
|-------|----------|----------|----------|
| **<Nombre caso prueba>** | **CP-AUTH-002** | | **No** |

**Descripción:**  
Verificar que un usuario vendedor pueda iniciar sesión exitosamente con credenciales válidas, recibir un token JWT y acceder al dashboard con permisos limitados de vendedor (sin acceso a Reportes ni Usuarios).

**Prerrequisitos:**
- Sistema backend en ejecución
- Usuario vendedor existe en BD: `vendedor@ejemplo.com` / `vendedor123`
- Base de datos configurada y accesible
- Frontend web corriendo en `http://localhost:5174`

**Pasos:**
1. Abrir navegador en `http://localhost:5174/login-seller`
2. Ingresar correo electrónico en campo "Email": `vendedor@ejemplo.com`
3. Ingresar contraseña en campo "Password": `vendedor123`
4. Hacer clic en botón "Ingresar"
5. Verificar opciones de menú disponibles

**Resultado esperado:**
- Se muestra mensaje "Login exitoso"
- Se recibe token JWT válido conteniendo rol "VENDEDOR"
- Se redirige a `/home-seller`
- Token se almacena en LocalStorage
- Menú NO muestra opciones de ADMIN (sin Reportes ni Usuarios)
- Usuario solo puede acceder a funcionalidades permitidas para VENDEDOR
- Tiempo de respuesta menor a 2 segundos

**Resultado obtenido:**
<Resultado obtenido de la ejecución del caso de prueba>

---

| | **<Código del CP>** | **¿Prueba de despliegue?** | **Sí/No** |
|-------|----------|----------|----------|
| **<Nombre caso prueba>** | **CP-AUTH-003** | | **No** |

**Descripción:**  
Verificar que el sistema rechace intentos de inicio de sesión con credenciales inválidas (contraseña incorrecta), mostrando un mensaje de error apropiado sin exponer información sensible.

**Prerrequisitos:**
- Sistema backend en ejecución
- Base de datos configurada y accesible
- Frontend web corriendo en `http://localhost:5174`

**Pasos:**
1. Abrir navegador en `http://localhost:5174/login-seller`
2. Ingresar correo electrónico válido: `admin@ejemplo.com`
3. Ingresar contraseña incorrecta: `contraseñaIncorrecta123`
4. Hacer clic en botón "Ingresar"
5. Observar mensaje de error y comportamiento del sistema

**Resultado esperado:**
- Se muestra mensaje "Credenciales inválidas" (sin especificar qué dato es incorrecto)
- NO se recibe token JWT
- Usuario permanece en página de login
- No se almacena información de sesión en LocalStorage
- No se expone información sobre qué campo específico es incorrecto (seguridad)

**Resultado obtenido:**
<Resultado obtenido de la ejecución del caso de prueba>

---

| | **<Código del CP>** | **¿Prueba de despliegue?** | **Sí/No** |
|-------|----------|----------|----------|
| **<Nombre caso prueba>** | **CP-AUTH-004** | | **No** |

**Descripción:**  
Verificar que el sistema valide el formato del correo electrónico en el formulario de login, previniendo el envío de datos con formato de email inválido antes de hacer la petición al backend.

**Prerrequisitos:**
- Sistema frontend en ejecución
- Frontend web corriendo en `http://localhost:5174`

**Pasos:**
1. Abrir navegador en `http://localhost:5174/login-seller`
2. Ingresar email sin formato válido en campo "Email": `correoinvalido` (sin @)
3. Ingresar contraseña válida: `admin123`
4. Intentar hacer clic en botón "Ingresar"
5. Observar validación del formulario

**Resultado esperado:**
- Se muestra mensaje "Ingrese un email válido" cerca del campo email
- Botón "Ingresar" está deshabilitado o muestra error de validación
- NO se envía petición al backend
- Validación ocurre en tiempo real
- Mensaje claro sobre el formato esperado

**Resultado obtenido:**
<Resultado obtenido de la ejecución del caso de prueba>

---

| | **<Código del CP>** | **¿Prueba de despliegue?** | **Sí/No** |
|-------|----------|----------|----------|
| **<Nombre caso prueba>** | **CP-AUTH-005** | | **No** |

**Descripción:**  
Verificar que el sistema valide que los campos obligatorios de email y contraseña no estén vacíos antes de permitir el envío del formulario de login.

**Prerrequisitos:**
- Sistema frontend en ejecución
- Frontend web corriendo en `http://localhost:5174`

**Pasos:**
1. Abrir navegador en `http://localhost:5174/login-seller`
2. Dejar campo "Email" vacío
3. Dejar campo "Password" vacío
4. Intentar hacer clic en botón "Ingresar"
5. Observar mensajes de validación

**Resultado esperado:**
- Se muestran mensajes "Este campo es obligatorio" en ambos campos
- Botón "Ingresar" está deshabilitado o acción es prevenida
- NO se envía petición al backend
- Validación ocurre antes del envío de datos
- Mensajes de error claros para cada campo

**Resultado obtenido:**
<Resultado obtenido de la ejecución del caso de prueba>

---

| | **<Código del CP>** | **¿Prueba de despliegue?** | **Sí/No** |
|-------|----------|----------|----------|
| **<Nombre caso prueba>** | **CP-AUTH-006** | | **No** |

**Descripción:**  
Verificar que un usuario autenticado pueda cerrar sesión correctamente, eliminando el token de autenticación y siendo redirigido a la página de login, sin posibilidad de acceder a rutas protegidas posteriormente.

**Prerrequisitos:**
- Usuario autenticado (Admin o Vendedor) con sesión activa
- Token válido almacenado en LocalStorage
- Usuario navegando en cualquier pantalla del dashboard

**Pasos:**
1. Estar autenticado y navegando en cualquier pantalla del dashboard
2. Hacer clic en opción "Cerrar Sesión" en menú lateral
3. Confirmar acción (si aplica diálogo de confirmación)
4. Observar redirección
5. Intentar acceder a una ruta protegida usando el navegador

**Resultado esperado:**
- Token se elimina de LocalStorage/AsyncStorage completamente
- Se redirige inmediatamente a página de login
- Intentar acceder a rutas protegidas redirige automáticamente a login
- No se pueden hacer peticiones autenticadas con el token anterior
- Cierre de sesión es instantáneo
- Datos sensibles eliminados del almacenamiento local

**Resultado obtenido:**
<Resultado obtenido de la ejecución del caso de prueba>

---

| | **<Código del CP>** | **¿Prueba de despliegue?** | **Sí/No** |
|-------|----------|----------|----------|
| **<Nombre caso prueba>** | **CP-AUTH-007** | | **No** |

**Descripción:**  
Verificar que la sesión de un usuario autenticado persista después de cerrar y reabrir el navegador, permitiendo acceso directo al dashboard sin necesidad de volver a autenticarse mientras el token sea válido.

**Prerrequisitos:**
- Usuario ha iniciado sesión exitosamente
- Token almacenado en LocalStorage
- Token JWT no ha expirado

**Pasos:**
1. Iniciar sesión correctamente con credenciales válidas
2. Navegar a diferentes secciones del dashboard
3. Cerrar completamente el navegador (todas las ventanas/pestañas)
4. Reabrir navegador
5. Visitar la URL de la aplicación `http://localhost:5174`

**Resultado esperado:**
- Sesión permanece activa tras reabrir navegador
- Usuario NO necesita volver a autenticarse
- Token sigue siendo válido y funcional
- Se carga dashboard directamente sin pasar por login
- Persistencia de sesión mientras token sea válido
- Redirección automática al dashboard

**Resultado obtenido:**
<Resultado obtenido de la ejecución del caso de prueba>

---

| | **<Código del CP>** | **¿Prueba de despliegue?** | **Sí/No** |
|-------|----------|----------|----------|
| **<Nombre caso prueba>** | **CP-AUTH-008** | | **No** |

**Descripción:**  
Verificar que el sistema maneje correctamente la expiración del token JWT, detectando tokens expirados, mostrando un mensaje apropiado y redirigiendo al usuario a la página de login automáticamente.

**Prerrequisitos:**
- Usuario autenticado con sesión activa
- Token JWT ha alcanzado su tiempo de expiración (según configuración del backend)
- Usuario intenta realizar una acción protegida después de la expiración

**Pasos:**
1. Iniciar sesión con credenciales válidas
2. Esperar el tiempo de expiración del token (según configuración JWT del backend)
3. Intentar realizar cualquier acción protegida (navegar, crear artículo, etc.)
4. Observar respuesta del sistema

**Resultado esperado:**
- Se recibe error 401 Unauthorized del backend
- Se muestra mensaje "Sesión expirada" al usuario
- Se redirige automáticamente a página de login
- Token se elimina del almacenamiento local
- Manejo graceful de expiración sin errores visibles críticos
- Usuario es informado claramente de lo sucedido

**Resultado obtenido:**
<Resultado obtenido de la ejecución del caso de prueba>

---

| | **<Código del CP>** | **¿Prueba de despliegue?** | **Sí/No** |
|-------|----------|----------|----------|
| **<Nombre caso prueba>** | **CP-AUTH-009** | | **No** |

**Descripción:**  
Verificar que el sistema bloquee el acceso a rutas protegidas cuando un usuario no autenticado intenta acceder directamente mediante URL, redirigiendo automáticamente a la página de login.

**Prerrequisitos:**
- Usuario NO autenticado (sin sesión activa)
- No existe token en LocalStorage
- Navegador limpio o sesión previamente cerrada

**Pasos:**
1. Abrir navegador sin sesión activa
2. Intentar acceder directamente a ruta protegida escribiendo en la barra de direcciones: `http://localhost:5174/home-seller/inventory`
3. Presionar Enter
4. Observar comportamiento del sistema

**Resultado esperado:**
- Se bloquea el acceso a la ruta protegida
- Se redirige automáticamente a `/login-seller`
- NO se carga contenido protegido en ningún momento
- Protección activa en todas las rutas privadas del sistema
- Redirección automática sin mostrar error visible al usuario
- No se expone información sensible

**Resultado obtenido:**
<Resultado obtenido de la ejecución del caso de prueba>

---

| | **<Código del CP>** | **¿Prueba de despliegue?** | **Sí/No** |
|-------|----------|----------|----------|
| **<Nombre caso prueba>** | **CP-AUTH-010** | | **No** |

**Descripción:**  
Verificar que un usuario con rol ADMIN pueda acceder a la funcionalidad de Reportes, validando que el control de acceso basado en roles funcione correctamente para permisos administrativos.

**Prerrequisitos:**
- Usuario ADMIN autenticado: `admin@ejemplo.com` / `admin123`
- Sesión activa con token válido conteniendo rol "ADMIN"
- Navegando en el dashboard

**Pasos:**
1. Iniciar sesión como admin@ejemplo.com con contraseña admin123
2. Navegar al menú lateral del dashboard
3. Localizar opción "Reportes" en el menú
4. Hacer clic en "Reportes"
5. Observar carga de la pantalla y verificar acceso

**Resultado esperado:**
- Se muestra pantalla de reportes correctamente
- Usuario puede ver todos los reportes disponibles
- Usuario puede generar reportes sin restricciones
- Peticiones al backend son exitosas (código 200 OK)
- Rol ADMIN tiene acceso completo a funcionalidad de reportes
- No se muestran errores de permisos

**Resultado obtenido:**
<Resultado obtenido de la ejecución del caso de prueba>

---

| | **<Código del CP>** | **¿Prueba de despliegue?** | **Sí/No** |
|-------|----------|----------|----------|
| **<Nombre caso prueba>** | **CP-AUTH-011** | | **No** |

**Descripción:**  
Verificar que un usuario con rol VENDEDOR NO pueda acceder a la funcionalidad de Reportes, validando que el control de acceso basado en roles restrinja correctamente los permisos según el rol del usuario.

**Prerrequisitos:**
- Usuario VENDEDOR autenticado: `vendedor@ejemplo.com` / `vendedor123`
- Sesión activa con token válido conteniendo rol "VENDEDOR"
- Navegando en el dashboard

**Pasos:**
1. Iniciar sesión como vendedor@ejemplo.com con contraseña vendedor123
2. Navegar al menú lateral del dashboard
3. Verificar si opción "Reportes" está visible en el menú
4. Intentar acceder directamente mediante URL (si es posible): `http://localhost:5174/home-seller/reports`
5. Observar respuesta del sistema

**Resultado esperado:**
- Opción "Reportes" NO aparece en menú lateral
- Si se intenta acceder por URL directa, se bloquea el acceso (error 403 Forbidden o redirección)
- Se muestra mensaje "No tiene permisos suficientes" o similar
- Control de acceso por roles funciona correctamente en frontend y backend
- Backend valida roles en cada petición protegida
- Usuario vendedor no puede evadir restricciones

**Resultado obtenido:**
<Resultado obtenido de la ejecución del caso de prueba>

---

---

### CP-AUTH-001: Login exitoso con usuario Administrador
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Sistema backend en ejecución
- Usuario administrador existe en BD: `admin@ejemplo.com` / `admin123`

**Datos de Entrada:**
- Correo electrónico: `admin@ejemplo.com`
- Contraseña: `admin123`

**Pasos:**
1. Abrir navegador en `http://localhost:5174/login-seller`
2. Ingresar correo electrónico en campo "Email"
3. Ingresar contraseña en campo "Password"
4. Hacer clic en botón "Ingresar"

**Resultado Esperado:**
- ✅ Se muestra mensaje "Login exitoso"
- ✅ Se recibe token JWT válido
- ✅ Se redirige a `/home-seller`
- ✅ Token se almacena en LocalStorage/AsyncStorage
- ✅ Menú muestra opciones de ADMIN (incluye Reportes y Usuarios)

**Criterios de Aceptación:**
- Tiempo de respuesta < 2 segundos
- Token JWT contiene rol "ADMIN"
- Sesión permanece activa hasta logout

---

### CP-AUTH-002: Login exitoso con usuario Vendedor
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Sistema backend en ejecución
- Usuario vendedor existe en BD: `vendedor@ejemplo.com` / `vendedor123`

**Datos de Entrada:**
- Correo electrónico: `vendedor@ejemplo.com`
- Contraseña: `vendedor123`

**Pasos:**
1. Abrir navegador en `http://localhost:5174/login-seller`
2. Ingresar correo electrónico en campo "Email"
3. Ingresar contraseña en campo "Password"
4. Hacer clic en botón "Ingresar"

**Resultado Esperado:**
- ✅ Se muestra mensaje "Login exitoso"
- ✅ Se recibe token JWT válido
- ✅ Se redirige a `/home-seller`
- ✅ Token se almacena
- ✅ Menú NO muestra opciones de ADMIN (sin Reportes ni Usuarios)

**Criterios de Aceptación:**
- Usuario solo puede acceder a funcionalidades permitidas para VENDEDOR
- Token JWT contiene rol "VENDEDOR"

---

### CP-AUTH-003: Login fallido - Credenciales inválidas
**Prioridad:** P1 - Alta  
**Tipo:** Funcional - Negativa

**Precondiciones:**
- Sistema backend en ejecución

**Datos de Entrada:**
- Correo electrónico: `admin@ejemplo.com`
- Contraseña: `contraseñaIncorrecta123`

**Pasos:**
1. Abrir navegador en `http://localhost:5174/login-seller`
2. Ingresar correo electrónico válido
3. Ingresar contraseña incorrecta
4. Hacer clic en botón "Ingresar"

**Resultado Esperado:**
- ❌ Se muestra mensaje "Credenciales inválidas"
- ❌ NO se recibe token
- ❌ Usuario permanece en página de login
- ❌ No se almacena información de sesión

**Criterios de Aceptación:**
- Mensaje de error claro y específico
- No se expone información sobre qué dato es incorrecto (seguridad)

---

### CP-AUTH-004: Login - Validación de email inválido
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Sistema frontend en ejecución

**Datos de Entrada:**
- Correo electrónico: `correoinvalido` (sin @)
- Contraseña: `admin123`

**Pasos:**
1. Abrir navegador en login
2. Ingresar email sin formato válido
3. Intentar hacer clic en "Ingresar"

**Resultado Esperado:**
- ⚠️ Se muestra mensaje "Ingrese un email válido"
- ⚠️ Botón "Ingresar" deshabilitado o muestra error de validación
- ❌ No se envía petición al backend

**Criterios de Aceptación:**
- Validación en tiempo real
- Mensaje claro sobre el formato esperado

---

### CP-AUTH-005: Login - Campos vacíos
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Sistema frontend en ejecución

**Datos de Entrada:**
- Correo electrónico: `` (vacío)
- Contraseña: `` (vacío)

**Pasos:**
1. Abrir navegador en login
2. Dejar campos vacíos
3. Intentar hacer clic en "Ingresar"

**Resultado Esperado:**
- ⚠️ Se muestran mensajes "Este campo es obligatorio"
- ⚠️ Botón "Ingresar" deshabilitado o prevenido
- ❌ No se envía petición al backend

**Criterios de Aceptación:**
- Validación ocurre antes del envío
- Mensajes de error claros

---

### CP-AUTH-006: Logout - Cerrar sesión
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario autenticado (Admin o Vendedor)
- Sesión activa con token válido

**Pasos:**
1. Estar en cualquier pantalla del dashboard
2. Hacer clic en opción "Cerrar Sesión" en menú lateral
3. Confirmar acción (si aplica)

**Resultado Esperado:**
- ✅ Token se elimina de LocalStorage/AsyncStorage
- ✅ Se redirige a página de login
- ✅ Intentar acceder a rutas protegidas redirige a login
- ✅ No se pueden hacer peticiones con el token anterior

**Criterios de Aceptación:**
- Cierre de sesión instantáneo
- Datos sensibles eliminados del almacenamiento local

---

### CP-AUTH-007: Persistencia de sesión
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Usuario ha iniciado sesión exitosamente
- Token almacenado en LocalStorage

**Pasos:**
1. Iniciar sesión correctamente
2. Navegar a diferentes secciones
3. Cerrar el navegador
4. Reabrir navegador y visitar la aplicación

**Resultado Esperado:**
- ✅ Sesión permanece activa
- ✅ Usuario NO necesita volver a autenticarse
- ✅ Token sigue siendo válido
- ✅ Se carga dashboard directamente

**Criterios de Aceptación:**
- Persistencia de sesión mientras token sea válido
- Redirección automática al dashboard

---

### CP-AUTH-008: Token expirado
**Prioridad:** P1 - Alta  
**Tipo:** Funcional - Seguridad

**Precondiciones:**
- Usuario autenticado
- Token JWT ha expirado

**Pasos:**
1. Esperar el tiempo de expiración del token (según configuración)
2. Intentar realizar cualquier acción protegida

**Resultado Esperado:**
- ❌ Se recibe error 401 Unauthorized
- ✅ Se muestra mensaje "Sesión expirada"
- ✅ Se redirige automáticamente a login
- ✅ Token se elimina del almacenamiento

**Criterios de Aceptación:**
- Manejo graceful de expiración
- Usuario informado claramente

---

### CP-AUTH-009: Acceso a ruta protegida sin autenticación
**Prioridad:** P1 - Alta  
**Tipo:** Seguridad

**Precondiciones:**
- Usuario NO autenticado
- No existe token en LocalStorage

**Pasos:**
1. Abrir navegador sin sesión activa
2. Intentar acceder directamente a: `http://localhost:5174/home-seller/inventory`

**Resultado Esperado:**
- ❌ Se bloquea el acceso
- ✅ Se redirige automáticamente a `/login-seller`
- ❌ No se carga contenido protegido

**Criterios de Aceptación:**
- Protección de todas las rutas privadas
- Redirección automática sin error visible al usuario

---

### CP-AUTH-010: Validación de roles - Admin accede a Reportes
**Prioridad:** P1 - Alta  
**Tipo:** Seguridad - Autorización

**Precondiciones:**
- Usuario ADMIN autenticado

**Pasos:**
1. Iniciar sesión como admin@ejemplo.com
2. Navegar a menú lateral
3. Hacer clic en "Reportes"

**Resultado Esperado:**
- ✅ Se muestra pantalla de reportes
- ✅ Usuario puede ver y generar reportes
- ✅ Peticiones al backend son exitosas

**Criterios de Aceptación:**
- Rol ADMIN tiene acceso completo a reportes

---

### CP-AUTH-011: Validación de roles - Vendedor NO accede a Reportes
**Prioridad:** P1 - Alta  
**Tipo:** Seguridad - Autorización

**Precondiciones:**
- Usuario VENDEDOR autenticado

**Pasos:**
1. Iniciar sesión como vendedor@ejemplo.com
2. Verificar menú lateral
3. Intentar acceder directamente a URL de reportes (si aplica)

**Resultado Esperado:**
- ❌ Opción "Reportes" NO aparece en menú
- ❌ Si se accede por URL, se bloquea acceso (403 Forbidden)
- ✅ Se muestra mensaje "No tiene permisos"

**Criterios de Aceptación:**
- Control de acceso por roles funcionando correctamente
- Backend valida roles en cada petición

---

---

## 📦 RF-02: MÓDULO DE GESTIÓN DE ARTÍCULOS (INVENTARIO)

### Requerimiento Funcional:
El sistema debe permitir crear, consultar, actualizar y eliminar artículos del inventario, incluyendo la gestión de imágenes y categorías.

---

### CP-ART-001: Crear artículo sin foto
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario autenticado (Admin o Vendedor)
- Al menos una categoría existe en el sistema
- Navegando en `/home-seller/inventory`

**Datos de Entrada:**
- Nombre: "Vestido Rojo Elegante"
- Categoría: "Vestidos" (ID: 1)
- Género: "Mujer"
- Talla: "M"
- Color: "Rojo"
- Precio: 50000

**Pasos:**
1. Hacer clic en botón "Agregar Artículo"
2. Completar todos los campos del formulario
3. NO seleccionar foto
4. Hacer clic en "Guardar"

**Resultado Esperado:**
- ✅ Se muestra mensaje "Artículo creado con éxito"
- ✅ Artículo aparece en lista de inventario
- ✅ Artículo tiene imagen por defecto o placeholder
- ✅ Estado del artículo es "Activo"

**Criterios de Aceptación:**
- Artículo se guarda en BD con todos los datos
- ID único se genera automáticamente
- Campo `activo` = true por defecto

---

### CP-ART-002: Crear artículo con foto
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario autenticado
- Navegando en `/home-seller/inventory`

**Datos de Entrada:**
- Nombre: "Zapatos Negro Formal"
- Categoría: "Calzado" (ID: 2)
- Género: "Hombre"
- Talla: "42"
- Color: "Negro"
- Precio: 30000
- Foto: `zapato-negro.jpg` (formato JPG, tamaño < 5MB)

**Pasos:**
1. Hacer clic en botón "Agregar Artículo"
2. Completar todos los campos
3. Hacer clic en "Seleccionar foto"
4. Seleccionar archivo desde sistema
5. Verificar preview de imagen
6. Hacer clic en "Guardar"

**Resultado Esperado:**
- ✅ Se muestra mensaje "Artículo creado con éxito"
- ✅ Imagen se sube al servidor en `/uploads/articulos/`
- ✅ Artículo muestra la imagen seleccionada
- ✅ La URL de la imagen se guarda correctamente en BD

**Criterios de Aceptación:**
- Imagen se almacena físicamente en servidor
- Formato de imagen es válido (JPG, PNG, WEBP)
- Ruta de imagen es accesible vía HTTP

---

### CP-ART-003: Crear artículo - Validación de campos obligatorios
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Usuario autenticado
- Navegando en formulario de crear artículo

**Datos de Entrada:**
- Nombre: `` (vacío)
- Categoría: No seleccionada
- Precio: `` (vacío)

**Pasos:**
1. Hacer clic en botón "Agregar Artículo"
2. Dejar campos obligatorios vacíos
3. Intentar hacer clic en "Guardar"

**Resultado Esperado:**
- ⚠️ Se muestran mensajes de validación en campos obligatorios:
  - "El nombre es obligatorio"
  - "Debe seleccionar una categoría"
  - "El precio es obligatorio"
- ❌ No se envía petición al backend
- ❌ Formulario no se cierra

**Criterios de Aceptación:**
- Validación en frontend antes de envío
- Mensajes claros por cada campo

---

### CP-ART-004: Crear artículo - Precio negativo
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Usuario autenticado
- Navegando en formulario de crear artículo

**Datos de Entrada:**
- Nombre: "Artículo Test"
- Categoría: Seleccionada
- Precio: -1000 (negativo)

**Pasos:**
1. Completar formulario con precio negativo
2. Intentar guardar

**Resultado Esperado:**
- ⚠️ Se muestra mensaje "El precio debe ser mayor a 0"
- ❌ No se permite guardar

**Criterios de Aceptación:**
- Validación de precios positivos

---

### CP-ART-005: Listar todos los artículos
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario autenticado
- Existen artículos en la base de datos
- Navegando en `/home-seller/inventory`

**Pasos:**
1. Cargar página de inventario
2. Observar lista de artículos

**Resultado Esperado:**
- ✅ Se muestra lista completa de artículos
- ✅ Cada artículo muestra:
  - Imagen (o placeholder)
  - Nombre
  - Categoría
  - Precio
  - Talla, Color, Género
  - Botones de acción (Editar, Eliminar)
- ✅ Artículos activos se muestran primero

**Criterios de Aceptación:**
- Carga de datos < 3 segundos
- Paginación si hay más de 20 artículos (opcional)
- Datos coinciden con BD

---

### CP-ART-006: Buscar artículo por nombre
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Usuario autenticado
- Existen artículos en el sistema
- Navegando en `/home-seller/inventory`

**Datos de Entrada:**
- Búsqueda: "Vestido"

**Pasos:**
1. Escribir "Vestido" en barra de búsqueda
2. Observar resultados filtrados

**Resultado Esperado:**
- ✅ Se muestran solo artículos que contengan "Vestido" en el nombre
- ✅ Filtrado ocurre en tiempo real mientras se escribe
- ✅ Si no hay resultados, se muestra mensaje "No se encontraron artículos"

**Criterios de Aceptación:**
- Búsqueda case-insensitive
- Resultados inmediatos

---

### CP-ART-007: Filtrar artículos por categoría
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Usuario autenticado
- Existen artículos de diferentes categorías
- Navegando en `/home-seller/inventory`

**Pasos:**
1. Hacer clic en chip/botón de categoría "Vestidos"
2. Observar resultados

**Resultado Esperado:**
- ✅ Se muestran solo artículos de categoría "Vestidos"
- ✅ Otros artículos se ocultan
- ✅ Chip de categoría seleccionada se muestra resaltado
- ✅ Clic nuevamente en chip quita el filtro

**Criterios de Aceptación:**
- Filtrado visual inmediato
- Posibilidad de quitar filtro

---

### CP-ART-008: Consultar artículo por ID
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Artículo con ID 1 existe en BD
- Usuario autenticado

**Datos de Entrada:**
- ID artículo: 1

**Pasos:**
1. Hacer petición GET a `/api/articulos/ConsultarById/1`
2. O hacer clic en un artículo específico para ver detalles

**Resultado Esperado:**
- ✅ Se retorna artículo con ID 1
- ✅ Contiene todos los campos: nombre, categoría, precio, etc.
- ✅ Imagen URL es válida

**Criterios de Aceptación:**
- Respuesta JSON con estructura correcta
- Código de estado 200 OK

---

### CP-ART-009: Consultar artículo inexistente
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Negativa

**Precondiciones:**
- ID 9999 NO existe en BD

**Datos de Entrada:**
- ID artículo: 9999

**Pasos:**
1. Hacer petición GET a `/api/articulos/ConsultarById/9999`

**Resultado Esperado:**
- ❌ Se retorna código 404 Not Found
- ❌ Mensaje: "Artículo no encontrado"

**Criterios de Aceptación:**
- Manejo correcto de errores
- Respuesta clara

---

### CP-ART-010: Actualizar artículo sin cambiar foto
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Artículo con ID 1 existe
- Usuario autenticado

**Datos de Entrada:**
- ID: 1
- Nuevo precio: 55000 (antes era 50000)
- Otros campos sin cambios

**Pasos:**
1. Navegar a inventario
2. Hacer clic en botón "Editar" (✏️) del artículo
3. Modificar precio a 55000
4. Hacer clic en "Actualizar"

**Resultado Esperado:**
- ✅ Se muestra mensaje "Artículo actualizado"
- ✅ Precio se actualiza en BD
- ✅ Imagen permanece igual (no se elimina)
- ✅ Lista se refresca mostrando nuevo precio

**Criterios de Aceptación:**
- Actualización parcial de campos funciona
- No se afectan campos no modificados

---

### CP-ART-011: Actualizar artículo cambiando foto
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Artículo con ID 1 existe con foto antigua
- Usuario autenticado

**Datos de Entrada:**
- ID: 1
- Nueva foto: `nueva-imagen.jpg`

**Pasos:**
1. Hacer clic en "Editar"
2. Hacer clic en "Cambiar foto"
3. Seleccionar nueva imagen
4. Hacer clic en "Actualizar"

**Resultado Esperado:**
- ✅ Se muestra mensaje "Artículo actualizado"
- ✅ Foto antigua se elimina del servidor (opcional)
- ✅ Nueva foto se sube correctamente
- ✅ Artículo muestra la nueva imagen

**Criterios de Aceptación:**
- Nueva imagen se almacena correctamente
- URL de imagen se actualiza en BD

---

### CP-ART-012: Eliminar artículo (soft delete)
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Artículo con ID 1 existe y está activo
- Usuario ADMIN autenticado
- Artículo NO está en un alquiler activo

**Pasos:**
1. Navegar a inventario
2. Hacer clic en botón "Eliminar" (🗑️)
3. Confirmar eliminación en diálogo

**Resultado Esperado:**
- ✅ Se muestra mensaje "Artículo eliminado"
- ✅ Campo `activo` cambia a `false` en BD
- ✅ Artículo ya no aparece en lista principal (si se filtra por activos)
- ❌ Registro NO se elimina físicamente de BD

**Criterios de Aceptación:**
- Soft delete implementado
- Datos históricos se mantienen
- Posibilidad de reactivar después

---

### CP-ART-013: Eliminar artículo sin permisos (Vendedor)
**Prioridad:** P1 - Alta  
**Tipo:** Seguridad - Autorización

**Precondiciones:**
- Usuario VENDEDOR autenticado
- Artículo existe

**Pasos:**
1. Intentar hacer petición DELETE como vendedor
2. O verificar que botón "Eliminar" no esté visible

**Resultado Esperado:**
- ❌ Botón "Eliminar" NO visible o deshabilitado para vendedor
- ❌ Si intenta petición directa: error 403 Forbidden
- ⚠️ Mensaje: "No tiene permisos para esta acción"

**Criterios de Aceptación:**
- Solo ADMIN puede eliminar
- Backend valida roles

---

### CP-ART-014: Activar artículo desactivado
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Artículo con ID 1 existe con `activo = false`
- Usuario ADMIN autenticado

**Pasos:**
1. Navegar a lista de artículos inactivos
2. Hacer clic en "Activar"

**Resultado Esperado:**
- ✅ Campo `activo` cambia a `true`
- ✅ Artículo vuelve a aparecer en lista principal
- ✅ Artículo disponible para alquileres

**Criterios de Aceptación:**
- Reactivación funcional
- Estado se refleja inmediatamente

---

### CP-ART-015: Verificar disponibilidad de artículo
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Artículo con ID 1 existe
- Artículo está o no en alquiler activo

**Pasos:**
1. Hacer petición GET a `/api/articulos/verificarDisponibilidad/1`

**Resultado Esperado:**
- ✅ Se retorna estado de disponibilidad: `true` o `false`
- ✅ Si está en alquiler: `disponible = false`
- ✅ Si no está en alquiler: `disponible = true`

**Criterios de Aceptación:**
- Verificación en tiempo real
- Considera solo alquileres activos (no devueltos)

---

### CP-ART-016: Crear artículo con foto de formato inválido
**Prioridad:** P3 - Baja  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Usuario autenticado

**Datos de Entrada:**
- Foto: `documento.pdf` (formato no permitido)

**Pasos:**
1. Intentar subir archivo PDF como foto de artículo

**Resultado Esperado:**
- ⚠️ Se muestra mensaje "Formato de archivo no permitido. Use JPG, PNG o WEBP"
- ❌ No se permite seleccionar el archivo

**Criterios de Aceptación:**
- Validación de formatos de imagen
- Mensajes claros

---

### CP-ART-017: Crear artículo con foto muy grande
**Prioridad:** P3 - Baja  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Usuario autenticado

**Datos de Entrada:**
- Foto: `imagen-grande.jpg` (tamaño > 5MB)

**Pasos:**
1. Intentar subir imagen muy pesada

**Resultado Esperado:**
- ⚠️ Mensaje "El archivo es demasiado grande. Máximo 5MB"
- ❌ No se permite subir

**Criterios de Aceptación:**
- Límite de tamaño configurado
- Validación antes de envío

---

---

## 👥 RF-03: MÓDULO DE GESTIÓN DE CLIENTES

### Requerimiento Funcional:
El sistema debe permitir registrar, consultar, actualizar y gestionar información de clientes que alquilan artículos.

---

### CP-CLI-001: Registrar nuevo cliente con datos completos
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario autenticado (Admin o Vendedor)
- Tipos de documento y barrios cargados en BD
- Navegando en `/home-seller/new-client`

**Datos de Entrada:**
- Tipo documento: "Cédula de Ciudadanía" (ID: 1)
- Número documento: 1234567890
- Primer nombre: "Juan"
- Segundo nombre: "Carlos"
- Primer apellido: "Pérez"
- Segundo apellido: "Gómez"
- Email: "juan.perez@email.com"
- Teléfono: 3001234567
- Dirección: "Calle 123 #45-67"
- Barrio: "Centro" (ID: 1)

**Pasos:**
1. Hacer clic en "Nuevo Cliente" en menú
2. Completar todos los campos del formulario
3. Hacer clic en "Registrar Cliente"

**Resultado Esperado:**
- ✅ Se muestra mensaje "Cliente creado exitosamente"
- ✅ Cliente se guarda en BD con estado `activo = true`
- ✅ Se genera ID único automáticamente
- ✅ Se redirige a lista de clientes o formulario se limpia

**Criterios de Aceptación:**
- Todos los datos se guardan correctamente
- Cliente aparece en lista de clientes
- Puede ser seleccionado en alquileres

---

### CP-CLI-002: Registrar cliente con datos mínimos
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario autenticado

**Datos de Entrada:**
- Tipo documento: "Cédula" (ID: 1)
- Número documento: 9876543210
- Primer nombre: "María"
- Primer apellido: "López"
- Email: "maria@email.com"
- Teléfono: 3109876543
- Dirección: "Calle 1 #2-3"
- Barrio: "Norte" (ID: 2)
- (Campos opcionales vacíos: segundo nombre, segundo apellido)

**Pasos:**
1. Completar solo campos obligatorios
2. Hacer clic en "Registrar Cliente"

**Resultado Esperado:**
- ✅ Cliente se crea exitosamente
- ✅ Campos opcionales quedan como NULL o vacíos
- ✅ No hay errores de validación

**Criterios de Aceptación:**
- Campos opcionales verdaderamente opcionales
- Sistema funciona con datos mínimos

---

### CP-CLI-003: Registrar cliente - Documento duplicado
**Prioridad:** P1 - Alta  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Cliente con documento 1234567890 ya existe en BD
- Usuario autenticado

**Datos de Entrada:**
- Número documento: 1234567890 (duplicado)
- Otros campos: válidos

**Pasos:**
1. Intentar registrar cliente con documento existente
2. Hacer clic en "Registrar"

**Resultado Esperado:**
- ❌ Se rechaza la creación
- ⚠️ Mensaje: "Ya existe un cliente con este número de documento"
- ❌ No se crea registro duplicado

**Criterios de Aceptación:**
- Validación de unicidad en documento
- Backend retorna error claro

---

### CP-CLI-004: Registrar cliente - Email inválido
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Usuario autenticado

**Datos de Entrada:**
- Email: "correo-invalido" (sin @)

**Pasos:**
1. Ingresar email sin formato válido
2. Intentar guardar

**Resultado Esperado:**
- ⚠️ Mensaje: "Ingrese un email válido"
- ❌ No se permite guardar
- ⚠️ Campo marcado con error

**Criterios de Aceptación:**
- Validación de formato de email
- Frontend y backend validan

---

### CP-CLI-005: Registrar cliente - Teléfono inválido
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Usuario autenticado

**Datos de Entrada:**
- Teléfono: 123 (menos de 10 dígitos)

**Pasos:**
1. Ingresar teléfono con formato inválido
2. Intentar guardar

**Resultado Esperado:**
- ⚠️ Mensaje: "El teléfono debe tener 10 dígitos"
- ❌ No se permite guardar

**Criterios de Aceptación:**
- Validación de longitud de teléfono
- Solo números permitidos

---

### CP-CLI-006: Listar todos los clientes
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario autenticado
- Existen clientes en BD
- Navegando en `/home-seller/clients`

**Pasos:**
1. Cargar página de clientes
2. Observar lista

**Resultado Esperado:**
- ✅ Se muestran todos los clientes activos
- ✅ Cada cliente muestra:
  - Nombre completo
  - Documento
  - Email
  - Teléfono
  - Dirección
  - Barrio
  - Botones de acción (Editar, Eliminar/Desactivar)
- ✅ Carga < 3 segundos

**Criterios de Aceptación:**
- Lista ordenada (por nombre o ID)
- Datos correctos

---

### CP-CLI-007: Buscar cliente por documento
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Cliente con documento 1234567890 existe
- Usuario autenticado

**Datos de Entrada:**
- Búsqueda: 1234567890

**Pasos:**
1. En pantalla de crear alquiler o lista de clientes
2. Escribir documento en campo de búsqueda
3. Hacer clic en "Buscar"

**Resultado Esperado:**
- ✅ Se encuentra el cliente
- ✅ Se muestran sus datos completos
- ✅ Si es para alquiler, datos se precargan

**Criterios de Aceptación:**
- Búsqueda exacta por documento
- Tiempo de respuesta < 1 segundo

---

### CP-CLI-008: Buscar cliente inexistente
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Negativa

**Precondiciones:**
- Documento 9999999999 NO existe

**Datos de Entrada:**
- Búsqueda: 9999999999

**Pasos:**
1. Buscar cliente por documento inexistente

**Resultado Esperado:**
- ❌ Mensaje: "Cliente no encontrado"
- ✅ Opción de "Registrar nuevo cliente" se ofrece
- ❌ No se cargan datos

**Criterios de Aceptación:**
- Mensaje claro
- Facilita creación de nuevo cliente

---

### CP-CLI-009: Buscar cliente por nombre
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Clientes existen en BD
- Usuario en pantalla de clientes

**Datos de Entrada:**
- Búsqueda: "Juan"

**Pasos:**
1. Escribir "Juan" en barra de búsqueda
2. Observar resultados

**Resultado Esperado:**
- ✅ Se muestran todos los clientes con "Juan" en primer o segundo nombre
- ✅ Búsqueda case-insensitive
- ✅ Filtrado en tiempo real

**Criterios de Aceptación:**
- Búsqueda parcial funciona
- Resultados inmediatos

---

### CP-CLI-010: Actualizar información de cliente
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Cliente con ID 1 existe
- Usuario autenticado

**Datos de Entrada:**
- ID: 1
- Nuevo teléfono: 3201234567
- Nueva dirección: "Nueva dirección 456"

**Pasos:**
1. En lista de clientes, hacer clic en "Editar" (✏️)
2. Modificar teléfono y dirección
3. Hacer clic en "Actualizar"

**Resultado Esperado:**
- ✅ Mensaje "Cliente actualizado"
- ✅ Cambios se guardan en BD
- ✅ Lista se refresca con nuevos datos

**Criterios de Aceptación:**
- Actualización parcial funciona
- No se permite cambiar documento (clave primaria)

---

### CP-CLI-011: Desactivar cliente
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Cliente con ID 1 existe y está activo
- Usuario ADMIN autenticado

**Pasos:**
1. Hacer clic en "Desactivar" o "Eliminar"
2. Confirmar acción

**Resultado Esperado:**
- ✅ Campo `activo` cambia a `false`
- ✅ Cliente no aparece en lista de clientes activos
- ✅ No se puede seleccionar en nuevos alquileres
- ❌ Registro NO se elimina físicamente

**Criterios de Aceptación:**
- Soft delete implementado
- Datos históricos conservados

---

### CP-CLI-012: Activar cliente desactivado
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Cliente con ID 1 existe con `activo = false`
- Usuario ADMIN autenticado

**Pasos:**
1. Navegar a lista de clientes inactivos
2. Hacer clic en "Activar"

**Resultado Esperado:**
- ✅ Campo `activo` cambia a `true`
- ✅ Cliente vuelve a lista de activos
- ✅ Puede ser seleccionado en alquileres

**Criterios de Aceptación:**
- Reactivación funcional

---

### CP-CLI-013: Validar campos obligatorios en creación
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Usuario en formulario de crear cliente

**Datos de Entrada:**
- Todos los campos vacíos o sin seleccionar

**Pasos:**
1. Intentar guardar sin completar campos obligatorios

**Resultado Esperado:**
- ⚠️ Mensajes de validación en cada campo obligatorio:
  - Tipo de documento
  - Número de documento
  - Primer nombre
  - Primer apellido
  - Email
  - Teléfono
  - Dirección
  - Barrio
- ❌ No se envía petición

**Criterios de Aceptación:**
- Validación frontend completa
- Mensajes claros

---

---

## 📋 RF-04: MÓDULO DE GESTIÓN DE ALQUILERES

### Requerimiento Funcional:
El sistema debe permitir crear, consultar y gestionar alquileres de artículos, incluyendo selección de cliente, fechas y artículos.

---

### CP-ALQ-001: Crear alquiler con un artículo
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario autenticado
- Cliente con documento 1234567890 existe
- Artículo con ID 1 disponible
- Navegando en `/home-seller/new-rent`

**Datos de Entrada:**
- Documento cliente: 1234567890
- Fecha alquiler: 03/03/2026
- Fecha entrega: 05/03/2026
- Fecha retiro: 07/03/2026
- Artículos seleccionados: [ID 1]
- Observaciones: "Cliente requiere ajustes"

**Pasos:**
1. Ingresar documento del cliente
2. Hacer clic en "Buscar"
3. Verificar datos del cliente cargados
4. Seleccionar fechas
5. Marcar checkbox del artículo deseado
6. Agregar observaciones
7. Hacer clic en "Crear Alquiler"

**Resultado Esperado:**
- ✅ Mensaje "Alquiler creado exitosamente"
- ✅ Se crea registro en tabla `alquiler`
- ✅ Se crea registro en tabla `alquiler_articulos` para el artículo
- ✅ Estado inicial del artículo en alquiler: "Por Entregar"
- ✅ Artículo queda marcado como no disponible
- ✅ Se genera ID único para el alquiler

**Criterios de Aceptación:**
- Transacción completa (alquiler + artículos)
- Datos coherentes entre tablas relacionadas

---

### CP-ALQ-002: Crear alquiler con múltiples artículos
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Cliente existe
- Artículos [ID 1, 2, 3] disponibles

**Datos de Entrada:**
- Documento cliente: 1234567890
- Fecha alquiler: 03/03/2026
- Fecha entrega: 05/03/2026
- Fecha retiro: 07/03/2026
- Artículos seleccionados: [ID 1, 2, 3] (3 artículos)

**Pasos:**
1. Buscar cliente
2. Seleccionar fechas
3. Marcar checkboxes de 3 artículos diferentes
4. Verificar cálculo de total (suma de precios)
5. Crear alquiler

**Resultado Esperado:**
- ✅ Alquiler se crea exitosamente
- ✅ Se crean 3 registros en `alquiler_articulos`
- ✅ Total del alquiler = suma de precios de los 3 artículos
- ✅ Los 3 artículos quedan no disponibles
- ✅ Cada artículo puede gestionarse individualmente (entregar/devolver)

**Criterios de Aceptación:**
- Relación muchos a muchos funcional
- Cálculo correcto del total

---

### CP-ALQ-003: Crear alquiler - Cliente no encontrado
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Negativa

**Precondiciones:**
- Documento 9999999999 NO existe

**Datos de Entrada:**
- Documento: 9999999999

**Pasos:**
1. Ingresar documento inexistente
2. Hacer clic en "Buscar"

**Resultado Esperado:**
- ❌ Mensaje "Cliente no encontrado"
- ✅ Botón "Registrar Nuevo Cliente" visible
- ❌ No se permite avanzar en creación de alquiler

**Criterios de Aceptación:**
- Validación antes de crear alquiler
- Opción de crear cliente directamente

---

### CP-ALQ-004: Crear alquiler - Sin artículos seleccionados
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Cliente encontrado
- Fechas seleccionadas
- Ningún artículo marcado

**Pasos:**
1. Completar todos los pasos excepto seleccionar artículos
2. Intentar crear alquiler

**Resultado Esperado:**
- ⚠️ Mensaje "Debe seleccionar al menos un artículo"
- ❌ No se permite crear alquiler

**Criterios de Aceptación:**
- Validación de artículos antes de envío

---

### CP-ALQ-005: Crear alquiler - Fechas inválidas
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Usuario en formulario de alquiler

**Datos de Entrada:**
- Fecha entrega: 05/03/2026
- Fecha retiro: 03/03/2026 (anterior a entrega)

**Pasos:**
1. Seleccionar fecha de retiro anterior a fecha de entrega
2. Intentar crear

**Resultado Esperado:**
- ⚠️ Mensaje "La fecha de retiro debe ser posterior a la fecha de entrega"
- ❌ No se permite crear

**Criterios de Aceptación:**
- Validación lógica de fechas
- Fechas realistas

---

### CP-ALQ-006: Crear alquiler - Artículo no disponible
**Prioridad:** P1 - Alta  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Artículo ID 1 ya está en otro alquiler activo (no devuelto)

**Pasos:**
1. Intentar seleccionar artículo que ya está alquilado

**Resultado Esperado:**
- ⚠️ Artículo aparece como "No disponible" o deshabilitado
- ❌ No se puede seleccionar para nuevo alquiler
- ✅ Solo artículos disponibles son seleccionables

**Criterios de Aceptación:**
- Verificación de disponibilidad en tiempo real
- Prevención de doble alquiler

---

### CP-ALQ-007: Listar todos los alquileres
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario autenticado
- Existen alquileres en BD
- Navegando en `/home-seller/orders`

**Pasos:**
1. Cargar página de órdenes
2. Ver lista de alquileres

**Resultado Esperado:**
- ✅ Se muestran todos los alquileres
- ✅ Cada alquiler muestra:
  - Número de alquiler
  - Cliente (nombre y documento)
  - Fecha de alquiler
  - Fecha de entrega
  - Fecha de retiro
  - Lista de artículos
  - Total
  - Estado (Pendiente, Entregado, Devuelto)
  - Botones de acción

**Criterios de Aceptación:**
- Datos completos y correctos
- Carga eficiente

---

### CP-ALQ-008: Filtrar alquileres "Por Entregar"
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Existen alquileres con artículos pendientes de entrega
- Navegando en `/home-seller/orders`

**Pasos:**
1. Hacer clic en pestaña/tab "Por Entregar"
2. Observar resultados

**Resultado Esperado:**
- ✅ Se muestran solo alquileres con artículos en estado "Pendiente" (no entregados)
- ✅ Botón "Marcar como Entregado" visible
- ❌ No se muestran alquileres completamente entregados

**Criterios de Aceptación:**
- Filtrado correcto por estado
- Agrupación lógica

---

### CP-ALQ-009: Filtrar alquileres "Por Recibir"
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Existen alquileres con artículos entregados pero no devueltos
- Navegando en `/home-seller/orders`

**Pasos:**
1. Hacer clic en pestaña "Por Recibir"
2. Observar resultados

**Resultado Esperado:**
- ✅ Se muestran solo alquileres con artículos en estado "Entregado"
- ✅ Botón "Marcar como Devuelto" visible
- ❌ No se muestran alquileres completamente devueltos

**Criterios de Aceptación:**
- Filtrado correcto
- Estados claros

---

### CP-ALQ-010: Marcar artículo como entregado
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Alquiler ID 1 existe con artículo ID 1 en estado "Pendiente"
- Usuario autenticado

**Pasos:**
1. En pestaña "Por Entregar"
2. Localizar el alquiler
3. Hacer clic en "Marcar como Entregado" para artículo específico

**Resultado Esperado:**
- ✅ Estado del artículo cambia a "Entregado"
- ✅ Se registra fecha de entrega real
- ✅ Artículo se mueve de "Por Entregar" a "Por Recibir"
- ✅ Mensaje "Artículo entregado al cliente"

**Criterios de Aceptación:**
- Actualización de estado individual por artículo
- Fecha de entrega registrada

---

### CP-ALQ-011: Marcar artículo como devuelto
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Alquiler ID 1 con artículo ID 1 en estado "Entregado"
- Usuario autenticado

**Pasos:**
1. En pestaña "Por Recibir"
2. Localizar el alquiler con artículo entregado
3. Hacer clic en "Marcar como Devuelto"

**Resultado Esperado:**
- ✅ Estado del artículo cambia a "Devuelto"
- ✅ Se registra fecha de devolución real
- ✅ Artículo vuelve a estar disponible para nuevos alquileres
- ✅ Alquiler se marca como completado (si todos los artículos están devueltos)
- ✅ Mensaje "Alquiler completado"

**Criterios de Aceptación:**
- Artículo disponible nuevamente
- Alquiler finalizado correctamente

---

### CP-ALQ-012: Consultar alquiler por ID
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Alquiler con ID 1 existe

**Datos de Entrada:**
- ID alquiler: 1

**Pasos:**
1. Hacer petición GET a `/api/alquiler/ConsultarById/1`
2. O hacer clic en detalle de alquiler

**Resultado Esperado:**
- ✅ Se retorna información completa del alquiler:
  - Datos del cliente
  - Fechas
  - Lista de artículos con estados
  - Total
  - Observaciones

**Criterios de Aceptación:**
- JSON completo con relaciones
- Datos correctos

---

### CP-ALQ-013: Actualizar observaciones de alquiler
**Prioridad:** P3 - Baja  
**Tipo:** Funcional

**Precondiciones:**
- Alquiler ID 1 existe

**Datos de Entrada:**
- Nuevas observaciones: "Cliente retiró el vestido a las 3PM"

**Pasos:**
1. Editar alquiler
2. Modificar campo de observaciones
3. Guardar cambios

**Resultado Esperado:**
- ✅ Observaciones se actualizan
- ✅ Mensaje "Alquiler actualizado"

**Criterios de Aceptación:**
- Actualización de observaciones funcional

---

### CP-ALQ-014: Eliminar artículo de alquiler
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Alquiler ID 1 con múltiples artículos
- Artículo aún no entregado

**Pasos:**
1. Ver detalle del alquiler
2. Hacer clic en "Eliminar" artículo específico

**Resultado Esperado:**
- ✅ Artículo se elimina de la lista del alquiler
- ✅ Total del alquiler se recalcula
- ✅ Artículo vuelve a estar disponible
- ✅ Si era el único artículo, alquiler se cancela completamente

**Criterios de Aceptación:**
- Eliminación individual de artículos
- Recálculo automático

---

### CP-ALQ-015: Desactivar alquiler completo
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Alquiler ID 1 existe
- Usuario ADMIN autenticado

**Pasos:**
1. Hacer clic en "Cancelar Alquiler" o "Desactivar"
2. Confirmar acción

**Resultado Esperado:**
- ✅ Campo `activo` cambia a `false`
- ✅ Todos los artículos vuelven a disponible
- ✅ Alquiler no aparece en listas activas

**Criterios de Aceptación:**
- Soft delete
- Artículos liberados

---

---

## 💰 RF-05: MÓDULO DE GESTIÓN DE PAGOS

### Requerimiento Funcional:
El sistema debe permitir registrar pagos y abonos para alquileres, calcular saldos pendientes y mantener historial de pagos.

---

### CP-PAG-001: Registrar pago total de alquiler
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Alquiler ID 1 existe con total de $70,000
- No se han registrado pagos previos
- Usuario autenticado

**Datos de Entrada:**
- ID Alquiler: 1
- Valor abono: 70000
- Fecha: 03/03/2026

**Pasos:**
1. Desde vista de alquiler, hacer clic en "Registrar Pago"
2. Ver saldo pendiente: $70,000
3. Ingresar monto: 70000
4. Fecha se completa automáticamente (hoy)
5. Hacer clic en "Registrar Pago"

**Resultado Esperado:**
- ✅ Mensaje "Pago registrado correctamente"
- ✅ Se crea registro en tabla `pago`
- ✅ Saldo pendiente queda en $0
- ✅ Estado del alquiler puede cambiar a "Pagado"
- ✅ Fecha de último abono se actualiza

**Criterios de Aceptación:**
- Pago se registra correctamente
- Saldo calculado correctamente
- Historial de pagos actualizado

---

### CP-PAG-002: Registrar abono parcial
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Alquiler ID 1 con total $70,000
- Sin pagos previos

**Datos de Entrada:**
- Valor abono: 30000 (42.86% del total)

**Pasos:**
1. Registrar abono de $30,000

**Resultado Esperado:**
- ✅ Pago se registra
- ✅ Saldo pendiente: $40,000
- ✅ Estado "Parcialmente pagado"
- ✅ Se permite registrar más abonos

**Criterios de Aceptación:**
- Cálculo correcto de saldo
- Múltiples abonos permitidos

---

### CP-PAG-003: Registrar múltiples abonos
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Alquiler ID 1 con total $70,000
- Primer abono de $30,000 ya registrado

**Datos de Entrada:**
- Segundo abono: 20000
- Tercer abono: 20000

**Pasos:**
1. Registrar segundo abono de $20,000
2. Verificar saldo: $20,000 restante
3. Registrar tercer abono de $20,000
4. Verificar saldo: $0

**Resultado Esperado:**
- ✅ Cada abono se registra individualmente
- ✅ Saldo se actualiza tras cada pago:
  - Después de 2do abono: $20,000
  - Después de 3er abono: $0
- ✅ Historial muestra 3 pagos
- ✅ Total acumulado: $70,000

**Criterios de Aceptación:**
- Cálculo acumulativo correcto
- Historial completo
- Saldo siempre actualizado

---

### CP-PAG-004: Registrar pago que excede saldo
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Alquiler ID 1 con saldo pendiente de $20,000

**Datos de Entrada:**
- Valor abono: 30000 (excede el saldo)

**Pasos:**
1. Intentar registrar pago mayor al saldo pendiente

**Resultado Esperado:**
- ⚠️ Mensaje "El monto ingresado excede el saldo pendiente"
- ⚠️ Se muestra saldo máximo permitido: $20,000
- ❌ No se permite registrar el pago

**Criterios de Aceptación:**
- Validación de monto máximo
- No se permiten sobrepagos

---

### CP-PAG-005: Registrar pago con monto cero o negativo
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Usuario en formulario de pago

**Datos de Entrada:**
- Valor abono: 0 o -1000

**Pasos:**
1. Intentar registrar pago con monto <= 0

**Resultado Esperado:**
- ⚠️ Mensaje "El monto debe ser mayor a cero"
- ❌ No se permite registrar

**Criterios de Aceptación:**
- Validación de montos válidos

---

### CP-PAG-006: Consultar historial de pagos de un alquiler
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Alquiler ID 1 con 3 pagos registrados:
  - Pago 1: $30,000 - 03/03/2026
  - Pago 2: $20,000 - 04/03/2026
  - Pago 3: $20,000 - 05/03/2026

**Pasos:**
1. Desde detalle de alquiler, hacer clic en "Ver Pagos"
2. O hacer petición GET a `/api/pagos/alquiler/1`

**Resultado Esperado:**
- ✅ Se muestra lista completa de pagos:
  - Cada pago con fecha, monto y número de pago
- ✅ Total acumulado: $70,000
- ✅ Saldo actual: $0
- ✅ Ordenados por fecha (más reciente primero o viceversa)

**Criterios de Aceptación:**
- Historial completo
- Datos correctos
- Fácil visualización

---

### CP-PAG-007: Consultar pago por ID
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Pago con ID 1 existe

**Pasos:**
1. Hacer petición GET a `/api/pagos/ConsultarById/1`

**Resultado Esperado:**
- ✅ Se retorna pago con:
  - ID
  - ID del alquiler asociado
  - Valor del abono
  - Fecha del pago

**Criterios de Aceptación:**
- Datos completos
- Relación con alquiler clara

---

### CP-PAG-008: Listar todos los pagos
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Existen pagos en BD
- Usuario autenticado

**Pasos:**
1. Hacer petición GET a `/api/pagos/ConsultarPagos`

**Resultado Esperado:**
- ✅ Se retorna lista de todos los pagos
- ✅ Incluye información del alquiler asociado

**Criterios de Aceptación:**
- Lista completa
- Relaciones cargadas

---

### CP-PAG-009: Actualizar pago existente
**Prioridad:** P3 - Baja  
**Tipo:** Funcional

**Precondiciones:**
- Pago ID 1 existe con valor $30,000
- Usuario autenticado

**Datos de Entrada:**
- Nuevo valor: 35000

**Pasos:**
1. Editar pago
2. Cambiar monto
3. Guardar cambios

**Resultado Esperado:**
- ✅ Pago se actualiza
- ✅ Saldo del alquiler se recalcula automáticamente
- ✅ Mensaje "Pago actualizado"

**Criterios de Aceptación:**
- Actualización funcional
- Recálculo automático de saldos

---

### CP-PAG-010: Eliminar pago (Solo Admin)
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Seguridad

**Precondiciones:**
- Pago ID 1 existe
- Usuario ADMIN autenticado

**Pasos:**
1. Hacer clic en "Eliminar" pago
2. Confirmar eliminación

**Resultado Esperado:**
- ✅ Pago se elimina de BD
- ✅ Saldo del alquiler aumenta según el monto eliminado
- ✅ Historial se actualiza
- ✅ Mensaje "Pago eliminado"

**Criterios de Aceptación:**
- Solo ADMIN puede eliminar
- Saldos recalculados correctamente

---

### CP-PAG-011: Intentar eliminar pago sin permisos
**Prioridad:** P2 - Media  
**Tipo:** Seguridad

**Precondiciones:**
- Usuario VENDEDOR autenticado

**Pasos:**
1. Intentar eliminar pago como vendedor

**Resultado Esperado:**
- ❌ Acción bloqueada
- ⚠️ Mensaje "No tiene permisos"
- ❌ Pago NO se elimina

**Criterios de Aceptación:**
- Control de acceso por roles

---

### CP-PAG-012: Calcular saldo pendiente correctamente
**Prioridad:** P1 - Alta  
**Tipo:** Funcional - Cálculo

**Precondiciones:**
- Alquiler con total $100,000
- Pagos: $40,000 y $30,000

**Pasos:**
1. Consultar saldo pendiente

**Resultado Esperado:**
- ✅ Saldo = $100,000 - ($40,000 + $30,000) = $30,000
- ✅ Cálculo preciso
- ✅ Actualización en tiempo real

**Criterios de Aceptación:**
- Fórmula: Total - Suma(Abonos) = Saldo
- Sin errores de redondeo

---

---

## 👔 RF-06: MÓDULO DE GESTIÓN DE USUARIOS

### Requerimiento Funcional:
El sistema debe permitir a administradores crear, consultar, actualizar y gestionar usuarios (vendedores y administradores).

---

### CP-USU-001: Crear usuario vendedor (Solo Admin)
**Prioridad:** P1 - Alta  
**Tipo:** Funcional - Seguridad

**Precondiciones:**
- Usuario ADMIN autenticado
- Tipos de documento y barrios disponibles
- Rol VENDEDOR existe en BD

**Datos de Entrada:**
- Tipo documento: Cédula (ID: 1)
- Número documento: 5555555555
- Primer nombre: "Carlos"
- Primer apellido: "Ramírez"
- Email: "carlos.vendedor@email.com"
- Contraseña: "vendedor456"
- Teléfono: 3105555555
- Dirección: "Calle 50 #60-70"
- Barrio: Norte (ID: 2)
- Rol: VENDEDOR (ID: 2)

**Pasos:**
1. Navegar a sección "Usuarios" (solo visible para Admin)
2. Hacer clic en "Crear Usuario"
3. Completar formulario
4. Seleccionar rol "Vendedor"
5. Hacer clic en "Guardar"

**Resultado Esperado:**
- ✅ Mensaje "Usuario creado exitosamente"
- ✅ Usuario se guarda en BD
- ✅ Contraseña se encripta con BCrypt
- ✅ Usuario puede iniciar sesión con las credenciales
- ✅ Rol VENDEDOR asignado correctamente

**Criterios de Aceptación:**
- Solo Admin puede crear usuarios
- Contraseña encriptada
- Rol asignado correctamente

---

### CP-USU-002: Crear usuario administrador (Solo Admin)
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario ADMIN autenticado

**Datos de Entrada:**
- Datos del usuario
- Rol: ADMIN (ID: 1)

**Pasos:**
1. Crear usuario seleccionando rol "Administrador"

**Resultado Esperado:**
- ✅ Usuario con rol ADMIN creado
- ✅ Usuario tiene acceso a todas las funcionalidades

**Criterios de Aceptación:**
- Permisos de Admin aplicados
- Acceso a Reportes y Usuarios

---

### CP-USU-003: Crear usuario - Email duplicado
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Usuario con email "admin@ejemplo.com" ya existe

**Datos de Entrada:**
- Email: "admin@ejemplo.com" (duplicado)

**Pasos:**
1. Intentar crear usuario con email existente

**Resultado Esperado:**
- ❌ Error "El email ya está registrado"
- ❌ Usuario NO se crea

**Criterios de Aceptación:**
- Validación de unicidad en email

---

### CP-USU-004: Crear usuario - Documento duplicado
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Usuario con documento 1234567890 existe

**Datos de Entrada:**
- Documento: 1234567890 (duplicado)

**Pasos:**
1. Intentar crear con documento existente

**Resultado Esperado:**
- ❌ Error "El documento ya está registrado"
- ❌ Usuario NO se crea

**Criterios de Aceptación:**
- Validación de unicidad en documento

---

### CP-USU-005: Listar todos los usuarios (Solo Admin)
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario ADMIN autenticado
- Usuarios existen en BD

**Pasos:**
1. Navegar a sección "Usuarios"
2. Ver lista

**Resultado Esperado:**
- ✅ Se muestran todos los usuarios
- ✅ Información visible:
  - Nombre completo
  - Documento
  - Email
  - Rol
  - Estado (Activo/Inactivo)
  - Botones de acción
- ❌ Contraseñas NO se muestran

**Criterios de Aceptación:**
- Solo Admin puede ver esta lista
- Datos sensibles protegidos

---

### CP-USU-006: Consultar usuario por ID
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Usuario ID 1 existe
- Admin autenticado

**Pasos:**
1. Hacer petición GET a `/api/usu/ConsultarById/1`

**Resultado Esperado:**
- ✅ Se retorna usuario con:
  - Documento, nombres, email, teléfono, etc.
  - Rol
  - Barrio, tipo de documento (relaciones)
- ❌ Contraseña NO se incluye

**Criterios de Aceptación:**
- Datos completos excepto contraseña
- Relaciones cargadas

---

### CP-USU-007: Actualizar información de usuario
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario ID 1 existe
- Admin autenticado

**Datos de Entrada:**
- Nuevo teléfono: 3201111111
- Nueva dirección: "Calle Nueva 123"

**Pasos:**
1. Editar usuario
2. Modificar campos
3. Guardar

**Resultado Esperado:**
- ✅ Usuario actualizado
- ✅ Cambios reflejados en BD
- ✅ Mensaje "Usuario actualizado"

**Criterios de Aceptación:**
- Actualización parcial funciona
- No se permite cambiar documento (PK)

---

### CP-USU-008: Cambiar contraseña de usuario
**Prioridad:** P1 - Alta  
**Tipo:** Funcional - Seguridad

**Precondiciones:**
- Usuario existe
- Admin autenticado

**Datos de Entrada:**
- Nueva contraseña: "nuevaContraseña789"

**Pasos:**
1. Editar usuario
2. Ingresar nueva contraseña
3. Guardar

**Resultado Esperado:**
- ✅ Contraseña se actualiza
- ✅ Nueva contraseña se encripta con BCrypt
- ✅ Usuario puede iniciar sesión con nueva contraseña
- ❌ Contraseña anterior no funciona

**Criterios de Aceptación:**
- Encriptación aplicada
- Cambio efectivo de contraseña

---

### CP-USU-009: Desactivar usuario
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario ID 1 activo
- Admin autenticado

**Pasos:**
1. Hacer clic en "Desactivar"
2. Confirmar

**Resultado Esperado:**
- ✅ Campo `activo` = `false`
- ✅ Usuario NO puede iniciar sesión
- ✅ Si tiene sesión activa, se invalida token
- ❌ Registro NO se elimina físicamente

**Criterios de Aceptación:**
- Soft delete
- Bloqueo de acceso inmediato

---

### CP-USU-010: Activar usuario desactivado
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Usuario ID 1 con `activo = false`
- Admin autenticado

**Pasos:**
1. Hacer clic en "Activar"

**Resultado Esperado:**
- ✅ Campo `activo` = `true`
- ✅ Usuario puede iniciar sesión nuevamente

**Criterios de Aceptación:**
- Reactivación funcional

---

### CP-USU-011: Vendedor intenta acceder a gestión de usuarios
**Prioridad:** P1 - Alta  
**Tipo:** Seguridad - Autorización

**Precondiciones:**
- Usuario VENDEDOR autenticado

**Pasos:**
1. Intentar navegar a `/home-seller/users`
2. O intentar petición a `/api/usu/`

**Resultado Esperado:**
- ❌ Opción "Usuarios" NO visible en menú
- ❌ Si accede por URL: error 403 Forbidden
- ⚠️ Mensaje "No tiene permisos"

**Criterios de Aceptación:**
- Solo Admin tiene acceso
- Frontend y backend validan roles

---

### CP-USU-012: Validar campos obligatorios al crear usuario
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Admin en formulario de crear usuario

**Pasos:**
1. Intentar crear sin completar campos obligatorios:
  - Documento
  - Nombres
  - Email
  - Contraseña
  - Rol
  - Tipo documento
  - Barrio

**Resultado Esperado:**
- ⚠️ Mensajes de validación en cada campo
- ❌ No se permite crear

**Criterios de Aceptación:**
- Validación completa
- Mensajes claros

---

---

## 🏷️ RF-07: MÓDULO DE GESTIÓN DE CATEGORÍAS

### Requerimiento Funcional:
El sistema debe permitir crear, consultar, actualizar y eliminar categorías para clasificar artículos.

---

### CP-CAT-001: Crear nueva categoría
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Usuario autenticado (Admin o Vendedor)
- Navegando en `/home-seller/inventory`

**Datos de Entrada:**
- Nombre categoría: "Accesorios"

**Pasos:**
1. Hacer clic en botón "Nueva Categoría"
2. Ingresar nombre: "Accesorios"
3. Hacer clic en "Guardar"

**Resultado Esperado:**
- ✅ Mensaje "Categoría creada exitosamente"
- ✅ Categoría aparece en lista de categorías
- ✅ Categoría disponible para asignar a artículos
- ✅ Chip de categoría aparece en filtros

**Criterios de Aceptación:**
- Categoría se guarda en BD
- Disponible inmediatamente para uso

---

### CP-CAT-002: Crear categoría con nombre duplicado
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Categoría "Vestidos" ya existe

**Datos de Entrada:**
- Nombre: "Vestidos" (duplicado)

**Pasos:**
1. Intentar crear categoría con nombre existente

**Resultado Esperado:**
- ⚠️ Error "La categoría ya existe"
- ❌ Categoría NO se crea

**Criterios de Aceptación:**
- Validación de unicidad
- Prevención de duplicados

---

### CP-CAT-003: Crear categoría - Nombre vacío
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Datos de Entrada:**
- Nombre: "" (vacío)

**Pasos:**
1. Intentar crear sin nombre

**Resultado Esperado:**
- ⚠️ "El nombre de la categoría es obligatorio"
- ❌ No se permite crear

**Criterios de Aceptación:**
- Campo obligatorio validado

---

### CP-CAT-004: Listar todas las categorías
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Categorías existen en BD

**Pasos:**
1. Navegar a inventario
2. Ver lista de categorías o chips de filtro

**Resultado Esperado:**
- ✅ Se muestran todas las categorías
- ✅ Cada categoría con su nombre
- ✅ Ordenadas alfabéticamente (opcional)

**Criterios de Aceptación:**
- Lista completa
- Datos correctos

---

### CP-CAT-005: Consultar categoría por ID
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Categoría ID 1 existe

**Pasos:**
1. Hacer petición GET a `/api/cat/consultarId/1`

**Resultado Esperado:**
- ✅ Se retorna categoría con:
  - ID
  - Nombre

**Criterios de Aceptación:**
- Respuesta correcta

---

### CP-CAT-006: Actualizar nombre de categoría
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Categoría ID 1 existe con nombre "Zapatos"

**Datos de Entrada:**
- Nuevo nombre: "Calzado"

**Pasos:**
1. Editar categoría
2. Cambiar nombre a "Calzado"
3. Guardar

**Resultado Esperado:**
- ✅ Nombre actualizado
- ✅ Artículos asociados ahora muestran "Calzado"
- ✅ Mensaje "Categoría actualizada"

**Criterios de Aceptación:**
- Actualización funcional
- Relaciones conservadas

---

### CP-CAT-007: Eliminar categoría sin artículos
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Categoría ID 5 existe
- NO tiene artículos asociados

**Pasos:**
1. Hacer clic en "Eliminar"
2. Confirmar

**Resultado Esperado:**
- ✅ Categoría eliminada de BD
- ✅ Mensaje "Categoría eliminada"
- ❌ Ya no aparece en lista

**Criterios de Aceptación:**
- Eliminación física permitida si no hay artículos

---

### CP-CAT-008: Eliminar categoría con artículos asociados
**Prioridad:** P2 - Media  
**Tipo:** Funcional - Validación

**Precondiciones:**
- Categoría ID 1 "Vestidos" existe
- Tiene 10 artículos asociados

**Pasos:**
1. Intentar eliminar categoría

**Resultado Esperado:**
- ⚠️ Error "No se puede eliminar. Hay artículos asociados"
- ❌ Categoría NO se elimina

**Criterios de Aceptación:**
- Integridad referencial protegida
- Mensaje claro sobre el bloqueo

---

---

## 📊 RF-08: MÓDULO DE REPORTES (Solo Admin)

### Requerimiento Funcional:
El sistema debe generar reportes administrativos sobre ventas, inventario, clientes y pagos.

---

### CP-REP-001: Generar reporte de alquileres del día
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Usuario ADMIN autenticado
- Existen alquileres creados hoy
- Navegando en `/home-seller/reports`

**Pasos:**
1. Seleccionar "Alquileres del Día"
2. Hacer clic en "Generar Reporte"

**Resultado Esperado:**
- ✅ Se muestra reporte con:
  - Total de alquileres creados hoy
  - Monto total generado
  - Lista de alquileres del día con detalles
- ✅ Opción de exportar (PDF/Excel)
- ✅ Opción de imprimir

**Criterios de Aceptación:**
- Datos filtrados por fecha actual
- Cálculos correctos

---

### CP-REP-002: Generar reporte de alquileres del mes
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Usuario ADMIN autenticado

**Pasos:**
1. Seleccionar "Alquileres del Mes"
2. Seleccionar mes y año
3. Generar reporte

**Resultado Esperado:**
- ✅ Reporte con:
  - Total de alquileres del mes
  - Monto total
  - Comparativa con mes anterior (opcional)
  - Gráfico de tendencias (opcional)

**Criterios de Aceptación:**
- Filtrado correcto por mes
- Datos precisos

---

### CP-REP-003: Reporte de estado de inventario
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Usuario ADMIN autenticado

**Pasos:**
1. Seleccionar "Estado de Inventario"
2. Generar reporte

**Resultado Esperado:**
- ✅ Reporte muestra:
  - Total de artículos activos
  - Artículos disponibles (no alquilados)
  - Artículos en alquiler actual
  - Artículos inactivos
  - Por categoría

**Criterios de Aceptación:**
- Resumen completo del inventario
- Conteos correctos

---

### CP-REP-004: Reporte de clientes frecuentes
**Prioridad:** P3 - Baja  
**Tipo:** Funcional

**Precondiciones:**
- Usuario ADMIN autenticado

**Pasos:**
1. Seleccionar "Clientes Frecuentes"
2. Generar reporte

**Resultado Esperado:**
- ✅ Reporte con:
  - Top 10 clientes con más alquileres
  - Cantidad de alquileres por cliente
  - Monto total gastado por cliente

**Criterios de Aceptación:**
- Ordenado por frecuencia
- Datos históricos completos

---

### CP-REP-005: Reporte de pagos pendientes
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Precondiciones:**
- Usuario ADMIN autenticado
- Existen alquileres con saldo pendiente

**Pasos:**
1. Seleccionar "Pagos Pendientes"
2. Generar reporte

**Resultado Esperado:**
- ✅ Reporte con:
  - Lista de alquileres con saldo pendiente
  - Cliente, monto total, monto pagado, saldo
  - Total de deuda acumulada
  - Filtro por antigüedad (opcional)

**Criterios de Aceptación:**
- Solo alquileres con saldo > 0
- Cálculos correctos

---

### CP-REP-006: Exportar reporte a Excel
**Prioridad:** P3 - Baja  
**Tipo:** Funcional

**Precondiciones:**
- Reporte generado

**Pasos:**
1. Hacer clic en "Exportar a Excel"

**Resultado Esperado:**
- ✅ Se descarga archivo .xlsx
- ✅ Contiene todos los datos del reporte
- ✅ Formato legible

**Criterios de Aceptación:**
- Archivo válido
- Datos completos

---

### CP-REP-007: Vendedor intenta acceder a reportes
**Prioridad:** P1 - Alta  
**Tipo:** Seguridad

**Precondiciones:**
- Usuario VENDEDOR autenticado

**Pasos:**
1. Intentar acceder a `/home-seller/reports`

**Resultado Esperado:**
- ❌ Opción "Reportes" NO visible en menú
- ❌ Acceso por URL bloqueado: 403 Forbidden

**Criterios de Aceptación:**
- Solo Admin tiene acceso

---

---

## 🗂️ RF-09: MÓDULOS AUXILIARES

### Requerimiento Funcional:
El sistema debe gestionar catálogos de soporte como barrios y tipos de documento.

---

### CP-AUX-001: Listar tipos de documento
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Pasos:**
1. Hacer petición GET a `/api/tipodoc`

**Resultado Esperado:**
- ✅ Se retorna lista:
  - Cédula de Ciudadanía
  - Pasaporte
  - NIT
  - Tarjeta de Identidad
  - etc.

**Criterios de Aceptación:**
- Lista completa
- Disponibles para selección

---

### CP-AUX-002: Listar barrios
**Prioridad:** P2 - Media  
**Tipo:** Funcional

**Pasos:**
1. Hacer petición GET a `/api/barrio`

**Resultado Esperado:**
- ✅ Se retorna lista de barrios

**Criterios de Aceptación:**
- Lista completa disponible

---

---

## 📱 RF-10: APLICACIÓN MÓVIL

### Requerimiento Funcional:
La aplicación móvil debe replicar funcionalidades principales del sistema web.

---

### CP-MOV-001: Login en app móvil
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- App instalada en dispositivo
- Backend en ejecución

**Datos de Entrada:**
- Email: admin@ejemplo.com
- Contraseña: admin123

**Pasos:**
1. Abrir app
2. Ingresar credenciales
3. Hacer clic en "Ingresar"

**Resultado Esperado:**
- ✅ Login exitoso
- ✅ Token almacenado en AsyncStorage
- ✅ Navegación a HomeScreen

**Criterios de Aceptación:**
- Funcionalidad idéntica a web

---

### CP-MOV-002: Ver catálogo en app móvil
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario autenticado en app

**Pasos:**
1. Navegar a tab "Catálogo"
2. Ver lista de artículos

**Resultado Esperado:**
- ✅ Grid de artículos con imágenes
- ✅ Búsqueda funcional
- ✅ Filtros por categoría
- ✅ Pull-to-refresh

**Criterios de Aceptación:**
- UI responsiva
- Datos sincronizados con web

---

### CP-MOV-003: Crear alquiler desde app móvil
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Usuario Admin/Vendedor en app
- Cliente y artículos disponibles

**Pasos:**
1. Navegar a "Nuevo Alquiler"
2. Buscar cliente por documento
3. Seleccionar fechas
4. Seleccionar artículos
5. Crear alquiler

**Resultado Esperado:**
- ✅ Alquiler creado exitosamente
- ✅ Sincronización con backend
- ✅ Visible en app y web

**Criterios de Aceptación:**
- Funcionalidad completa
- UX optimizada para móvil

---

### CP-MOV-004: Marcar artículo como entregado desde app
**Prioridad:** P1 - Alta  
**Tipo:** Funcional

**Precondiciones:**
- Alquiler con artículo pendiente

**Pasos:**
1. Navegar a "Órdenes" > "Por Entregar"
2. Hacer clic en "Marcar como Entregado"

**Resultado Esperado:**
- ✅ Estado actualizado
- ✅ Artículo se mueve a "Por Recibir"

**Criterios de Aceptación:**
- Sincronización inmediata

---

### CP-MOV-005: Navegación diferenciada por rol en app
**Prioridad:** P1 - Alta  
**Tipo:** Funcional - Autorización

**Precondiciones:**
- Usuario Cliente autenticado

**Pasos:**
1. Iniciar sesión como Cliente

**Resultado Esperado:**
- ✅ Solo 2 tabs visibles:
  - Catálogo
  - Perfil
- ❌ NO se muestran: Inventario, Órdenes, Clientes

**Criterios de Aceptación:**
- UI adaptada por rol
- Control de acceso funcional

---

---

# 📊 Matriz de Trazabilidad

| ID Requisito | Nombre Requisito | Casos de Prueba | Prioridad |
|--------------|------------------|----------------|-----------|
| RF-01 | Autenticación | CP-AUTH-001 a CP-AUTH-011 | Alta |
| RF-02 | Gestión de Artículos | CP-ART-001 a CP-ART-017 | Alta |
| RF-03 | Gestión de Clientes | CP-CLI-001 a CP-CLI-013 | Alta |
| RF-04 | Gestión de Alquileres | CP-ALQ-001 a CP-ALQ-015 | Alta |
| RF-05 | Gestión de Pagos | CP-PAG-001 a CP-PAG-012 | Alta |
| RF-06 | Gestión de Usuarios | CP-USU-001 a CP-USU-012 | Alta |
| RF-07 | Gestión de Categorías | CP-CAT-001 a CP-CAT-008 | Media |
| RF-08 | Reportes | CP-REP-001 a CP-REP-007 | Media |
| RF-09 | Módulos Auxiliares | CP-AUX-001 a CP-AUX-002 | Baja |
| RF-10 | Aplicación Móvil | CP-MOV-001 a CP-MOV-005 | Alta |

---

# ✅ Criterios de Aceptación Generales

## Funcionales:
- ✅ Todas las funcionalidades especificadas implementadas
- ✅ Validaciones de datos en frontend y backend
- ✅ Mensajes de error claros y específicos
- ✅ Transacciones de base de datos consistentes

## No Funcionales:
- ⚡ Tiempos de respuesta < 3 segundos
- 🔒 Autenticación y autorización funcionales
- 🛡️ Inyección SQL prevenida
- 🔐 Contraseñas encriptadas
- 📱 Interfaz responsiva (web y móvil)

## Seguridad:
- ✅ Roles y permisos implementados correctamente
- ✅ Tokens JWT funcionando
- ✅ Rutas protegidas
- ✅ Datos sensibles no expuestos

## Usabilidad:
- ✅ Navegación intuitiva
- ✅ Feedback visual inmediato
- ✅ Formularios con validación en tiempo real
- ✅ Mensajes de confirmación en acciones críticas

---

# 📈 Resumen de Casos de Prueba

## Por Módulo:

| Módulo | Total CPs | Prioridad Alta | Prioridad Media | Prioridad Baja |
|--------|-----------|----------------|-----------------|----------------|
| Autenticación | 11 | 8 | 3 | 0 |
| Artículos | 17 | 8 | 7 | 2 |
| Clientes | 13 | 7 | 6 | 0 |
| Alquileres | 15 | 10 | 5 | 0 |
| Pagos | 12 | 7 | 5 | 0 |
| Usuarios | 12 | 7 | 5 | 0 |
| Categorías | 8 | 2 | 6 | 0 |
| Reportes | 7 | 1 | 4 | 2 |
| Auxiliares | 2 | 0 | 2 | 0 |
| App Móvil | 5 | 5 | 0 | 0 |
| **TOTAL** | **102** | **55** | **43** | **4** |

---

# 🎯 Estrategia de Ejecución

## Fase 1: Casos Críticos (P1)
- Autenticación y autorización
- CRUD básico de artículos, clientes, alquileres
- Gestión de pagos básica

## Fase 2: Casos Importantes (P2)
- Validaciones complejas
- Filtros y búsquedas
- Actualización de datos
- Reportes básicos

## Fase 3: Casos Complementarios (P3)
- Exportaciones
- Funcionalidades adicionales
- Mejoras de UX

---

# 📝 Notas Finales

Este plan de pruebas cubre **102 casos de prueba** que validan todos los requerimientos funcionales del Sistema de Gestión de Alquileres (SGA), tanto para la versión web como móvil.

**Recomendaciones:**
1. Ejecutar casos de prioridad Alta primero
2. Automatizar casos repetitivos con herramientas como Selenium (web) o Detox (móvil)
3. Mantener un registro de defectos encontrados
4. Realizar pruebas de regresión tras cada cambio
5. Validar con usuarios finales (pruebas de aceptación)

---

**Documento generado:** Marzo 2026  
**Estado:** ✅ Completo  
**Próxima revisión:** Tras implementación de correcciones

