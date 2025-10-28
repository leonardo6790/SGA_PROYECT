-- Limpiar alquileres con cliente_doc inválido (0 o NULL)
USE pruebita;

-- Ver los alquileres que se van a eliminar
SELECT * FROM alquiler WHERE cliente_doc = 0 OR cliente_doc IS NULL;

-- Eliminar los registros de alquiler_articulos relacionados primero
DELETE FROM alquiler_articulos 
WHERE id_alquiler IN (
    SELECT id_alquiler FROM alquiler WHERE cliente_doc = 0 OR cliente_doc IS NULL
);

-- Luego eliminar los alquileres inválidos
DELETE FROM alquiler WHERE cliente_doc = 0 OR cliente_doc IS NULL;

-- Verificar que se limpiaron
SELECT COUNT(*) as total_alquileres FROM alquiler;
