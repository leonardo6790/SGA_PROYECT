-- Script para agregar la columna 'entregado' a la tabla alquiler_articulos
-- Esta columna indica si el artículo ya fue entregado al cliente

ALTER TABLE alquiler_articulos 
ADD COLUMN IF NOT EXISTS entregado BOOLEAN DEFAULT FALSE;

-- Actualizar registros existentes para que tengan el valor por defecto
UPDATE alquiler_articulos 
SET entregado = FALSE 
WHERE entregado IS NULL;
