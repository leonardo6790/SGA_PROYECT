-- Script para verificar y arreglar usuarios sin ROL

-- 1. Ver todos los usuarios y sus roles
SELECT 
    u.id_usuario,
    u.correo_elec,
    CONCAT(u.nom1, ' ', u.nom2, ' ', u.ape1, ' ', u.ape2) as nombre_completo,
    u.id_rol,
    r.nombre_rol,
    IF(u.id_rol IS NULL, '❌ SIN ROL', 'OK') as estado
FROM usuarios u
LEFT JOIN rol r ON u.id_rol = r.id_rol
ORDER BY u.id_usuario;

-- 2. Contar cuántos usuarios tienen rol NULL
SELECT COUNT(*) as usuarios_sin_rol 
FROM usuarios 
WHERE id_rol IS NULL;

-- 3. Si hay usuarios sin rol, asignarles VENDEDOR (id_rol = 2)
-- ⚠️ EJECUTAR SOLO SI NECESARIO
UPDATE usuarios 
SET id_rol = 2 
WHERE id_rol IS NULL 
  AND correo_elec LIKE '%@%';  -- Solo usuarios con email válido

-- 4. Verificar que se actualizaron correctamente
SELECT 
    id_usuario,
    correo_elec,
    id_rol,
    'Actualizado correctamente' as resultado
FROM usuarios
WHERE id_rol = 2
ORDER BY id_usuario;
