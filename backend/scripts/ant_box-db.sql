-- Crear la base de datos
DROP DATABASE IF EXISTS inventario;
CREATE DATABASE inventario;
USE inventario;

-- Tabla de Usuarios
CREATE TABLE Usuarios (
 id_usuario INT AUTO_INCREMENT,
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

-- Tabla de Proveedores
CREATE TABLE Proveedores (
 id_proveedor INT AUTO_INCREMENT,
 nombre VARCHAR(100) NOT NULL,
 direccion VARCHAR(255),
 telefono VARCHAR(20),
 email VARCHAR(100),
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