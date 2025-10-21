-- Script para limpiar datos duplicados en la base de datos

USE pruebita;

-- Eliminar usuarios primero (tienen foreign keys a rol, barrio y tipoDoc)
DELETE FROM usuario;

-- Eliminar roles duplicados
DELETE FROM rol;

-- Reiniciar auto-increment
ALTER TABLE rol AUTO_INCREMENT = 1;
ALTER TABLE barrio AUTO_INCREMENT = 1;
ALTER TABLE tipo_doc AUTO_INCREMENT = 1;
ALTER TABLE usuario AUTO_INCREMENT = 1;

-- Mensaje de confirmación
SELECT 'Datos limpiados correctamente. Inicia la aplicación Spring Boot nuevamente.' AS Mensaje;
