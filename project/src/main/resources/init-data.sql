-- Script de inicialización de datos base para SGA
-- Ejecutar este script antes de iniciar la aplicación Spring Boot

USE pruebita;

-- Insertar tipos de documento (10 registros)
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Cédula de Ciudadanía');
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Cédula de Extranjería');
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Pasaporte');
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('NIT');
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Tarjeta de Identidad');
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Registro Civil');
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Permiso Especial de Permanencia');
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Salvoconducto');
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Documento Nacional de Identidad');
INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Carné Diplomático');

-- Insertar barrios (10 registros)
INSERT INTO barrio (nom_barrio) VALUES ('Centro');
INSERT INTO barrio (nom_barrio) VALUES ('Norte');
INSERT INTO barrio (nom_barrio) VALUES ('Sur');
INSERT INTO barrio (nom_barrio) VALUES ('Oriente');
INSERT INTO barrio (nom_barrio) VALUES ('Occidente');
INSERT INTO barrio (nom_barrio) VALUES ('La Candelaria');
INSERT INTO barrio (nom_barrio) VALUES ('Chapinero');
INSERT INTO barrio (nom_barrio) VALUES ('Usaquén');
INSERT INTO barrio (nom_barrio) VALUES ('Suba');
INSERT INTO barrio (nom_barrio) VALUES ('Engativá');

-- Insertar roles
INSERT INTO rol (nom_rol) VALUES ('ADMIN');
INSERT INTO rol (nom_rol) VALUES ('VENDEDOR');

-- Verificar datos insertados
SELECT 'Tipos de Documento:' as Tabla;
SELECT * FROM tipo_doc;

SELECT 'Barrios:' as Tabla;
SELECT * FROM barrio;

SELECT 'Roles:' as Tabla;
SELECT * FROM rol;
