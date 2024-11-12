-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-11-2024 a las 14:47:46
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: facturacion_nest_api_prisma
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla atributo
--

CREATE TABLE atributo (
  id int(11) NOT NULL,
  nombre varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla caja
--

CREATE TABLE caja (
  id int(11) NOT NULL,
  usuarioId int(11) DEFAULT NULL,
  nombre varchar(100) NOT NULL,
  estado enum('ABIERTA','CERRADA') NOT NULL DEFAULT 'CERRADA',
  ubicacion varchar(255) NOT NULL,
  empresaId int(11) NOT NULL,
  fechaEntrada datetime(3) NOT NULL DEFAULT current_timestamp(3),
  updatedAt datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla categoria
--

CREATE TABLE categoria (
  id int(11) NOT NULL,
  nombre varchar(50) NOT NULL,
  empresaId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla categoria
--

INSERT INTO categoria (id, nombre, empresaId, createdAt, updatedAt) VALUES
(1, 'Ropa', 1, '2024-11-11 09:32:39.101', '2024-11-11 09:32:39.101'),
(2, 'Electrodomésticos ', 1, '2024-11-11 09:32:39.101', '2024-11-11 09:32:39.101'),
(3, 'Cuidado Personal', 1, '2024-11-11 12:26:49.435', '2024-11-11 12:26:49.435');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla cliente
--

CREATE TABLE cliente (
  id int(11) NOT NULL,
  identificacion varchar(50) NOT NULL,
  nombre varchar(50) NOT NULL,
  contactoId int(11) NOT NULL,
  tipoCliente enum('FISCAL','FISICO') NOT NULL DEFAULT 'FISICO',
  empresaId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla compra
--

CREATE TABLE compra (
  id int(11) NOT NULL,
  total decimal(10,2) NOT NULL DEFAULT 0.00,
  usuarioId int(11) NOT NULL,
  empresaId int(11) NOT NULL,
  moneda enum('USD','DOP','EU') NOT NULL DEFAULT 'DOP',
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3),
  delete tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla compra
--

INSERT INTO compra (id, total, usuarioId, empresaId, moneda, createdAt, updatedAt, delete) VALUES
(1, 17500.00, 1, 1, 'DOP', '2024-11-11 13:24:21.316', '2024-11-11 15:51:36.506', 1),
(2, 7500.00, 1, 1, 'DOP', '2024-11-12 08:00:28.148', '2024-11-12 08:00:44.155', 1),
(3, 12000.00, 1, 1, 'DOP', '2024-11-12 08:23:43.454', '2024-11-12 08:23:43.454', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla contacto
--

CREATE TABLE contacto (
  id int(11) NOT NULL,
  email varchar(50) DEFAULT NULL,
  telefono varchar(15) DEFAULT NULL,
  whatsapp varchar(15) DEFAULT NULL,
  instagram varchar(30) DEFAULT NULL,
  direccion varchar(50) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla contacto
--

INSERT INTO contacto (id, email, telefono, whatsapp, instagram, direccion, createdAt, updatedAt) VALUES
(1, 'tienda.naka@gmail.com', '829-806-9017', '829-806-9017', '@tienda.naka', 'Río Limpio', '2024-11-11 09:06:16.000', '2024-11-11 09:06:16.000'),
(2, 'malfryrd@gmail.com', '829-806-9017', '829-806-9017', '@malfryrd', 'Santo Domingo', '2024-11-11 09:07:56.000', '2024-11-11 09:07:56.000'),
(3, 'milaurys.contreras@gmail.com', '8098782490', '8098782490', '@milaurys.contreras', 'Santo Domingo', '2024-11-11 12:46:26.320', '2024-11-11 16:59:36.153');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla descuento
--

CREATE TABLE descuento (
  id int(11) NOT NULL,
  tipo enum('FIJO','PORCENTUAL','Volumen','CATEGORIA','CLIENTE','PROMOCIONAL') NOT NULL DEFAULT 'PORCENTUAL',
  valor decimal(10,2) NOT NULL DEFAULT 0.00,
  fechaInicio datetime(3) NOT NULL,
  fechaFin datetime(3) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3),
  condicion text NOT NULL,
  activo tinyint(1) NOT NULL DEFAULT 1,
  empresaId int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla descuentocliente
--

CREATE TABLE descuentocliente (
  id int(11) NOT NULL,
  descuentoId int(11) NOT NULL,
  clienteId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3),
  empresaId int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla descuentoproducto
--

CREATE TABLE descuentoproducto (
  id int(11) NOT NULL,
  descuentoId int(11) NOT NULL,
  productoId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3),
  empresaId int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla descuentosubcategoria
--

CREATE TABLE descuentosubcategoria (
  id int(11) NOT NULL,
  descuentoId int(11) NOT NULL,
  subCategoriaId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3),
  empresaId int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla detallecompra
--

CREATE TABLE detallecompra (
  id int(11) NOT NULL,
  productoId int(11) DEFAULT NULL,
  cantidad int(11) NOT NULL,
  precioCompra decimal(10,2) NOT NULL,
  precioVenta decimal(10,2) NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  compraId int(11) DEFAULT NULL,
  empresaId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3),
  delete tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla detallecompra
--

INSERT INTO detallecompra (id, productoId, cantidad, precioCompra, precioVenta, subtotal, compraId, empresaId, createdAt, updatedAt, delete) VALUES
(1, 1, 20, 500.00, 650.00, 10000.00, 1, 1, '2024-11-11 17:24:21.318', '2024-11-11 15:51:36.514', 1),
(2, 2, 15, 500.00, 650.00, 7500.00, 1, 1, '2024-11-11 17:24:21.318', '2024-11-11 15:51:36.514', 1),
(3, 1, 15, 500.00, 600.00, 7500.00, 2, 1, '2024-11-12 12:00:28.151', '2024-11-12 08:00:44.159', 1),
(4, 3, 3, 4000.00, 4500.00, 12000.00, 3, 1, '2024-11-12 12:23:43.456', '2024-11-12 12:23:43.456', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla detallefactura
--

CREATE TABLE detallefactura (
  id int(11) NOT NULL,
  facturaId int(11) NOT NULL,
  productoId int(11) NOT NULL,
  cantidad int(11) NOT NULL,
  precioUnitario decimal(10,2) DEFAULT 0.00,
  importe decimal(10,2) NOT NULL DEFAULT 0.00,
  itebis decimal(10,2) NOT NULL DEFAULT 0.00,
  empresaId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla devolucioncliente
--

CREATE TABLE devolucioncliente (
  id int(11) NOT NULL,
  facturaId int(11) NOT NULL,
  productoId int(11) NOT NULL,
  cantidad int(11) NOT NULL,
  motivo varchar(100) NOT NULL,
  fecha datetime(3) NOT NULL DEFAULT current_timestamp(3),
  usuarioId int(11) NOT NULL,
  empresaId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla empresa
--

CREATE TABLE empresa (
  id int(11) NOT NULL,
  nombre varchar(50) NOT NULL,
  descripcion varchar(100) DEFAULT NULL,
  contactoId int(11) DEFAULT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla empresa
--

INSERT INTO empresa (id, nombre, descripcion, contactoId, createdAt, updatedAt) VALUES
(1, 'NAKA', NULL, 1, '2024-11-11 09:07:16.000', '2024-11-11 09:07:16.000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla factura
--

CREATE TABLE factura (
  id int(11) NOT NULL,
  codigo varchar(191) NOT NULL,
  subtotal decimal(10,2) NOT NULL DEFAULT 0.00,
  total decimal(10,2) NOT NULL DEFAULT 0.00,
  itebisTotal decimal(10,2) NOT NULL DEFAULT 0.00,
  metodoPago enum('EFECTIVO','TRANSFERENCIA','TARJETA','CREDITO') NOT NULL DEFAULT 'EFECTIVO',
  usuarioId int(11) NOT NULL,
  clienteId int(11) DEFAULT NULL,
  clienteNombre varchar(50) DEFAULT NULL,
  empresaId int(11) NOT NULL,
  estado enum('CANCELADA','PAGADA','PENDIENTE') NOT NULL DEFAULT 'PAGADA',
  cajaId int(11) DEFAULT NULL,
  moneda enum('USD','DOP','EU') NOT NULL DEFAULT 'DOP',
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla gastosoperativos
--

CREATE TABLE gastosoperativos (
  id int(11) NOT NULL,
  concepto varchar(100) NOT NULL,
  monto double NOT NULL,
  fecha datetime(3) NOT NULL DEFAULT current_timestamp(3),
  empresaId int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla historialcaja
--

CREATE TABLE historialcaja (
  id int(11) NOT NULL,
  cajaId int(11) NOT NULL,
  montoInicial decimal(10,2) NOT NULL DEFAULT 0.00,
  montoFinal decimal(10,2) NOT NULL DEFAULT 0.00,
  estado enum('ABIERTA','CERRADA') NOT NULL DEFAULT 'ABIERTA',
  fechaApertura datetime(3) NOT NULL DEFAULT current_timestamp(3),
  fechaCierre datetime(3) DEFAULT NULL,
  createdAt datetime(3) NOT NULL DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla historialdescuentos
--

CREATE TABLE historialdescuentos (
  id int(11) NOT NULL,
  descuentoId int(11) NOT NULL,
  productoId int(11) NOT NULL,
  facturaId int(11) NOT NULL,
  fechaAplicacion datetime(3) NOT NULL,
  cantidad decimal(10,2) NOT NULL DEFAULT 0.00,
  valorDescuento decimal(10,2) NOT NULL DEFAULT 0.00,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3),
  empresaId int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla historialprecio
--

CREATE TABLE historialprecio (
  id int(11) NOT NULL,
  productoId int(11) NOT NULL,
  precioAnterior decimal(10,2) NOT NULL,
  precioNuevo decimal(10,2) NOT NULL,
  fechaCambio datetime(3) NOT NULL DEFAULT current_timestamp(3),
  empresaId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla loteproducto
--

CREATE TABLE loteproducto (
  id int(11) NOT NULL,
  productoId int(11) NOT NULL,
  cantidad int(11) NOT NULL,
  cantidadRestante int(11) DEFAULT NULL,
  empresaId int(11) NOT NULL,
  precioVenta decimal(10,2) NOT NULL,
  fechaEntrada datetime(3) NOT NULL DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3),
  delete tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla loteproducto
--

INSERT INTO loteproducto (id, productoId, cantidad, cantidadRestante, empresaId, precioVenta, fechaEntrada, updatedAt, delete) VALUES
(1, 1, 20, 20, 1, 650.00, '2024-11-11 13:24:21.316', '2024-11-11 13:24:21.316', 1),
(2, 2, 15, 15, 1, 650.00, '2024-11-11 13:24:21.316', '2024-11-11 13:24:21.316', 1),
(3, 1, 15, 15, 1, 600.00, '2024-11-12 08:00:28.148', '2024-11-12 08:00:28.148', 1),
(4, 3, 3, 3, 1, 4500.00, '2024-11-12 08:23:43.454', '2024-11-12 08:23:43.454', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla movimientoinventario
--

CREATE TABLE movimientoinventario (
  id int(11) NOT NULL,
  productoId int(11) NOT NULL,
  tipo enum('ENTRADA','SALIDA','AJUSTE') NOT NULL DEFAULT 'ENTRADA',
  cantidad int(11) NOT NULL,
  descripcion varchar(100) DEFAULT NULL,
  usuarioId int(11) NOT NULL,
  empresaId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3),
  delete tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla movimientoinventario
--

INSERT INTO movimientoinventario (id, productoId, tipo, cantidad, descripcion, usuarioId, empresaId, createdAt, updatedAt, delete) VALUES
(1, 1, 'ENTRADA', 20, 'Compra de producto', 1, 1, '2024-11-11 13:24:21.316', '2024-11-11 13:24:21.316', 0),
(2, 2, 'ENTRADA', 15, 'Compra de producto', 1, 1, '2024-11-11 13:24:21.316', '2024-11-11 13:24:21.316', 0),
(3, 1, 'AJUSTE', -20, 'Ajuste por eliminación de compra', 1, 1, '2024-11-11 15:51:36.524', '2024-11-11 15:51:36.524', 0),
(4, 2, 'AJUSTE', -15, 'Ajuste por eliminación de compra', 1, 1, '2024-11-11 15:51:36.533', '2024-11-11 15:51:36.533', 0),
(5, 1, 'ENTRADA', 15, 'Compra de producto', 1, 1, '2024-11-12 08:00:28.148', '2024-11-12 08:00:28.148', 0),
(6, 1, 'AJUSTE', -15, 'Ajuste por eliminación de compra', 1, 1, '2024-11-12 08:00:44.167', '2024-11-12 08:00:44.167', 0),
(7, 3, 'ENTRADA', 3, 'Compra de producto', 1, 1, '2024-11-12 08:23:43.454', '2024-11-12 08:23:43.454', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla movimientoscaja
--

CREATE TABLE movimientoscaja (
  id int(11) NOT NULL,
  historialCajaId int(11) NOT NULL,
  monto decimal(10,2) NOT NULL DEFAULT 0.00,
  tipo enum('INGRESO','EGRESO','VENTA','INICIAL','CIERRE') NOT NULL,
  descripcion varchar(191) DEFAULT NULL,
  usuarioId int(11) NOT NULL,
  createdAt datetime(3) NOT NULL DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla notificacion
--

CREATE TABLE notificacion (
  id int(11) NOT NULL,
  titulo varchar(100) NOT NULL,
  mensaje text NOT NULL,
  leido tinyint(1) NOT NULL DEFAULT 0,
  fecha datetime(3) NOT NULL DEFAULT current_timestamp(3),
  usuarioId int(11) NOT NULL,
  empresaId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla permiso
--

CREATE TABLE permiso (
  id int(11) NOT NULL,
  nombre varchar(50) NOT NULL,
  descripcion varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla producto
--

CREATE TABLE producto (
  id int(11) NOT NULL,
  codigo varchar(50) DEFAULT NULL,
  nombre varchar(50) NOT NULL,
  precio decimal(10,2) NOT NULL DEFAULT 0.00,
  stock int(11) DEFAULT 0,
  ubicacion varchar(40) DEFAULT NULL,
  descripcion varchar(300) DEFAULT NULL,
  estado enum('INSTOCK','OUTOFSTOCK','LOWSTOCK') NOT NULL DEFAULT 'OUTOFSTOCK',
  categoriaId int(11) NOT NULL,
  subCategoriaId int(11) DEFAULT NULL,
  empresaId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla producto
--

INSERT INTO producto (id, codigo, nombre, precio, stock, ubicacion, descripcion, estado, categoriaId, subCategoriaId, empresaId, createdAt, updatedAt) VALUES
(1, 'CP-D-001', 'Desodorante', 600.00, 0, 'Estante B', 'Marca: Dove, Genero: Unisex', 'OUTOFSTOCK', 3, 12, 1, '2024-11-11 12:38:45.329', '2024-11-12 08:00:44.162'),
(2, 'CP-D-002', 'Desodorante', 650.00, 0, 'Estante B', 'Marca: Dove, Genero: Mujer', 'OUTOFSTOCK', 3, 12, 1, '2024-11-11 12:41:01.617', '2024-11-11 15:51:36.529'),
(3, 'E-M-003', 'Microondas', 4500.00, 3, 'Estante B', '', 'LOWSTOCK', 2, 32, 1, '2024-11-12 08:23:13.693', '2024-11-12 08:23:43.454');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla productoatributo
--

CREATE TABLE productoatributo (
  id int(11) NOT NULL,
  productoId int(11) NOT NULL,
  atributoId int(11) NOT NULL,
  valorAtributoId int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla promocion
--

CREATE TABLE promocion (
  id int(11) NOT NULL,
  nombre varchar(191) NOT NULL,
  descripcion varchar(191) NOT NULL,
  fechaInicio datetime(3) NOT NULL,
  fechaFin datetime(3) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3),
  empresaId int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla promociondetalle
--

CREATE TABLE promociondetalle (
  id int(11) NOT NULL,
  promocionId int(11) NOT NULL,
  productoId int(11) NOT NULL,
  descuentoId int(11) NOT NULL,
  empresaId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla reportefinanciero
--

CREATE TABLE reportefinanciero (
  id int(11) NOT NULL,
  fechaInicio datetime(3) NOT NULL,
  fechaFin datetime(3) NOT NULL,
  totalVentas double NOT NULL DEFAULT 0,
  totalCompras double NOT NULL DEFAULT 0,
  ganancia double NOT NULL DEFAULT 0,
  detalles longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(detalles)),
  empresaId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  delete tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla rolpermiso
--

CREATE TABLE rolpermiso (
  id int(11) NOT NULL,
  rol enum('ADMIN','EMPLEADO','USUARIO','GERENTE') NOT NULL,
  permisoId int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla secuencias
--

CREATE TABLE secuencias (
  id int(11) NOT NULL,
  nombre varchar(10) NOT NULL,
  valor int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla secuencias
--

INSERT INTO secuencias (id, nombre, valor) VALUES
(1, 'producto', 3),
(2, 'factura', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla subcategoria
--

CREATE TABLE subcategoria (
  id int(11) NOT NULL,
  nombre varchar(50) NOT NULL,
  categoriaId int(11) NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla subcategoria
--

INSERT INTO subcategoria (id, nombre, categoriaId, createdAt, updatedAt) VALUES
(1, 'Camisetas', 1, '2024-11-11 12:23:05.751', '2024-11-11 12:23:05.751'),
(2, 'Pantalones', 1, '2024-11-11 12:23:05.751', '2024-11-11 12:23:05.751'),
(3, 'Vestidos', 1, '2024-11-11 12:23:05.751', '2024-11-11 12:23:05.751'),
(4, 'Faldas', 1, '2024-11-11 12:24:30.867', '2024-11-11 12:24:30.867'),
(5, 'Shorts', 1, '2024-11-11 12:24:30.867', '2024-11-11 12:24:30.867'),
(6, 'Chaquetas', 1, '2024-11-11 12:24:30.867', '2024-11-11 12:24:30.867'),
(7, 'Abrigos', 1, '2024-11-11 12:24:30.867', '2024-11-11 12:24:30.867'),
(8, 'Blusas', 1, '2024-11-11 12:24:30.867', '2024-11-11 12:24:30.867'),
(9, 'Sweaters', 1, '2024-11-11 12:24:30.867', '2024-11-11 12:24:30.867'),
(10, 'Trajes', 1, '2024-11-11 12:24:30.867', '2024-11-11 12:24:30.867'),
(11, 'Ropa interior', 1, '2024-11-11 12:24:30.867', '2024-11-11 12:24:30.867'),
(12, 'Desodorantes', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(13, 'Cremas corporales', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(14, 'Lociones', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(15, 'Exfoliantes corporales', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(16, 'Aceites para el cuerpo', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(17, 'Shampoos', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(18, 'Acondicionadores', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(19, 'Mascarillas capilares', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(20, 'Aceites para el cabello', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(21, 'Tratamientos capilares', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(22, 'Pastas de dientes', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(23, 'Enjuagues bucales', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(24, 'Cepillos dentales', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(25, 'Hilo dental', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(26, 'Bloqueadores solares', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(27, 'Bronceadores', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(28, 'Jabones y geles de baño', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(29, 'Toallitas húmedas', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(30, 'Papel higiénico', 3, '2024-11-11 12:29:47.996', '2024-11-11 12:29:47.996'),
(31, 'Camisas', 1, '2024-11-11 12:31:31.133', '2024-11-11 12:31:31.133'),
(32, 'Microondas', 2, '2024-11-12 08:22:35.386', '2024-11-12 08:22:35.386');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla transaccion
--

CREATE TABLE transaccion (
  id int(11) NOT NULL,
  empresaId int(11) NOT NULL,
  compraId int(11) DEFAULT NULL,
  facturaId int(11) DEFAULT NULL,
  tipo enum('VENTA','COMPRA','INVENTARIO') NOT NULL,
  fecha datetime(3) NOT NULL DEFAULT current_timestamp(3),
  monto double NOT NULL,
  createdAt datetime(3) DEFAULT current_timestamp(3),
  delete tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla transaccion
--

INSERT INTO transaccion (id, empresaId, compraId, facturaId, tipo, fecha, monto, createdAt, delete) VALUES
(1, 1, 1, NULL, 'COMPRA', '2024-11-11 13:24:21.316', 17500, '2024-11-11 17:24:21.318', 1),
(2, 1, 2, NULL, 'COMPRA', '2024-11-12 08:00:28.148', 7500, '2024-11-12 12:00:28.151', 1),
(3, 1, 3, NULL, 'COMPRA', '2024-11-12 08:23:43.454', 12000, '2024-11-12 12:23:43.456', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla usuario
--

CREATE TABLE usuario (
  id int(11) NOT NULL,
  nombreUsuario varchar(50) NOT NULL,
  password varchar(100) NOT NULL,
  contactoId int(11) DEFAULT NULL,
  role enum('ADMIN','EMPLEADO','USUARIO','GERENTE') NOT NULL DEFAULT 'EMPLEADO',
  genero enum('MASCULINO','FEMENINO') NOT NULL,
  empresaId int(11) NOT NULL,
  estado enum('HABILITADO','INHABILITADO','PENDIENTE') NOT NULL DEFAULT 'PENDIENTE',
  createdAt datetime(3) DEFAULT current_timestamp(3),
  updatedAt datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla usuario
--

INSERT INTO usuario (id, nombreUsuario, password, contactoId, role, genero, empresaId, estado, createdAt, updatedAt) VALUES
(1, 'malfry.perez', '$2b$10$G2Hjlx/NQ1qqlZcbc.Vee.i5IquVQpnuR32TlAqAe.FeL2brsGI6e', 2, 'ADMIN', 'MASCULINO', 1, 'HABILITADO', '2024-11-11 09:27:14.613', '2024-11-11 09:27:14.613'),
(3, 'milaurys.contreras', '$2b$10$PYjECkrHJTISLEzbLrHv8evBXxY4sBayYaIT7C2u6zPzJJekr7FUq', 3, 'EMPLEADO', 'FEMENINO', 1, 'HABILITADO', '2024-11-11 12:47:13.689', '2024-11-11 17:12:39.480');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla valoratributo
--

CREATE TABLE valoratributo (
  id int(11) NOT NULL,
  valor varchar(50) NOT NULL,
  atributoId int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla _prisma_migrations
--

CREATE TABLE _prisma_migrations (
  id varchar(36) NOT NULL,
  checksum varchar(64) NOT NULL,
  finished_at datetime(3) DEFAULT NULL,
  migration_name varchar(255) NOT NULL,
  logs text DEFAULT NULL,
  rolled_back_at datetime(3) DEFAULT NULL,
  started_at datetime(3) NOT NULL DEFAULT current_timestamp(3),
  applied_steps_count int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla _prisma_migrations
--

INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES
('0184f50a-74c0-42a9-94fd-ebecf93eb3fa', 'e7cbe15cafe19a81535b61ac564f6d784e978acf4145d0ffdd87b6872da3810b', '2024-11-11 13:05:51.355', '20241111130549_init', NULL, NULL, '2024-11-11 13:05:49.568', 1),
('2022e3c6-d8aa-4416-92d9-32305e3626e6', '1ef93785cb57934ba1d4a3c0f6148cba3164655d1c9e809112a91336a6f1ca0c', '2024-11-11 17:56:00.868', '20241111175600_init', NULL, NULL, '2024-11-11 17:56:00.792', 1),
('4c757755-4871-4dbf-8e80-17570d9df376', '7a5dd73d085e35a95d77c43e0621f980ebdeb7a8daa04ff8c5f123d9ea0eab9d', '2024-11-11 18:53:18.309', '20241111185318_init', NULL, NULL, '2024-11-11 18:53:18.299', 1),
('790fd66e-1dd0-4fff-acdd-0e4347b46a1e', 'd3877a006fc7a43dc9adde479725a504f9dfe8144f0c06e91246a27f6e7fe7f1', '2024-11-11 18:54:35.101', '20241111185435_init', NULL, NULL, '2024-11-11 18:54:35.093', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla atributo
--
ALTER TABLE atributo
  ADD PRIMARY KEY (id);

--
-- Indices de la tabla caja
--
ALTER TABLE caja
  ADD PRIMARY KEY (id),
  ADD KEY Caja_nombre_idx (nombre),
  ADD KEY Caja_empresaId_fkey (empresaId),
  ADD KEY Caja_usuarioId_fkey (usuarioId);

--
-- Indices de la tabla categoria
--
ALTER TABLE categoria
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY Categoria_nombre_key (nombre),
  ADD UNIQUE KEY empresa_categoria_unique (empresaId,nombre),
  ADD KEY Categoria_nombre_idx (nombre);

--
-- Indices de la tabla cliente
--
ALTER TABLE cliente
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY Cliente_identificacion_key (identificacion),
  ADD UNIQUE KEY Cliente_contactoId_key (contactoId),
  ADD KEY Cliente_empresaId_fkey (empresaId);

--
-- Indices de la tabla compra
--
ALTER TABLE compra
  ADD PRIMARY KEY (id),
  ADD KEY Compra_createdAt_idx (createdAt),
  ADD KEY Compra_usuarioId_fkey (usuarioId),
  ADD KEY Compra_empresaId_fkey (empresaId);

--
-- Indices de la tabla contacto
--
ALTER TABLE contacto
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY Contacto_email_key (email);

--
-- Indices de la tabla descuento
--
ALTER TABLE descuento
  ADD PRIMARY KEY (id),
  ADD KEY Descuento_empresaId_fkey (empresaId);

--
-- Indices de la tabla descuentocliente
--
ALTER TABLE descuentocliente
  ADD PRIMARY KEY (id),
  ADD KEY DescuentoCliente_descuentoId_fkey (descuentoId),
  ADD KEY DescuentoCliente_clienteId_fkey (clienteId),
  ADD KEY DescuentoCliente_empresaId_fkey (empresaId);

--
-- Indices de la tabla descuentoproducto
--
ALTER TABLE descuentoproducto
  ADD PRIMARY KEY (id),
  ADD KEY DescuentoProducto_descuentoId_fkey (descuentoId),
  ADD KEY DescuentoProducto_productoId_fkey (productoId),
  ADD KEY DescuentoProducto_empresaId_fkey (empresaId);

--
-- Indices de la tabla descuentosubcategoria
--
ALTER TABLE descuentosubcategoria
  ADD PRIMARY KEY (id),
  ADD KEY DescuentoSubcategoria_descuentoId_fkey (descuentoId),
  ADD KEY DescuentoSubcategoria_subCategoriaId_fkey (subCategoriaId),
  ADD KEY DescuentoSubcategoria_empresaId_fkey (empresaId);

--
-- Indices de la tabla detallecompra
--
ALTER TABLE detallecompra
  ADD PRIMARY KEY (id),
  ADD KEY DetalleCompra_compraId_fkey (compraId),
  ADD KEY DetalleCompra_productoId_fkey (productoId),
  ADD KEY DetalleCompra_empresaId_fkey (empresaId);

--
-- Indices de la tabla detallefactura
--
ALTER TABLE detallefactura
  ADD PRIMARY KEY (id),
  ADD KEY detalle_factura_idx (facturaId,productoId),
  ADD KEY DetalleFactura_empresaId_fkey (empresaId),
  ADD KEY DetalleFactura_productoId_fkey (productoId);

--
-- Indices de la tabla devolucioncliente
--
ALTER TABLE devolucioncliente
  ADD PRIMARY KEY (id),
  ADD KEY DevolucionCliente_facturaId_fkey (facturaId),
  ADD KEY DevolucionCliente_productoId_fkey (productoId),
  ADD KEY DevolucionCliente_empresaId_fkey (empresaId),
  ADD KEY DevolucionCliente_usuarioId_fkey (usuarioId);

--
-- Indices de la tabla empresa
--
ALTER TABLE empresa
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY Empresa_contactoId_key (contactoId),
  ADD KEY empresa_nombre_idx (nombre);

--
-- Indices de la tabla factura
--
ALTER TABLE factura
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY Factura_codigo_key (codigo),
  ADD KEY factura_cliente_idx (clienteNombre),
  ADD KEY Factura_createdAt_idx (createdAt),
  ADD KEY Factura_empresaId_fkey (empresaId),
  ADD KEY Factura_usuarioId_fkey (usuarioId),
  ADD KEY Factura_clienteId_fkey (clienteId),
  ADD KEY Factura_cajaId_fkey (cajaId);

--
-- Indices de la tabla gastosoperativos
--
ALTER TABLE gastosoperativos
  ADD PRIMARY KEY (id),
  ADD KEY GastosOperativos_empresaId_fkey (empresaId);

--
-- Indices de la tabla historialcaja
--
ALTER TABLE historialcaja
  ADD PRIMARY KEY (id),
  ADD KEY HistorialCaja_cajaId_fkey (cajaId);

--
-- Indices de la tabla historialdescuentos
--
ALTER TABLE historialdescuentos
  ADD PRIMARY KEY (id),
  ADD KEY HistorialDescuentos_descuentoId_fkey (descuentoId),
  ADD KEY HistorialDescuentos_productoId_fkey (productoId),
  ADD KEY HistorialDescuentos_facturaId_fkey (facturaId),
  ADD KEY HistorialDescuentos_empresaId_fkey (empresaId);

--
-- Indices de la tabla historialprecio
--
ALTER TABLE historialprecio
  ADD PRIMARY KEY (id),
  ADD KEY HistorialPrecio_productoId_fkey (productoId),
  ADD KEY HistorialPrecio_empresaId_fkey (empresaId);

--
-- Indices de la tabla loteproducto
--
ALTER TABLE loteproducto
  ADD PRIMARY KEY (id),
  ADD KEY LoteProducto_productoId_fkey (productoId),
  ADD KEY LoteProducto_empresaId_fkey (empresaId);

--
-- Indices de la tabla movimientoinventario
--
ALTER TABLE movimientoinventario
  ADD PRIMARY KEY (id),
  ADD KEY MovimientoInventario_productoId_fkey (productoId),
  ADD KEY MovimientoInventario_empresaId_fkey (empresaId),
  ADD KEY MovimientoInventario_usuarioId_fkey (usuarioId);

--
-- Indices de la tabla movimientoscaja
--
ALTER TABLE movimientoscaja
  ADD PRIMARY KEY (id),
  ADD KEY MovimientosCaja_historialCajaId_idx (historialCajaId),
  ADD KEY MovimientosCaja_usuarioId_idx (usuarioId);

--
-- Indices de la tabla notificacion
--
ALTER TABLE notificacion
  ADD PRIMARY KEY (id),
  ADD KEY Notificacion_usuarioId_fkey (usuarioId),
  ADD KEY Notificacion_empresaId_fkey (empresaId);

--
-- Indices de la tabla permiso
--
ALTER TABLE permiso
  ADD PRIMARY KEY (id);

--
-- Indices de la tabla producto
--
ALTER TABLE producto
  ADD PRIMARY KEY (id),
  ADD KEY producto_codigo_idx (codigo),
  ADD KEY Producto_nombre_idx (nombre),
  ADD KEY Producto_empresaId_fkey (empresaId),
  ADD KEY Producto_categoriaId_fkey (categoriaId),
  ADD KEY Producto_subCategoriaId_fkey (subCategoriaId);

--
-- Indices de la tabla productoatributo
--
ALTER TABLE productoatributo
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY ProductoAtributo_productoId_valorAtributoId_key (productoId,valorAtributoId),
  ADD KEY ProductoAtributo_valorAtributoId_fkey (valorAtributoId);

--
-- Indices de la tabla promocion
--
ALTER TABLE promocion
  ADD PRIMARY KEY (id),
  ADD KEY Promocion_empresaId_fkey (empresaId);

--
-- Indices de la tabla promociondetalle
--
ALTER TABLE promociondetalle
  ADD PRIMARY KEY (id),
  ADD KEY PromocionDetalle_descuentoId_fkey (descuentoId),
  ADD KEY PromocionDetalle_promocionId_fkey (promocionId),
  ADD KEY PromocionDetalle_productoId_fkey (productoId),
  ADD KEY PromocionDetalle_empresaId_fkey (empresaId);

--
-- Indices de la tabla reportefinanciero
--
ALTER TABLE reportefinanciero
  ADD PRIMARY KEY (id),
  ADD KEY ReporteFinanciero_empresaId_fechaInicio_fechaFin_idx (empresaId,fechaInicio,fechaFin);

--
-- Indices de la tabla rolpermiso
--
ALTER TABLE rolpermiso
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY rol_permiso_unique (rol,permisoId),
  ADD KEY RolPermiso_permisoId_fkey (permisoId);

--
-- Indices de la tabla secuencias
--
ALTER TABLE secuencias
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY Secuencias_id_key (id),
  ADD UNIQUE KEY Secuencias_nombre_key (nombre);

--
-- Indices de la tabla subcategoria
--
ALTER TABLE subcategoria
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY categoria_subcategoria_unique (categoriaId,nombre),
  ADD KEY SubCategoria_nombre_idx (nombre);

--
-- Indices de la tabla transaccion
--
ALTER TABLE transaccion
  ADD PRIMARY KEY (id),
  ADD KEY Transaccion_empresaId_fecha_idx (empresaId,fecha),
  ADD KEY Transaccion_tipo_idx (tipo),
  ADD KEY Transaccion_compraId_fkey (compraId),
  ADD KEY Transaccion_facturaId_fkey (facturaId);

--
-- Indices de la tabla usuario
--
ALTER TABLE usuario
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY Usuario_nombreUsuario_key (nombreUsuario),
  ADD UNIQUE KEY empresa_usuario_unique (empresaId,nombreUsuario),
  ADD UNIQUE KEY Usuario_contactoId_key (contactoId);

--
-- Indices de la tabla valoratributo
--
ALTER TABLE valoratributo
  ADD PRIMARY KEY (id),
  ADD KEY ValorAtributo_atributoId_fkey (atributoId);

--
-- Indices de la tabla _prisma_migrations
--
ALTER TABLE _prisma_migrations
  ADD PRIMARY KEY (id);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla atributo
--
ALTER TABLE atributo
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla caja
--
ALTER TABLE caja
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla categoria
--
ALTER TABLE categoria
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla cliente
--
ALTER TABLE cliente
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla compra
--
ALTER TABLE compra
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla contacto
--
ALTER TABLE contacto
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla descuento
--
ALTER TABLE descuento
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla descuentocliente
--
ALTER TABLE descuentocliente
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla descuentoproducto
--
ALTER TABLE descuentoproducto
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla descuentosubcategoria
--
ALTER TABLE descuentosubcategoria
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla detallecompra
--
ALTER TABLE detallecompra
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla detallefactura
--
ALTER TABLE detallefactura
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla devolucioncliente
--
ALTER TABLE devolucioncliente
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla empresa
--
ALTER TABLE empresa
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla factura
--
ALTER TABLE factura
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla gastosoperativos
--
ALTER TABLE gastosoperativos
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla historialcaja
--
ALTER TABLE historialcaja
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla historialdescuentos
--
ALTER TABLE historialdescuentos
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla historialprecio
--
ALTER TABLE historialprecio
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla loteproducto
--
ALTER TABLE loteproducto
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla movimientoinventario
--
ALTER TABLE movimientoinventario
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla movimientoscaja
--
ALTER TABLE movimientoscaja
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla notificacion
--
ALTER TABLE notificacion
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla permiso
--
ALTER TABLE permiso
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla producto
--
ALTER TABLE producto
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla productoatributo
--
ALTER TABLE productoatributo
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla promocion
--
ALTER TABLE promocion
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla promociondetalle
--
ALTER TABLE promociondetalle
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla reportefinanciero
--
ALTER TABLE reportefinanciero
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla rolpermiso
--
ALTER TABLE rolpermiso
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla secuencias
--
ALTER TABLE secuencias
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla subcategoria
--
ALTER TABLE subcategoria
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla transaccion
--
ALTER TABLE transaccion
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla usuario
--
ALTER TABLE usuario
  MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla valoratributo
--
ALTER TABLE valoratributo
  MODIFY id int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla caja
--
ALTER TABLE caja
  ADD CONSTRAINT Caja_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT Caja_usuarioId_fkey FOREIGN KEY (usuarioId) REFERENCES usuario (id) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla categoria
--
ALTER TABLE categoria
  ADD CONSTRAINT Categoria_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla cliente
--
ALTER TABLE cliente
  ADD CONSTRAINT Cliente_contactoId_fkey FOREIGN KEY (contactoId) REFERENCES contacto (id) ON UPDATE CASCADE,
  ADD CONSTRAINT Cliente_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla compra
--
ALTER TABLE compra
  ADD CONSTRAINT Compra_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT Compra_usuarioId_fkey FOREIGN KEY (usuarioId) REFERENCES usuario (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla descuento
--
ALTER TABLE descuento
  ADD CONSTRAINT Descuento_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla descuentocliente
--
ALTER TABLE descuentocliente
  ADD CONSTRAINT DescuentoCliente_clienteId_fkey FOREIGN KEY (clienteId) REFERENCES cliente (id) ON UPDATE CASCADE,
  ADD CONSTRAINT DescuentoCliente_descuentoId_fkey FOREIGN KEY (descuentoId) REFERENCES descuento (id) ON UPDATE CASCADE,
  ADD CONSTRAINT DescuentoCliente_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla descuentoproducto
--
ALTER TABLE descuentoproducto
  ADD CONSTRAINT DescuentoProducto_descuentoId_fkey FOREIGN KEY (descuentoId) REFERENCES descuento (id) ON UPDATE CASCADE,
  ADD CONSTRAINT DescuentoProducto_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT DescuentoProducto_productoId_fkey FOREIGN KEY (productoId) REFERENCES producto (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla descuentosubcategoria
--
ALTER TABLE descuentosubcategoria
  ADD CONSTRAINT DescuentoSubcategoria_descuentoId_fkey FOREIGN KEY (descuentoId) REFERENCES descuento (id) ON UPDATE CASCADE,
  ADD CONSTRAINT DescuentoSubcategoria_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT DescuentoSubcategoria_subCategoriaId_fkey FOREIGN KEY (subCategoriaId) REFERENCES subcategoria (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla detallecompra
--
ALTER TABLE detallecompra
  ADD CONSTRAINT DetalleCompra_compraId_fkey FOREIGN KEY (compraId) REFERENCES compra (id) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT DetalleCompra_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT DetalleCompra_productoId_fkey FOREIGN KEY (productoId) REFERENCES producto (id) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla detallefactura
--
ALTER TABLE detallefactura
  ADD CONSTRAINT DetalleFactura_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT DetalleFactura_facturaId_fkey FOREIGN KEY (facturaId) REFERENCES factura (id) ON UPDATE CASCADE,
  ADD CONSTRAINT DetalleFactura_productoId_fkey FOREIGN KEY (productoId) REFERENCES producto (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla devolucioncliente
--
ALTER TABLE devolucioncliente
  ADD CONSTRAINT DevolucionCliente_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT DevolucionCliente_facturaId_fkey FOREIGN KEY (facturaId) REFERENCES factura (id) ON UPDATE CASCADE,
  ADD CONSTRAINT DevolucionCliente_productoId_fkey FOREIGN KEY (productoId) REFERENCES producto (id) ON UPDATE CASCADE,
  ADD CONSTRAINT DevolucionCliente_usuarioId_fkey FOREIGN KEY (usuarioId) REFERENCES usuario (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla empresa
--
ALTER TABLE empresa
  ADD CONSTRAINT Empresa_contactoId_fkey FOREIGN KEY (contactoId) REFERENCES contacto (id) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla factura
--
ALTER TABLE factura
  ADD CONSTRAINT Factura_cajaId_fkey FOREIGN KEY (cajaId) REFERENCES caja (id) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT Factura_clienteId_fkey FOREIGN KEY (clienteId) REFERENCES cliente (id) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT Factura_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT Factura_usuarioId_fkey FOREIGN KEY (usuarioId) REFERENCES usuario (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla gastosoperativos
--
ALTER TABLE gastosoperativos
  ADD CONSTRAINT GastosOperativos_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla historialcaja
--
ALTER TABLE historialcaja
  ADD CONSTRAINT HistorialCaja_cajaId_fkey FOREIGN KEY (cajaId) REFERENCES caja (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla historialdescuentos
--
ALTER TABLE historialdescuentos
  ADD CONSTRAINT HistorialDescuentos_descuentoId_fkey FOREIGN KEY (descuentoId) REFERENCES descuento (id) ON UPDATE CASCADE,
  ADD CONSTRAINT HistorialDescuentos_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT HistorialDescuentos_facturaId_fkey FOREIGN KEY (facturaId) REFERENCES factura (id) ON UPDATE CASCADE,
  ADD CONSTRAINT HistorialDescuentos_productoId_fkey FOREIGN KEY (productoId) REFERENCES producto (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla historialprecio
--
ALTER TABLE historialprecio
  ADD CONSTRAINT HistorialPrecio_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT HistorialPrecio_productoId_fkey FOREIGN KEY (productoId) REFERENCES producto (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla loteproducto
--
ALTER TABLE loteproducto
  ADD CONSTRAINT LoteProducto_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT LoteProducto_productoId_fkey FOREIGN KEY (productoId) REFERENCES producto (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla movimientoinventario
--
ALTER TABLE movimientoinventario
  ADD CONSTRAINT MovimientoInventario_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT MovimientoInventario_productoId_fkey FOREIGN KEY (productoId) REFERENCES producto (id) ON UPDATE CASCADE,
  ADD CONSTRAINT MovimientoInventario_usuarioId_fkey FOREIGN KEY (usuarioId) REFERENCES usuario (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla movimientoscaja
--
ALTER TABLE movimientoscaja
  ADD CONSTRAINT MovimientosCaja_historialCajaId_fkey FOREIGN KEY (historialCajaId) REFERENCES historialcaja (id) ON UPDATE CASCADE,
  ADD CONSTRAINT MovimientosCaja_usuarioId_fkey FOREIGN KEY (usuarioId) REFERENCES usuario (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla notificacion
--
ALTER TABLE notificacion
  ADD CONSTRAINT Notificacion_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT Notificacion_usuarioId_fkey FOREIGN KEY (usuarioId) REFERENCES usuario (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla producto
--
ALTER TABLE producto
  ADD CONSTRAINT Producto_categoriaId_fkey FOREIGN KEY (categoriaId) REFERENCES categoria (id) ON UPDATE CASCADE,
  ADD CONSTRAINT Producto_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT Producto_subCategoriaId_fkey FOREIGN KEY (subCategoriaId) REFERENCES subcategoria (id) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla productoatributo
--
ALTER TABLE productoatributo
  ADD CONSTRAINT ProductoAtributo_productoId_fkey FOREIGN KEY (productoId) REFERENCES producto (id) ON UPDATE CASCADE,
  ADD CONSTRAINT ProductoAtributo_valorAtributoId_fkey FOREIGN KEY (valorAtributoId) REFERENCES valoratributo (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla promocion
--
ALTER TABLE promocion
  ADD CONSTRAINT Promocion_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla promociondetalle
--
ALTER TABLE promociondetalle
  ADD CONSTRAINT PromocionDetalle_descuentoId_fkey FOREIGN KEY (descuentoId) REFERENCES descuento (id) ON UPDATE CASCADE,
  ADD CONSTRAINT PromocionDetalle_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT PromocionDetalle_productoId_fkey FOREIGN KEY (productoId) REFERENCES producto (id) ON UPDATE CASCADE,
  ADD CONSTRAINT PromocionDetalle_promocionId_fkey FOREIGN KEY (promocionId) REFERENCES promocion (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla reportefinanciero
--
ALTER TABLE reportefinanciero
  ADD CONSTRAINT ReporteFinanciero_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla rolpermiso
--
ALTER TABLE rolpermiso
  ADD CONSTRAINT RolPermiso_permisoId_fkey FOREIGN KEY (permisoId) REFERENCES permiso (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla subcategoria
--
ALTER TABLE subcategoria
  ADD CONSTRAINT SubCategoria_categoriaId_fkey FOREIGN KEY (categoriaId) REFERENCES categoria (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla transaccion
--
ALTER TABLE transaccion
  ADD CONSTRAINT Transaccion_compraId_fkey FOREIGN KEY (compraId) REFERENCES compra (id) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT Transaccion_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE,
  ADD CONSTRAINT Transaccion_facturaId_fkey FOREIGN KEY (facturaId) REFERENCES factura (id) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla usuario
--
ALTER TABLE usuario
  ADD CONSTRAINT Usuario_contactoId_fkey FOREIGN KEY (contactoId) REFERENCES contacto (id) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT Usuario_empresaId_fkey FOREIGN KEY (empresaId) REFERENCES empresa (id) ON UPDATE CASCADE;

--
-- Filtros para la tabla valoratributo
--
ALTER TABLE valoratributo
  ADD CONSTRAINT ValorAtributo_atributoId_fkey FOREIGN KEY (atributoId) REFERENCES atributo (id) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
