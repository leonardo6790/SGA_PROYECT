USE pruebita;

ALTER TABLE articulo MODIFY COLUMN foto VARCHAR(500);

SELECT 'Columna foto actualizada correctamente' as Mensaje;
