-- Script para actualizar la tabla alquiler
-- Eliminar la columna usuario_doc y las restricciones relacionadas

USE pruebita;

-- Primero, eliminar la clave foránea si existe
ALTER TABLE alquiler DROP FOREIGN KEY IF EXISTS FK_alquiler_usuario;

-- Eliminar la columna usuario_doc
ALTER TABLE alquiler DROP COLUMN IF EXISTS usuario_doc;

-- Verificar la estructura de la tabla
DESCRIBE alquiler;

-- La tabla ahora debería tener solo:
-- id_alquiler, fecha_ret, fecha_ent, fecha_alq, total_alq, cliente_doc
