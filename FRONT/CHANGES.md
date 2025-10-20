CHANGES
=======

Fecha: 2025-10-20
Proyecto: Frontend-SGA
Autor: cambios automáticos realizados por asistente

Resumen de cambios
------------------
Se aplicaron cambios para introducir un sistema de autenticación simple, proteger rutas de seller y normalizar llamadas a la API.

Archivos añadidos
- `src/context/AuthContext.jsx`
  - Contexto global que provee `user`, `login({email,password})` y `logout()`.
  - Login acepta únicamente correo `miguel@paludo.co` y contraseña `DePerrito`.
  - Persiste usuario en `localStorage` bajo la clave `sga_user`.

- `src/components/Auth/ProtectedRoute.jsx`
  - Componente que redirige a `/sign-in` si no existe `user` en `AuthContext`.

Archivos modificados
- `src/pages/Customer_view/Sign-in/Sign-in.page.jsx`
  - Ahora usa `AuthContext` para iniciar sesión.
  - Reemplazó el enlace por un `button` que ejecuta el `login`.
  - Muestra mensaje de error si las credenciales son inválidas.

- `src/main.jsx`
  - Envuelve la aplicación con `BrowserRouter` y `AuthProvider`.

- `src/App.jsx`
  - Importa `ProtectedRoute` y aplica protección a rutas bajo `/home-seller/*`.
  - Mantiene rutas públicas para `/`, `/catalog`, `/Faq`, `/sign-in`.

- `src/api/usuariosApi.js`, `src/api/articulosApi.js`, `src/api/alquilerArticulosApi.js`
  - Normalización de `Content-Type` a `application/json`.
  - Mensajes de error más claros.
  - Uso consistente de `await res.json()`.

Motivación y comportamiento
---------------------------
- El objetivo inmediato fue implementar un login controlado (credenciales fijas) y un contexto global para que componentes puedan acceder al estado de autenticación.
- Las rutas `home-seller` ahora sólo son navegables si hay un usuario autenticado; en caso contrario el usuario se redirige a `/sign-in`.
- Las funciones `src/api/*` ahora lanzan `Error` cuando `fetch` retorna `!res.ok`, lo que facilita el manejo de errores en componentes.

Cómo probar (developer)
-----------------------
1. Instala dependencias e inicia el servidor de desarrollo:

```cmd
npm install
npm run dev
```

2. Abrir el proyecto en el navegador (Vite normalmente usa http://localhost:5173).
3. Ir a `/sign-in` e ingresar las credenciales:
   - Email: `miguel@paludo.co`
   - Contraseña: `DePerrito`
4. Deberías ser redirigido a `/home-seller`.
5. Si intentas navegar a `/home-seller` sin iniciar sesión, serás enviado a `/sign-in`.

Notas de seguridad y recomendaciones
-----------------------------------
- Actualmente las credenciales están hardcodeadas en el cliente. Esto es inseguro para producción.
  Recomendación: implementar un backend de autenticación (JWT o sesiones) y enviar un token que se guarde de forma segura (httpOnly cookie o en memoria) y se incluya en las peticiones.
- Validar y sanitizar entradas en el backend.
- Evitar persistir datos sensibles en localStorage en producción.

Siguientes pasos sugeridos
-------------------------
- Implementar protección de CSRF si se usan cookies para auth.
- Añadir tests unitarios para `AuthContext` y `ProtectedRoute`.
- Añadir un flujo de logout visible en la UI (ej. botón en Navbar).
- Centralizar el manejo de errores de API y mostrar mensajes amistosos en la UI.

Registro de tareas (estado)
---------------------------
- Auditar peticiones API: Done
- Crear AuthContext global: Done
- Modificar Sign-in: Done
- Envolver App con AuthProvider: Done
- Revisar y corregir APIs: Done
- Verificar build/ejecutar checks: Pending
- Resumen y siguientes pasos: Pending
- Agregar protección de rutas: Done
- Generar documento con cambios: Done


Fin del archivo
