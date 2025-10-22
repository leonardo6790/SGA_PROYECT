-- Script para insertar datos de muestra de artículos en la base de datos pruebita
-- Ejecutar este script después de init-data.sql

USE pruebita;

-- Insertar categorías
INSERT INTO categoria (nom_cate) VALUES ('Para dama');
INSERT INTO categoria (nom_cate) VALUES ('Para caballero');
INSERT INTO categoria (nom_cate) VALUES ('Para niño');

-- Insertar artículos de muestra

-- Artículos para dama
INSERT INTO articulo (nom_art, genero, talla, color, precio, foto, id_categoria) VALUES 
('Vestido Elegante Rojo', 'Femenino', 'M', 'Rojo', 150000, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', 1),
('Vestido de Noche Azul', 'Femenino', 'S', 'Azul', 200000, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400', 1),
('Vestido Casual Blanco', 'Femenino', 'L', 'Blanco', 120000, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 1),
('Vestido de Fiesta Negro', 'Femenino', 'M', 'Negro', 180000, 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400', 1),
('Vestido Verano Amarillo', 'Femenino', 'S', 'Amarillo', 130000, 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400', 1),
('Vestido Largo Verde', 'Femenino', 'L', 'Verde', 160000, 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400', 1);

-- Artículos para caballero
INSERT INTO articulo (nom_art, genero, talla, color, precio, foto, id_categoria) VALUES 
('Traje Ejecutivo Negro', 'Masculino', 'L', 'Negro', 250000, 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400', 2),
('Smoking Azul Marino', 'Masculino', 'M', 'Azul Marino', 280000, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', 2),
('Traje Gris Oxford', 'Masculino', 'XL', 'Gris', 230000, 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400', 2),
('Traje Casual Beige', 'Masculino', 'L', 'Beige', 190000, 'https://images.unsplash.com/photo-1598808503491-c8c5ac9ee097?w=400', 2);

-- Artículos para niño
INSERT INTO articulo (nom_art, genero, talla, color, precio, foto, id_categoria) VALUES 
('Vestido Niña Rosa', 'Femenino', '8', 'Rosa', 80000, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400', 3),
('Traje Niño Azul', 'Masculino', '10', 'Azul', 90000, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400', 3),
('Vestido Niña Lila', 'Femenino', '6', 'Lila', 75000, 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=400', 3),
('Traje Niño Negro', 'Masculino', '12', 'Negro', 95000, 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400', 3);

-- Verificar datos insertados
SELECT 'Categorías:' as Tabla;
SELECT * FROM categoria;

SELECT 'Artículos:' as Tabla;
SELECT a.id_articulo, a.nom_art, a.genero, a.talla, a.color, a.precio, c.nom_cate 
FROM articulo a 
INNER JOIN categoria c ON a.id_categoria = c.id_categoria;
