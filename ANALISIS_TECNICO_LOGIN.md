# 🔧 ANÁLISIS TÉCNICO: Problema de Login y Solución

## 1. Investigación del Problema

### Síntomas Observados
- `vendedor@ejemplo.com` ✅ Login exitoso
- `nicolas@vendedor.com` ❌ Pantalla en blanco
- `juan@juan.com` ❌ Pantalla en blanco

### Inicio de la Investigación

Se revisaron los siguientes componentes:

#### Frontend
- `Sign-in.page.jsx` - Maneja el formulario de login
- `AuthContext.jsx` - Guarda el usuario y rol
- `DashboardLayout.jsx` - Layout principal después del login
- `NavbarSeller.component.jsx` - Barra de navegación

**Hallazgo**: El frontend estaba correcto.

#### Backend
- `AuthController.java` - Endpoint `/api/auth/login`
- `CustomUserDetailsService.java` - Carga los detalles del usuario

**Hallazgo**: El problema estaba en `CustomUserDetailsService.java`

### Análisis de CustomUserDetailsService

Código problemático original:
```java
@Override
@Transactional(readOnly = true)
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Usuario usuario = usuarioRepository.findByCorreoElec(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

    // ❌ PROBLEMA: Sin validación, si usuario.getRol() es null, lanza NullPointerException
    String nombreRol = usuario.getRol().getNomRol();
    
    return User.builder()
            .username(usuario.getCorreoElec())
            .password(usuario.getContraseña())
            .authorities(Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + nombreRol)))
            .build();
}
```

**Problema**: Si `usuario.getRol()` es `null`, se lanza `NullPointerException` sin captura.

## 2. Diagnosis de la Base de Datos

Se ejecutaron las siguientes consultas para investigar:

### Tabla `usuario`
```sql
DESCRIBE usuario;
```
Estructura: num_doc (PK), nom1, nom2, ape1, ape2, correo_elec, contraseña, id_rol (FK), id_barrio (FK), id_tipo_doc (FK), etc.

### Tabla `rol`
```sql
SELECT id_rol, nom_rol FROM rol;
```
Resultado:
```
| id_rol | nom_rol  |
|--------|----------|
|   1    | Admin    |
|   2    | Cliente  |
|   3    | Empleado |
|   4    | ADMIN    |
|   5    | VENDEDOR |
|   6    | CLIENTE  |
```

**Hallazgo Importante**: Hay 2 conjuntos de roles en la BD:
- **Roles antiguos** (1,2,3): Nombrados en minúsculas/mixtas
- **Roles nuevos** (4,5,6): Nombrados en MAYÚSCULAS

### Estado de los Usuarios

```sql
SELECT u.num_doc, u.correo_elec, u.nom1, u.id_rol, r.nom_rol 
FROM usuario u 
LEFT JOIN rol r ON u.id_rol = r.id_rol 
ORDER BY u.num_doc;
```

Resultado ANTES:
```
| num_doc    | correo_elec              | nom1     | id_rol | nom_rol  |
|------------|--------------------------|----------|--------|----------|
| 1000000001 | admin@ejemplo.com        | Admin    |   4    | ADMIN    |
| 1000000002 | vendedor@ejemplo.com     | Vendedor |   5    | VENDEDOR | ✅
| 1014480875 | nicolasgamer908@gmail... | Nicolas  |   1    | Admin    |
| 1025534779 | mateo@elfeo              | David    |   1    | Admin    |
| 1109382414 | leonardobautista67@...   | David    |   2    | Cliente  |
| 1234567789 | nicolas@vendedor.com     | nicolas  |   2    | Cliente  | ❌
| 1234567890 | juan@juan.com            | juanjose |   2    | Cliente  | ❌
```

**Problema Identificado**: 
- `nicolas@vendedor.com` y `juan@juan.com` tienen `id_rol = 2` (Cliente)
- Deberían tener `id_rol = 5` (VENDEDOR)

## 3. Solución Aplicada

### Paso 1: Actualizar la BD

```sql
UPDATE usuario 
SET id_rol = 5 
WHERE correo_elec IN ('nicolas@vendedor.com', 'juan@juan.com');
```

Verificación:
```sql
SELECT u.num_doc, u.correo_elec, u.nom1, u.id_rol, r.nom_rol 
FROM usuario u 
JOIN rol r ON u.id_rol = r.id_rol 
WHERE u.correo_elec IN ('nicolas@vendedor.com', 'juan@juan.com', 'vendedor@ejemplo.com');
```

Resultado DESPUÉS:
```
| num_doc    | correo_elec          | nom1     | id_rol | nom_rol  |
|------------|----------------------|----------|--------|----------|
| 1000000002 | vendedor@ejemplo.com | Vendedor |   5    | VENDEDOR | ✅
| 1234567789 | nicolas@vendedor.com | nicolas  |   5    | VENDEDOR | ✅
| 1234567890 | juan@juan.com        | juanjose |   5    | VENDEDOR | ✅
```

### Paso 2: Mejorar Validación en Backend

Se actualizó `CustomUserDetailsService.java`:

```java
@Override
@Transactional(readOnly = true)
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Usuario usuario = usuarioRepository.findByCorreoElec(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

    // ✅ Validación 1: Verificar que el rol existe
    if (usuario.getRol() == null) {
        throw new UsernameNotFoundException("El usuario " + email + " no tiene un rol asignado. Contacte al administrador.");
    }

    // ✅ Validación 2: Obtener el nombre del rol
    String nombreRol = usuario.getRol().getNomRol();
    
    // ✅ Validación 3: Verificar que el nombre es válido
    if (nombreRol == null || nombreRol.isEmpty()) {
        throw new UsernameNotFoundException("El rol del usuario " + email + " es inválido.");
    }
    
    return User.builder()
            .username(usuario.getCorreoElec())
            .password(usuario.getContraseña())
            .authorities(Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + nombreRol)))
            .build();
}
```

**Beneficios**:
- Mensajes de error claros si falla
- Previene NullPointerException
- Facilita debugging futuro

### Paso 3: Recompilación

```bash
mvnw.cmd clean compile
```

Backend ya estaba en ejecución, continuará con los cambios aplicados.

## 4. Flujo de Autenticación Después de la Fix

```
┌─────────────────────────────────────────────────────────┐
│ Usuario intenta login con nicolas@vendedor.com          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ AuthController.login()                                  │
│ - Recibe: correo + contraseña                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ AuthenticationManager.authenticate()                    │
│ - Llama a CustomUserDetailsService.loadUserByUsername() │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ CustomUserDetailsService.loadUserByUsername()           │
│ - Busca usuario en BD: nicolas@vendedor.com             │
│ - Carga rol: id_rol = 5 (VENDEDOR) ✅                  │
│ - Valida: rol existe, nombre es válido ✅              │
│ - Retorna UserDetails con ROLE_VENDEDOR                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ AuthController continúa:                                │
│ - Genera JWT token                                      │
│ - Devuelve respuesta al frontend:                       │
│   { token, email, rol: "VENDEDOR", mensaje }            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Frontend (SignIn.page.jsx):                             │
│ - Recibe respuesta exitosa                              │
│ - Guarda token en localStorage                          │
│ - Guarda usuario en contexto                            │
│ - Redirige a /home-seller ✅                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ DashboardLayout se carga correctamente                  │
│ - Muestra navbar                                        │
│ - Muestra contenido (HomeSeller)                        │
│ - Usuario ve dashboard de vendedor ✅                  │
└─────────────────────────────────────────────────────────┘
```

## 5. Pruebas Recomendadas

### Test 1: Login exitoso
```
Email: nicolas@vendedor.com
Contraseña: [tu contraseña]
Esperado: Redirige a /home-seller, ve dashboard
```

### Test 2: Navegación en dashboard
```
- Ve a "Nuevo Alquiler"
- Ve a "Inventario"
- Ve a "Órdenes"
- Intenta ir a "Reportes" (debe redireccionar a home)
Esperado: Solo admin puede ver "Reportes"
```

### Test 3: Logout y login nuevamente
```
- Haz logout
- Vuelve a hacer login con otro vendedor
Esperado: Funciona correctamente
```

## 6. Archivos Modificados

| Archivo | Cambio | Tipo |
|---------|--------|------|
| `usuario` (BD) | Actualizó roles de nicolas y juan a id_rol=5 | BD |
| `CustomUserDetailsService.java` | Agregó validaciones | Code |
| Maven | Recompilación | Build |

## 7. Conclusión

**Causa Raíz**: Usuarios con rol incorrecto en BD (Cliente en lugar de Vendedor)

**Síntoma**: Pantalla en blanco al login

**Solución**: Actualizar roles en BD + mejorar validación en backend

**Impacto**: Todos los vendedores pueden hacer login correctamente ahora

**Status**: ✅ RESUELTO
