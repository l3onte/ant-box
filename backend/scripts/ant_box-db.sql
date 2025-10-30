-- Crear la base de datos
DROP DATABASE IF EXISTS inventario;
CREATE DATABASE inventario;
USE inventario;

-- Tabla de Usuarios
CREATE TABLE Usuarios (
 id_usuario INT AUTO_INCREMENT,
 nombre VARCHAR(100) NOT NULL,
 apellido VARCHAR(100) NOT NULL,
 correo VARCHAR(100) NOT NULL UNIQUE,
 username VARCHAR(50) NOT NULL UNIQUE,
 password VARCHAR(255) NOT NULL,
 rol ENUM('administrador', 'vendedor') NOT NULL,
 CONSTRAINT pk_usuarios PRIMARY KEY (id_usuario)
);

-- Tabla de Tiendas
CREATE TABLE Tiendas (
 id_tienda INT AUTO_INCREMENT,
 id_usuario INT NOT NULL,
 nombre VARCHAR(100) NOT NULL,
 direccion VARCHAR(200),
 telefono VARCHAR(20),
 moneda ENUM('NIO', 'USD') NOT NULL,
 logo VARCHAR(255),
 
 CONSTRAINT pk_tiendas PRIMARY KEY (id_tienda),
 CONSTRAINT fk_tienda_usuario FOREIGN KEY (id_usuario)
  REFERENCES Usuarios(id_usuario)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);


CREATE TABLE Vendedores (
	id_vendedor INT AUTO_INCREMENT,
    id_tienda INT NOT NULL,
    id_usuario INT NOT NULL,
    
    CONSTRAINT pk_vendedores PRIMARY KEY (id_vendedor),
    CONSTRAINT fk_vendedores_usuarios FOREIGN KEY (id_usuario) 
		REFERENCES Usuarios(id_usuario)
		ON DELETE CASCADE
        ON UPDATE CASCADE,
        
	CONSTRAINT fk_vendedores_tienda FOREIGN KEY (id_tienda)
		REFERENCES Tiendas(id_tienda)
		ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Tabla de Proveedores
CREATE TABLE Proveedores (
 id_proveedor INT AUTO_INCREMENT,
 nombre VARCHAR(100) NOT NULL UNIQUE,
 direccion VARCHAR(255),
 telefono VARCHAR(20),
 email VARCHAR(100) UNIQUE,
 status ENUM('Activo', 'Inactivo') NOT NULL,
 id_tienda INT NOT NULL,

 CONSTRAINT pk_proveedores PRIMARY KEY (id_proveedor),
 CONSTRAINT fk_proveedor_tienda FOREIGN KEY (id_tienda)
  REFERENCES Tiendas(id_tienda)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

-- Tabla de Productos
CREATE TABLE Productos (
 id_producto INT AUTO_INCREMENT,
 nombre VARCHAR(100) NOT NULL,
 descripcion TEXT,
 precio_compra DECIMAL(10,2) NOT NULL,
 porcentaje_ganancia DECIMAL(5,2) NOT NULL,
 precio_venta DECIMAL(10,2),
 stock INT NOT NULL,
 stock_minimo INT NOT NULL,
 id_proveedor INT,
 id_tienda INT NOT NULL,

 CONSTRAINT pk_productos PRIMARY KEY (id_producto),
 CONSTRAINT fk_producto_proveedor FOREIGN KEY (id_proveedor)
  REFERENCES Proveedores(id_proveedor)
  ON DELETE SET NULL,
 CONSTRAINT fk_producto_tienda FOREIGN KEY (id_tienda)
  REFERENCES Tiendas(id_tienda)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

-- Tabla de Clientes
CREATE TABLE Clientes (
 id_cliente INT AUTO_INCREMENT,
 nombre VARCHAR(100) NOT NULL,
 direccion VARCHAR(255),
 telefono VARCHAR(20),
 email VARCHAR(100),
 id_tienda INT NOT NULL,

 CONSTRAINT pk_clientes PRIMARY KEY (id_cliente),
 CONSTRAINT fk_cliente_tienda FOREIGN KEY (id_tienda)
  REFERENCES Tiendas(id_tienda)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

-- Tabla de Ventas
CREATE TABLE Ventas (
 id_venta INT AUTO_INCREMENT,
 fecha_venta DATE NOT NULL,
 id_cliente INT,
 id_tienda INT NOT NULL,
 total DECIMAL(10,2) NOT NULL,

 CONSTRAINT pk_ventas PRIMARY KEY (id_venta),
 CONSTRAINT fk_venta_cliente FOREIGN KEY (id_cliente)
  REFERENCES Clientes(id_cliente)
  ON DELETE SET NULL,
 CONSTRAINT fk_venta_tienda FOREIGN KEY (id_tienda)
  REFERENCES Tiendas(id_tienda)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

-- Tabla Detalle de Ventas
CREATE TABLE Detalle_Ventas (
 id_detalle INT AUTO_INCREMENT,
 id_venta INT NOT NULL,
 id_producto INT NOT NULL,
 cantidad INT NOT NULL,
 precio_unitario DECIMAL(10,2) NOT NULL,

 CONSTRAINT pk_detalle_ventas PRIMARY KEY (id_detalle),
 CONSTRAINT fk_detalle_venta FOREIGN KEY (id_venta)
  REFERENCES Ventas(id_venta)
  ON DELETE CASCADE,
 CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto)
  REFERENCES Productos(id_producto)
  ON DELETE RESTRICT
);

-- Tabla de Compras
CREATE TABLE Compras (
 id_compra INT AUTO_INCREMENT,
 id_proveedor INT,
 fecha_compra DATE NOT NULL,
 total DECIMAL(10,2) NOT NULL,
 id_tienda INT NOT NULL,

 CONSTRAINT pk_compras PRIMARY KEY (id_compra),
 CONSTRAINT fk_compra_proveedor FOREIGN KEY (id_proveedor)
  REFERENCES Proveedores(id_proveedor)
  ON DELETE SET NULL,
 CONSTRAINT fk_compra_tienda FOREIGN KEY (id_tienda)
  REFERENCES Tiendas(id_tienda)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

-- Tabla Detalle de Compras
CREATE TABLE Detalle_Compras (
 id_detalle_compra INT AUTO_INCREMENT,
 id_compra INT NOT NULL,
 id_producto INT NOT NULL,
 cantidad INT NOT NULL,
 precio_compra DECIMAL(10,2) NOT NULL,

 CONSTRAINT pk_detalle_compras PRIMARY KEY (id_detalle_compra),
 CONSTRAINT fk_detalle_compra FOREIGN KEY (id_compra)
  REFERENCES Compras(id_compra)
  ON DELETE CASCADE,
 CONSTRAINT fk_detalle_producto_compra FOREIGN KEY (id_producto)
  REFERENCES Productos(id_producto)
  ON DELETE RESTRICT
);

-- --------------------------
-- INSERTS DE PRUEBA INVENTARIO
-- --------------------------

-- 3️⃣ Proveedores
INSERT INTO Proveedores (nombre, direccion, telefono, email, status, id_tienda)
VALUES
('Distribuidora Nexo', 'Av. Central 123', '2222-1111', 'contacto@nexo.com', 'Activo', 1),
('Tech Import', 'Calle 45 #12', '3333-2222', 'ventas@techimport.com', 'Activo', 1);

-- 4️⃣ Productos
INSERT INTO Productos (nombre, descripcion, precio_compra, porcentaje_ganancia, precio_venta, stock, stock_minimo, id_proveedor, id_tienda)
VALUES
('Mouse Logitech', 'Mouse óptico USB', 10.00, 50.00, 15.00, 20, 5, 1, 1),
('Teclado Redragon', 'Teclado mecánico RGB', 20.00, 40.00, 28.00, 15, 3, 2, 1),
('Monitor LG 24"', 'Monitor LED 24 pulgadas', 100.00, 30.00, 130.00, 10, 2, 2, 1);

-- 5️⃣ Compras
INSERT INTO Compras (id_proveedor, fecha_compra, total, id_tienda)
VALUES
(1, '2025-10-01', 250.00, 1),
(2, '2025-10-05', 300.00, 1);

-- 6️⃣ Detalle_Compras
INSERT INTO Detalle_Compras (id_compra, id_producto, cantidad, precio_compra)
VALUES
(1, 1, 10, 10.00),  -- Compra de 10 Mouse Logitech
(1, 2, 5, 20.00),   -- Compra de 5 Teclados Redragon
(2, 3, 3, 100.00);  -- Compra de 3 Monitores LG 24"

-- 7️⃣ Ventas
INSERT INTO Ventas (fecha_venta, id_cliente, id_tienda, total)
VALUES
('2025-10-10', NULL, 1, 75.00),  -- Venta 1
('2025-10-12', NULL, 1, 84.00);  -- Venta 2

-- 8️⃣ Detalle_Ventas
INSERT INTO Detalle_Ventas (id_venta, id_producto, cantidad, precio_unitario)
VALUES
(1, 1, 5, 15.00),   -- Se vendieron 5 Mouse Logitech
(2, 2, 3, 28.00);   -- Se vendieron 3 Teclados Redragon

SELECT 
	p.id_producto,
	p.nombre,
    p.descripcion,
    p.stock AS stock_actual,
    p.stock_minimo,
    p.precio_compra,
    p.precio_venta,
    p.porcentaje_ganancia,
    prov.nombre AS proveedor,
    COALESCE(SUM(dc.cantidad),0) AS total_comprando,
    COALESCE(SUM(dv.cantidad),0) AS total_vendido,
    COALESCE(SUM(dc.cantidad) - COALESCE(SUM(dv.cantidad), 0)) AS stock_real,
    CASE WHEN p.stock < p.stock_minimo 
		THEN 'Bajo' 
        ELSE 'OK' 
        END AS alerta_stock
FROM Productos p
LEFT JOIN Proveedores prov ON prov.id_proveedor = p.id_proveedor
LEFT JOIN Detalle_Compras dc ON dc.id_producto = p.id_producto
LEFT JOIN Detalle_Ventas dv ON dv.id_producto = p.id_producto
GROUP BY p.id_producto;