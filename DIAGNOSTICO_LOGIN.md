# 🔍 Diagnóstico: Pantalla en Blanco al Login con Vendedores

## Problema
- ✅ Con `vendedor@ejemplo.com` → Funciona
- ❌ Con otros vendedores (nicolas@vendedor.com, juan@juan.com) → Pantalla en blanco

## Hipótesis

### Hipótesis 1: Los otros vendedores no tienen ROL asignado
Si en la BD:
- `vendedor@ejemplo.com` tiene `id_rol = 2` (VENDEDOR)
- `nicolas@vendedor.com` tiene `id_rol = NULL`
- `juan@juan.com` tiene `id_rol = NULL`

Entonces en `CustomUserDetailsService.java` fallará:
```java
String nombreRol = usuario.getRol().getNomRol();  // ❌ NullPointerException si getRol() es null
```

**Resultado**: Error al cargar los detalles del usuario → No se puede autenticar → Pantalla en blanco

### Hipótesis 2: El rol tiene un nombre incorrecto
Si el rol tiene un `nomRol` que no es "VENDEDOR" o "ADMIN", el frontend no sabría cómo manejarlo.

### Hipótesis 3: La contraseña está mal hasheada
Si las contraseñas de los nuevos vendedores no se pusieron en BCrypt, no pasarán la validación.

## Cómo Verificar

### Opción 1: Abrir DevTools del Navegador
1. Abre el navegador
2. Presiona F12 para abrir DevTools
3. Ve a la pestaña "Console"
4. Intenta hacer login con `nicolas@vendedor.com`
5. Observa si hay algún error en la consola

**Esperado**: Deberías ver un error relacionado con `getRol()` o similar.

### Opción 2: Revisar los Logs de Spring Boot
1. Abre la terminal donde se ejecuta Spring Boot
2. Intenta hacer login con `nicolas@vendedor.com`
3. Observa los logs del servidor

**Esperado**: Deberías ver un error como:
```
java.lang.NullPointerException: Cannot invoke method getNomRol() on null
```

## Solución Esperada

Asegurarse de que TODOS los usuarios tengan un `id_rol` válido en la BD:

```sql
UPDATE usuarios SET id_rol = 2 WHERE id_rol IS NULL;
```

## Próximos Pasos

1. Abre DevTools (F12) en el navegador
2. Ve a la consola
3. Intenta hacer login con uno de los vendedores que no funcionan
4. Copia el error que aparece
5. Comparte el error para que podamos diagnosticar mejor

Si no ves error en la consola, intenta:
- Ctrl+Shift+Delete para limpiar caché
- Abre DevTools > Network
- Intenta login de nuevo
- Busca la llamada a `/api/auth/login`
- Revisa la respuesta (Response tab)
- ¿La respuesta tiene el campo `rol`?
