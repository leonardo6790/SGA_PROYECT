-- Script de inicialización de datos base para SGA
-- Ejecutar este script antes de iniciar la aplicación Spring Boot

USE pruebita;

-- Insertar tipos de documento
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Cédula de Ciudadanía');
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Cédula de Extranjería');
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Pasaporte');
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('NIT');

-- Insertar barrios
INSERT INTO barrio (nom_barrio) VALUES ('Centro');
INSERT INTO barrio (nom_barrio) VALUES ('Norte');
INSERT INTO barrio (nom_barrio) VALUES ('Sur');
INSERT INTO barrio (nom_barrio) VALUES ('Oriente');
INSERT INTO barrio (nom_barrio) VALUES ('Occidente');

-- Insertar roles
INSERT INTO rol (nom_rol) VALUES ('ADMIN');
INSERT INTO rol (nom_rol) VALUES ('VENDEDOR');
INSERT INTO rol (nom_rol) VALUES ('CLIENTE');

-- Verificar datos insertados
SELECT 'Tipos de Documento:' as Tabla;
SELECT * FROM tipo_doc;

SELECT 'Barrios:' as Tabla;
SELECT * FROM barrio;

SELECT 'Roles:' as Tabla;
SELECT * FROM rol;
