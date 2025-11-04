-- Script para agregar la columna 'activo' a todas las tablas principales
-- Ejecutar este script en la base de datos

-- ===== TABLA USUARIO =====
ALTER TABLE usuario 
ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE usuario 
SET activo = TRUE 
WHERE activo IS NULL;

-- ===== TABLA CLIENTES =====
ALTER TABLE clientes 
ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE clientes 
SET activo = TRUE 
WHERE activo IS NULL;

-- ===== TABLA ARTICULO =====
ALTER TABLE articulo 
ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE articulo 
SET activo = TRUE 
WHERE activo IS NULL;

-- ===== TABLA CATEGORIA =====
ALTER TABLE categoria 
ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE categoria 
SET activo = TRUE 
WHERE activo IS NULL;

-- ===== TABLA TIPODOC =====
ALTER TABLE tipoDoc 
ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE tipoDoc 
SET activo = TRUE 
WHERE activo IS NULL;

-- ===== TABLA BARRIO =====
ALTER TABLE barrio 
ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE barrio 
SET activo = TRUE 
WHERE activo IS NULL;

-- ===== TABLA ALQUILER =====
ALTER TABLE alquiler 
ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE alquiler 
SET activo = TRUE 
WHERE activo IS NULL;

-- Verificar que las columnas se agregaron correctamente
-- SELECT numDoc, nom1, ape1, activo FROM usuario LIMIT 5;
-- SELECT docCliente, nombre1, apellido, activo FROM clientes LIMIT 5;
-- SELECT id_articulo, nomArt, activo FROM articulo LIMIT 5;
-- SELECT id_categoria, nomCate, activo FROM categoria LIMIT 5;
-- SELECT id_tipoDoc, nomDoc, activo FROM tipoDoc LIMIT 5;
-- SELECT id_barrio, nomBar, activo FROM barrio LIMIT 5;
-- SELECT id_alquiler, fecha_alq, activo FROM alquiler LIMIT 5;
