-- Script para insertar datos de muestra de artículos en la base de datos pruebita
-- Ejecutar este script después de init-data.sql

USE pruebita;

-- Insertar categorías (10 registros)
INSERT INTO categoria (nom_cate) VALUES ('Para dama');
INSERT INTO categoria (nom_cate) VALUES ('Para caballero');
INSERT INTO categoria (nom_cate) VALUES ('Para niño');
INSERT INTO categoria (nom_cate) VALUES ('Para niña');
INSERT INTO categoria (nom_cate) VALUES ('Accesorios');
INSERT INTO categoria (nom_cate) VALUES ('Calzado');
INSERT INTO categoria (nom_cate) VALUES ('Vestidos de novia');
INSERT INTO categoria (nom_cate) VALUES ('Trajes de gala');
INSERT INTO categoria (nom_cate) VALUES ('Disfraces');
INSERT INTO categoria (nom_cate) VALUES ('Ropa deportiva');

-- Insertar artículos (10 registros por categoría = 100 artículos en total, aquí 30 como muestra representativa)

-- Artículos para dama (10)
INSERT INTO articulo (nom_art, genero, talla, color, precio, foto, id_categoria) VALUES 
('Vestido Elegante Rojo', 'Femenino', 'M', 'Rojo', 150000, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', 1),
('Vestido de Noche Azul', 'Femenino', 'S', 'Azul', 200000, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400', 1),
('Vestido Casual Blanco', 'Femenino', 'L', 'Blanco', 120000, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 1),
('Vestido de Fiesta Negro', 'Femenino', 'M', 'Negro', 180000, 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400', 1),
('Vestido Verano Amarillo', 'Femenino', 'S', 'Amarillo', 130000, 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400', 1),
('Vestido Largo Verde', 'Femenino', 'L', 'Verde', 160000, 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400', 1),
('Vestido Corto Rosa', 'Femenino', 'S', 'Rosa', 140000, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', 1),
('Vestido Cóctel Morado', 'Femenino', 'M', 'Morado', 175000, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400', 1),
('Vestido Estampado Floral', 'Femenino', 'L', 'Multicolor', 155000, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 1),
('Vestido Plisado Plateado', 'Femenino', 'M', 'Plateado', 195000, 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400', 1);

-- Artículos para caballero (10)
INSERT INTO articulo (nom_art, genero, talla, color, precio, foto, id_categoria) VALUES 
('Traje Ejecutivo Negro', 'Masculino', 'L', 'Negro', 250000, 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400', 2),
('Smoking Azul Marino', 'Masculino', 'M', 'Azul Marino', 280000, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', 2),
('Traje Gris Oxford', 'Masculino', 'XL', 'Gris', 230000, 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400', 2),
('Traje Casual Beige', 'Masculino', 'L', 'Beige', 190000, 'https://images.unsplash.com/photo-1598808503491-c8c5ac9ee097?w=400', 2),
('Traje Slim Fit Café', 'Masculino', 'M', 'Café', 220000, 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400', 2),
('Esmoquin Blanco', 'Masculino', 'L', 'Blanco', 300000, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', 2),
('Traje a Rayas Gris', 'Masculino', 'XL', 'Gris', 240000, 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400', 2),
('Traje Verde Oliva', 'Masculino', 'L', 'Verde', 210000, 'https://images.unsplash.com/photo-1598808503491-c8c5ac9ee097?w=400', 2),
('Smoking Vino Tinto', 'Masculino', 'M', 'Vino', 270000, 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400', 2),
('Traje Cruzado Azul', 'Masculino', 'L', 'Azul', 260000, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', 2);

-- Artículos para niño (10)
INSERT INTO articulo (nom_art, genero, talla, color, precio, foto, id_categoria) VALUES 
('Vestido Niña Rosa', 'Femenino', '8', 'Rosa', 80000, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400', 3),
('Traje Niño Azul', 'Masculino', '10', 'Azul', 90000, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400', 3),
('Vestido Niña Lila', 'Femenino', '6', 'Lila', 75000, 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=400', 3),
('Traje Niño Negro', 'Masculino', '12', 'Negro', 95000, 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400', 3),
('Vestido Princesa Celeste', 'Femenino', '7', 'Celeste', 85000, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400', 3),
('Traje Marinero Niño', 'Masculino', '9', 'Blanco/Azul', 88000, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400', 3),
('Vestido Flores Amarillo', 'Femenino', '8', 'Amarillo', 78000, 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=400', 3),
('Traje Gala Niño Gris', 'Masculino', '11', 'Gris', 92000, 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400', 3),
('Vestido Tul Rosa Fucsia', 'Femenino', '6', 'Fucsia', 82000, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400', 3),
('Traje Chaleco Niño Beige', 'Masculino', '10', 'Beige', 86000, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400', 3);

-- Verificar datos insertados
SELECT 'Categorías:' as Tabla;
SELECT * FROM categoria;

SELECT 'Total de Artículos:' as Info;
SELECT COUNT(*) as Total FROM articulo;

SELECT 'Artículos por Categoría:' as Info;
SELECT c.nom_cate, COUNT(a.id_articulo) as cantidad
FROM categoria c
LEFT JOIN articulo a ON c.id_categoria = a.id_categoria
GROUP BY c.id_categoria, c.nom_cate;
