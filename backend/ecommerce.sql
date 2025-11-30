-- ============================================
-- DATABASE: ecommerce
-- ============================================
CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

-- ============================
-- Tabla: Usuario
-- ============================
CREATE TABLE usuario (
    username VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    password VARCHAR(255),
    email VARCHAR(150) UNIQUE,
    telefono VARCHAR(20),
    foto_perfil TEXT
);

-- ============================
-- Tabla: Categorias
-- ============================
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    cantidad_articulos INT DEFAULT 0
);

-- ============================
-- Tabla: Productos
-- ============================
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT,
    nombre VARCHAR(150),
    precio DECIMAL(10,2),
    moneda VARCHAR(10),
    cantidad_vendidos INT DEFAULT 0,
    descripcion TEXT,
    foto TEXT,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);

-- ============================
-- Tabla: Carrito
-- ============================
CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    id_producto INT,
    cantidad_productos INT,
    FOREIGN KEY (username) REFERENCES usuario(username),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- ============================
-- Tabla: Orden
-- ============================
CREATE TABLE orden (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    id_producto INT,
    cantidad_productos INT,
    direccion TEXT,
    metodo_pago VARCHAR(50),
    tipo_envio VARCHAR(50),
    FOREIGN KEY (username) REFERENCES usuario(username),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);
