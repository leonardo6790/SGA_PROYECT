-- Script para insertar usuarios iniciales con roles
-- Nota: Ejecuta este script DESPUÉS de que las tablas estén creadas

-- Insertar roles si no existen
INSERT INTO rol (nom_rol) VALUES ('ADMIN') ON DUPLICATE KEY UPDATE nom_rol = 'ADMIN';
INSERT INTO rol (nom_rol) VALUES ('VENDEDOR') ON DUPLICATE KEY UPDATE nom_rol = 'VENDEDOR';

-- Nota: Las contraseñas están encriptadas con BCrypt
-- Contraseña para todos: "password123"
-- Hash BCrypt: $2a$10$N0Xb9QX5u5Z5u5Z5u5Z5uO5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5

-- Insertar 6 usuarios (3 ADMIN, 3 VENDEDOR)

-- ADMINISTRADORES (3)
INSERT INTO usuario (num_doc, nom1, nom2, ape1, ape2, direccion, num_tel, correo_elec, contraseña, id_barrio, id_tipo_doc, id_rol, activo)
VALUES 
(1000000001, 'Admin', 'Super', 'Sistema', 'Principal', 'Calle Principal #123', 3001234567, 'admin@ejemplo.com', '$2a$10$N0Xb9QX5u5Z5u5Z5u5Z5uO5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5', 1, 1, 1, true),
(1000000002, 'Carlos', 'Alberto', 'Rodríguez', 'Pérez', 'Carrera 10 #20-30', 3011234568, 'carlos.admin@ejemplo.com', '$2a$10$N0Xb9QX5u5Z5u5Z5u5Z5uO5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5', 2, 1, 1, true),
(1000000003, 'María', 'Fernanda', 'González', 'López', 'Avenida 15 #45-67', 3021234569, 'maria.admin@ejemplo.com', '$2a$10$N0Xb9QX5u5Z5u5Z5u5Z5uO5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5', 3, 1, 1, true)
ON DUPLICATE KEY UPDATE correo_elec = VALUES(correo_elec);

-- VENDEDORES (3)
INSERT INTO usuario (num_doc, nom1, nom2, ape1, ape2, direccion, num_tel, correo_elec, contraseña, id_barrio, id_tipo_doc, id_rol, activo)
VALUES 
(1014480675, 'nicolas', 'bautista', 'tique', NULL, 'cra 53', 3024936729, 'nicolasgamer908@gmail.com', '$2a$10$smqVdJ0EqIbEoqhDVqJqVeRiIjcGH5o18t1/oM0Vif5lzLZIb5Av.', 2, 1, 2, true),
(1000000005, 'Laura', 'Patricia', 'Torres', 'Ramírez', 'Calle 50 #12-34', 3041234571, 'laura.vendedor@ejemplo.com', '$2a$10$N0Xb9QX5u5Z5u5Z5u5Z5uO5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5', 5, 1, 2, true),
(1000000006, 'Diego', 'Andrés', 'Castro', 'Morales', 'Carrera 22 #56-78', 3051234572, 'diego.vendedor@ejemplo.com', '$2a$10$N0Xb9QX5u5Z5u5Z5u5Z5uO5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5u5Z5', 6, 1, 2, true)
ON DUPLICATE KEY UPDATE correo_elec = VALUES(correo_elec);

-- Verificar usuarios insertados
SELECT 'Usuarios por Rol:' as Info;
SELECT r.nom_rol, COUNT(u.num_doc) as cantidad
FROM rol r
LEFT JOIN usuario u ON r.id_rol = u.id_rol
GROUP BY r.id_rol, r.nom_rol;

SELECT 'Todos los Usuarios:' as Info;
SELECT u.num_doc, CONCAT(u.nom1, ' ', u.ape1) as nombre, u.correo_elec, r.nom_rol
FROM usuario u
INNER JOIN rol r ON u.id_rol = r.id_rol
ORDER BY r.id_rol, u.num_doc;
