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
 precio_unitario DECIMAL(10,2),
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

SELECT 
	id_producto,
    nombre
FROM Productos
WHERE id_tienda = 1 AND id_proveedor = 5;

DELIMITER //
	CREATE TRIGGER trg_calcular_precio_venta
    BEFORE INSERT ON Productos
    FOR EACH ROW
    BEGIN
		SET NEW.precio_venta = NEW.precio_compra + (NEW.precio_compra * (NEW.porcentaje_ganancia / 100));
        SET NEW.precio_unitario = NEW.precio_venta;
	END //
DELIMITER ;

DELIMITER //
	CREATE TRIGGER trg_actualizar_precio_venta
    BEFORE UPDATE ON Productos
    FOR EACH ROW
    BEGIN 
		SET NEW.precio_venta = NEW.precio_compra + (NEW.precio_compra * (NEW.porcentaje_ganancia / 100));
        SET NEW.precio_unitario = NEW.precio_venta;
    END //
DELIMITER ;

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

-- =======================
-- INSERTS DE USUARIOS
-- =======================
INSERT INTO Usuarios (nombre, apellido, correo, username, password, rol) VALUES
('Karla', 'Pérez', 'karla@antbox.com', 'karla01', '123456', 'vendedor'),
('Luis', 'Gómez', 'luis@antbox.com', 'luis02', '123456', 'vendedor'),
('Martha', 'Torres', 'martha@antbox.com', 'martha03', '123456', 'vendedor'),
('Carlos', 'Santos', 'carlos@antbox.com', 'carlos04', '123456', 'vendedor');

-- =======================
-- INSERTS DE PROVEEDORES
-- =======================
INSERT INTO Proveedores (nombre, direccion, telefono, email, status, id_tienda) VALUES
('Distribuidora Diana','Carretera Norte, Managua','+505 2250-1122','ventas@diana.com.ni','Activo',1),
('Yummies Nicaragua S.A.','Carretera a Masaya Km 10','+505 2278-3344','info@yummies.com.ni','Activo',1),
('Snacks Nica','Altamira, Managua','+505 2289-4422','contacto@snacksnica.com','Activo',1),
('Comercial El Buen Precio','Mercado Oriental, Local 20','+505 8877-9900','contacto@elbuenprecio.com','Activo',1),
('Distribuciones Tropical','Km 4 Carretera Sur, Managua','+505 8990-3344','ventas@tropical.com.ni','Activo',1),
('Chivería El Rey','Bo. San Judas, Managua','+505 8655-6677','rey@chiveria.com.ni','Activo',1),
('Importadora Delicias','Colonia Centroamérica, Managua','+505 8822-9911','ventas@delicias.com.ni','Activo',1),
('Alimentos Nica S.A.','Reparto Schick, Managua','+505 8744-2200','pedidos@alimentosnica.com','Activo',1),
('Variedades El Gallo','Mercado Iván Montenegro','+505 8899-2211','ventas@elgallo.ni','Activo',1),
('Super Dulces','Barrio El Edén, Managua','+505 8811-7755','info@superdulces.com','Activo',1),
('Distribuciones Campero','Carretera Vieja a León','+505 8333-4455','info@distcampero.com','Activo',1),
('Proveedora Selecta','Altamira, Managua','+505 8666-3344','ventas@selecta.com.ni','Activo',1),
('Dulces y Más S.A.','Edificio Comercial Metrocentro','+505 8990-1133','contacto@dulcesymas.com','Activo',1),
('Mercadería Express','Col. Don Bosco, Managua','+505 8555-6677','express@mercaderia.com','Activo',1),
('Abasto Managua','Km 5 Carretera Norte, Managua','+505 8988-2233','abasto@managua.com.ni','Activo',1);

-- =======================
-- INSERTS DE CLIENTES
-- =======================
INSERT INTO Clientes (nombre, direccion, telefono, email, id_tienda) VALUES
('Juan López','Col. San Judas','+505 8877-2211','juanlopez@mail.com',1),
('María Pérez','Reparto Schick','+505 8877-2212','mariaperez@mail.com',1),
('Carlos Gómez','Altamira','+505 8877-2213','carlosgomez@mail.com',1),
('Ana Torres','Villa Libertad','+505 8877-2214','anatorres@mail.com',1),
('Luis Morales','Carretera Norte','+505 8877-2215','luismorales@mail.com',1),
('Sofía Rivas','Los Robles','+505 8877-2216','sofiarivas@mail.com',1),
('Pedro Martínez','Villa Venezuela','+505 8877-2217','pedromartinez@mail.com',1),
('Rosa Castro','El Edén','+505 8877-2218','rosacastro@mail.com',1),
('Javier López','Altamira','+505 8877-2219','javierlopez@mail.com',1),
('Lucía Torres','Col. Miguel Gutiérrez','+505 8877-2220','luciatorres@mail.com',1),
('Camila Ruiz','Reparto Schick','+505 8877-2221','camilaruiz@mail.com',1),
('José García','Villa Flor','+505 8877-2222','josegarcia@mail.com',1),
('Kevin Ortega','Altamira','+505 8877-2223','kevinortega@mail.com',1),
('Martha Reyes','Carretera Sur','+505 8877-2224','marthareyes@mail.com',1),
('Cristian Ramos','El Dorado','+505 8877-2225','cristianramos@mail.com',1);

-- =======================
-- INSERTS DE PRODUCTOS
-- =======================
INSERT INTO Productos (nombre, descripcion, precio_compra, porcentaje_ganancia, stock, stock_minimo, id_proveedor, id_tienda)
VALUES
('Churros Diana 50g','Snacks de maíz sabor original',5.00,30.00,100,10,1,1),
('Tostones Diana 60g','Tostones salados crujientes',6.00,25.00,80,10,1,1),
('Chivería Yummies Quesitos 40g','Snacks sabor a queso',4.50,35.00,120,15,2,1),
('Papas Fritas Yummies 60g','Papas fritas saladas',7.00,30.00,90,10,2,1),
('Tortillitas Nica 30g','Tostaditas de maíz',3.50,40.00,150,20,3,1),
('Galletas ChocoRico','Galletas con relleno de chocolate',9.00,25.00,50,10,7,1),
('Refresco Big Cola 600ml','Bebida gaseosa sabor cola',18.00,20.00,60,10,4,1),
('Agua Selva 1L','Agua purificada embotellada',12.00,20.00,70,10,5,1),
('Chocobananos Congelados','Postre congelado de banano con chocolate',10.00,25.00,40,10,8,1),
('Dulces de Leche El Gallo','Dulces tradicionales nicaragüenses',8.00,30.00,100,15,9,1),
('Gomitas Yummies 50g','Gomitas de frutas',5.50,35.00,90,10,2,1),
('Maní Tostado Diana 80g','Maní con sal tostado',7.00,25.00,70,10,1,1),
('Rosquillas Somoteñas','Rosquillas tradicionales de maíz',6.00,30.00,120,20,10,1),
('Café Presto 200g','Café molido nicaragüense',45.00,20.00,40,5,11,1),
('Galletas Rancheras','Galletas saladas',10.00,25.00,60,10,12,1);
