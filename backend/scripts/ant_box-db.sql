-- Crear la base de datos
DROP DATABASE IF EXISTS inventario;
CREATE DATABASE IF NOT EXISTS inventario;
USE inventario;

-- Tabla de Proveedores
CREATE TABLE Proveedores (
 id_proveedor INT AUTO_INCREMENT,
 nombre VARCHAR(100) NOT NULL,
 direccion VARCHAR(255),
 telefono VARCHAR(20),
 email VARCHAR(100),
 constraint proveedorespk PRIMARY KEY (id_proveedor)
);

-- Tabla de Productos
CREATE TABLE Productos (
 id_producto INT AUTO_INCREMENT,
 nombre VARCHAR(100) NOT NULL,
 descripcion TEXT,
 precio_compra DECIMAL(10, 2) NOT NULL, -- Precio de compra
 porcentaje_ganancia DECIMAL(5, 2) NOT NULL, -- Porcentaje de ganancia sobre el precio de compra
 precio_venta DECIMAL(10, 2) , -- Precio de venta
 stock INT NOT NULL, -- Cantidad actual en inventario
 stock_minimo INT NOT NULL, -- Stock mínimo permitido
 id_proveedor INT,
 CONSTRAINT productopk PRIMARY KEY (id_producto),
 CONSTRAINT fk_proveedor FOREIGN KEY (id_proveedor)
 REFERENCES Proveedores(id_proveedor)
 ON DELETE CASCADE
);

-- Tabla de Clientes
CREATE TABLE Clientes (
 id_cliente INT AUTO_INCREMENT,
 nombre VARCHAR(100) NOT NULL,
 direccion VARCHAR(255),
 telefono VARCHAR(20),
 email VARCHAR(100),
 CONSTRAINT clientepk PRIMARY KEY (id_cliente)
);

-- Tabla de Ventas
CREATE TABLE Ventas (
 id_venta INT AUTO_INCREMENT,
 fecha_venta DATE NOT NULL,
 id_cliente INT,
 total DECIMAL(10, 2) NOT NULL,
 CONSTRAINT ventaspk PRIMARY KEY (id_venta),
 CONSTRAINT fk_cliente FOREIGN KEY (id_cliente)
 REFERENCES Clientes(id_cliente)
 ON DELETE SET NULL -- Si se elimina un cliente, la venta queda registrada pero sin cliente
);

-- Tabla Detalle de Ventas (una venta puede tener varios productos)
CREATE TABLE Detalle_Ventas (
 id_detalle INT AUTO_INCREMENT,
 id_venta INT,
 id_producto INT,
 cantidad INT NOT NULL,
 precio_unitario DECIMAL(10, 2) NOT NULL,
 PRIMARY KEY (id_detalle),
 CONSTRAINT fk_venta FOREIGN KEY (id_venta)
 REFERENCES Ventas(id_venta)
 ON DELETE CASCADE, -- Si se elimina una venta, se eliminan sus detalles
 CONSTRAINT fk_producto FOREIGN KEY (id_producto)
 REFERENCES Productos(id_producto)
 ON DELETE RESTRICT-- No se puede eliminar un producto si está en ventas
);

-- Tabla de Usuarios (para gestionar acceso)
CREATE TABLE Usuarios (
 id_usuario INT AUTO_INCREMENT,
 username VARCHAR(50) NOT NULL,
 password VARCHAR(255) NOT NULL,
 rol ENUM('administrador', 'vendedor') NOT NULL,
 CONSTRAINT usuariopk PRIMARY KEY (id_usuario)
);

-- Tabla de Compras a Proveedores
CREATE TABLE Compras (
 id_compra INT AUTO_INCREMENT,
 id_proveedor INT,
 fecha_compra DATE NOT NULL,
 total DECIMAL(10, 2) NOT NULL,
 CONSTRAINT compraspk PRIMARY KEY (id_compra),
 CONSTRAINT fk_proveedor_compra FOREIGN KEY (id_proveedor)
 REFERENCES Proveedores(id_proveedor)
 ON DELETE SET NULL
);

-- Tabla Detalle de Compras (una compra puede tener varios productos)
CREATE TABLE Detalle_Compras (
 id_detalle_compra INT AUTO_INCREMENT,
 id_compra INT,
 id_producto INT,
 cantidad INT NOT NULL,
 precio_compra DECIMAL(10, 2) NOT NULL, -- Precio de compra al proveedor
 CONSTRAINT detallecomprapk PRIMARY KEY (id_detalle_compra),
 CONSTRAINT fk_compra FOREIGN KEY (id_compra)
 REFERENCES Compras(id_compra)
 ON DELETE CASCADE,
 CONSTRAINT fk_producto_compra FOREIGN KEY (id_producto)
 REFERENCES Productos(id_producto)
 ON DELETE RESTRICT
);