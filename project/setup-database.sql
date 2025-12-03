-- Script de configuración completa de la base de datos pruebita
-- Ejecutar este script en MySQL para inicializar todos los datos necesarios

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS pruebita;
USE pruebita;

-- Limpiar datos anteriores (opcional - comentar si quieres mantener datos existentes)
-- DELETE FROM articulo;
-- DELETE FROM categoria;
-- DELETE FROM usuario;
-- DELETE FROM rol;
-- DELETE FROM tipo_doc;
-- DELETE FROM barrio;

-- Insertar roles
INSERT IGNORE INTO rol (nom_rol) VALUES ('ADMIN');
INSERT IGNORE INTO rol (nom_rol) VALUES ('VENDEDOR');
INSERT IGNORE INTO rol (nom_rol) VALUES ('CLIENTE');

-- Insertar tipos de documento
INSERT IGNORE INTO tipo_doc (nom_tipo_doc) VALUES ('Cédula de Ciudadanía');
INSERT IGNORE INTO tipo_doc (nom_tipo_doc) VALUES ('Cédula de Extranjería');
INSERT IGNORE INTO tipo_doc (nom_tipo_doc) VALUES ('Pasaporte');
INSERT IGNORE INTO tipo_doc (nom_tipo_doc) VALUES ('NIT');

-- Insertar barrios
INSERT IGNORE INTO barrio (nom_barrio) VALUES ('Centro');
INSERT IGNORE INTO barrio (nom_barrio) VALUES ('Norte');
INSERT IGNORE INTO barrio (nom_barrio) VALUES ('Sur');
INSERT IGNORE INTO barrio (nom_barrio) VALUES ('Oriente');
INSERT IGNORE INTO barrio (nom_barrio) VALUES ('Occidente');

-- Insertar categorías
INSERT IGNORE INTO categoria (nom_cate, desc_cate) VALUES ('Para dama', 'Vestidos y ropa femenina');
INSERT IGNORE INTO categoria (nom_cate, desc_cate) VALUES ('Para caballero', 'Trajes y ropa masculina');
INSERT IGNORE INTO categoria (nom_cate, desc_cate) VALUES ('Para niño', 'Ropa infantil');

-- Insertar artículos de muestra para dama
INSERT IGNORE INTO articulo (nom_art, genero, talla, color, precio, foto, activo, id_categoria) VALUES 
('Vestido Elegante Rojo', 'Femenino', 'M', 'Rojo', 150000, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', true, 1),
('Vestido de Noche Azul', 'Femenino', 'S', 'Azul', 200000, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400', true, 1),
('Vestido Casual Blanco', 'Femenino', 'L', 'Blanco', 120000, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', true, 1);

-- Insertar artículos de muestra para caballero
INSERT IGNORE INTO articulo (nom_art, genero, talla, color, precio, foto, activo, id_categoria) VALUES 
('Traje Ejecutivo Negro', 'Masculino', 'L', 'Negro', 250000, 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400', true, 2),
('Smoking Azul Marino', 'Masculino', 'M', 'Azul Marino', 280000, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', true, 2);

-- Insertar artículos de muestra para niños
INSERT IGNORE INTO articulo (nom_art, genero, talla, color, precio, foto, activo, id_categoria) VALUES 
('Vestido Niña Rosa', 'Femenino', '8', 'Rosa', 80000, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400', true, 3),
('Traje Niño Azul', 'Masculino', '10', 'Azul', 90000, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400', true, 3);

-- Verificar datos insertados
SELECT '=== CATEGORÍAS ===' as Info;
SELECT * FROM categoria;

SELECT '=== ARTÍCULOS ===' as Info;
SELECT a.id_articulo, a.nom_art, a.precio, c.nom_cate 
FROM articulo a 
INNER JOIN categoria c ON a.id_categoria = c.id_categoria;

SELECT 'Base de datos configurada correctamente' as Resultado;
