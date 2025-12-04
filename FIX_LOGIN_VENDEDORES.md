# ⚡ FIX RÁPIDO: Usuarios sin Rol

## Problema Identificado
Los otros vendedores no pueden hacer login porque **no tienen un ROL asignado en la BD**.

Cuando intentan hacer login:
1. El backend intenta cargar `usuario.getRol().getNomRol()`
2. Como `getRol()` es `null`, da error `NullPointerException`
3. El login falla
4. El usuario ve pantalla en blanco

## Solución

### Paso 1: Verifica cuáles usuarios no tienen rol
Ejecuta esta consulta en MySQL:
```sql
SELECT id_usuario, correo_elec, nom1, id_rol 
FROM usuarios 
WHERE id_rol IS NULL;
```

### Paso 2: Asigna el rol VENDEDOR (id_rol = 2) a los usuarios
Si hay usuarios sin rol, ejecuta:
```sql
UPDATE usuarios 
SET id_rol = 2 
WHERE id_rol IS NULL;
```

### Paso 3: Verifica que se actualizó correctamente
```sql
SELECT id_usuario, correo_elec, id_rol 
FROM usuarios 
WHERE id_usuario IN (
    SELECT id_usuario FROM usuarios 
    WHERE correo_elec IN ('nicolas@vendedor.com', 'juan@juan.com', /* etc */)
);
```

## ✅ Cambios en el Backend

Se mejoró `CustomUserDetailsService.java` para dar mensajes de error más claros si un usuario no tiene rol:

**Antes**: NullPointerException silencioso
**Después**: Mensaje de error: "El usuario X no tiene un rol asignado. Contacte al administrador."

## Próximos Pasos

1. **Actualiza los usuarios en la BD** - Asigna rol 2 (VENDEDOR) a los que no tengan
2. **Reinicia el backend** - Para que cargue el código mejorado
3. **Intenta hacer login nuevamente** con los otros vendedores

Si después de esto el login aún falla, verás un mensaje de error más específico que nos ayudará a diagnosticar.

## Verificación Rápida en BD

Para ver el estado actual de todos los usuarios:
```sql
SELECT 
    u.id_usuario,
    u.correo_elec,
    CONCAT(u.nom1, ' ', u.ape1) as nombre,
    u.id_rol,
    COALESCE(r.nombre_rol, 'SIN ROL') as rol
FROM usuarios u
LEFT JOIN rol r ON u.id_rol = r.id_rol
ORDER BY u.id_usuario;
```
