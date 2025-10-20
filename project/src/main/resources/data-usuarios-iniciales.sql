-- Script para insertar usuarios iniciales con roles
-- Nota: Ejecuta este script DESPUÉS de que las tablas estén creadas

-- Insertar roles si no existen
INSERT INTO rol (nom_rol) VALUES ('ADMIN') ON DUPLICATE KEY UPDATE nom_rol = 'ADMIN';
INSERT INTO rol (nom_rol) VALUES ('VENDEDOR') ON DUPLICATE KEY UPDATE nom_rol = 'VENDEDOR';

-- Nota: Las contraseñas están encriptadas con BCrypt
-- admin123 -> $2a$10$kZqYvVQxPxW7xJHqXWxF1eDqZ8YxXh9vF3YxYvZxQxYvZxQxYvZxQ (ejemplo, debe generarse)
-- vendedor123 -> $2a$10$kZqYvVQxPxW7xJHqXWxF1eDqZ8YxXh9vF3YxYvZxQxYvZxQxYvZxR (ejemplo, debe generarse)

-- IMPORTANTE: Debes ejecutar el siguiente código Java para generar las contraseñas encriptadas:
-- 
-- BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
-- String adminPassword = encoder.encode("admin123");
-- String vendedorPassword = encoder.encode("vendedor123");
-- System.out.println("Admin: " + adminPassword);
-- System.out.println("Vendedor: " + vendedorPassword);

-- Asegúrate de tener las tablas tipo_doc y barrio con al menos un registro
-- Si no existen, créalos primero:
-- INSERT INTO tipo_doc (nom_tipo_doc) VALUES ('Cédula de Ciudadanía');
-- INSERT INTO barrio (nom_barrio) VALUES ('Centro');

-- Insertar usuario ADMIN
-- Reemplaza los valores de contraseña con los generados por BCrypt
INSERT INTO usuario (num_doc, nom1, nom2, ape1, ape2, direccion, num_tel, correo_elec, contraseña, id_barrio, id_tipo_doc, id_rol)
VALUES (
    1000000001,
    'Admin',
    'Super',
    'Sistema',
    'Principal',
    'Calle Principal #123',
    3001234567,
    'admin@ejemplo.com',
    '$2a$10$N0Xb9QX5u5Z5u5Z5u5Z5uO5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5',  -- Reemplazar con contraseña encriptada
    1,  -- ID del barrio (ajustar según tu base de datos)
    1,  -- ID del tipo de documento (ajustar según tu base de datos)
    (SELECT id_rol FROM rol WHERE nom_rol = 'ADMIN')
) ON DUPLICATE KEY UPDATE correo_elec = 'admin@ejemplo.com';

-- Insertar usuario VENDEDOR
INSERT INTO usuario (num_doc, nom1, nom2, ape1, ape2, direccion, num_tel, correo_elec, contraseña, id_barrio, id_tipo_doc, id_rol)
VALUES (
    1000000002,
    'Vendedor',
    'Prueba',
    'Sistema',
    'Test',
    'Avenida Principal #456',
    3009876543,
    'vendedor@ejemplo.com',
    '$2a$10$N0Xb9QX5u5Z5u5Z5u5Z5uO5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z6',  -- Reemplazar con contraseña encriptada
    1,  -- ID del barrio (ajustar según tu base de datos)
    1,  -- ID del tipo de documento (ajustar según tu base de datos)
    (SELECT id_rol FROM rol WHERE nom_rol = 'VENDEDOR')
) ON DUPLICATE KEY UPDATE correo_elec = 'vendedor@ejemplo.com';
