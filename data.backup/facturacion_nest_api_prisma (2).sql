

CREATE TABLE `caja` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` enum('ABIERTA','CERRADA') NOT NULL DEFAULT 'CERRADA',
  `empresaId` int(11) NOT NULL,
  `fechaEntrada` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `ubicacion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `caja`
--

INSERT INTO `caja` (`id`, `nombre`, `estado`, `empresaId`, `fechaEntrada`, `updatedAt`, `ubicacion`) VALUES
(1, 'Caja 1', 'CERRADA', 1, '2024-08-27 08:58:08.000', '2024-10-04 14:58:34.735', 'Sucursal 1'),
(2, 'Caja 2', 'CERRADA', 1, '2024-08-27 12:58:34.000', '2024-09-19 08:32:03.065', 'Sucursal 1'),
(3, 'Caja 3', 'CERRADA', 1, '2024-08-27 12:58:34.000', '2024-09-23 07:01:39.883', 'Sucursal 1');

-- --------------------------------------------------------

--
-- Table structure for table `categoria`
--

CREATE TABLE `categoria` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `empresaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categoria`
--

INSERT INTO `categoria` (`id`, `nombre`, `empresaId`, `createdAt`, `updatedAt`) VALUES
(23, 'Ropa', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(24, 'Cosméticos', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(25, 'Juguetes', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(26, 'Electrodomésticos', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(27, 'Calzados', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(28, 'Productos de higiene', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(29, 'Pampers y productos para bebés', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(30, 'Productos de limpieza', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(31, 'Papel y productos de oficina', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(32, 'Alimentos y bebidas', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(33, 'Hogar y decoración', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(34, 'Salud y bienestar', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(35, 'Accesorios para el hogar', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(36, 'Herramientas y ferretería', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(37, 'Equipos deportivos', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(38, 'Libros y revistas', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(39, 'Productos para mascotas', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(40, 'Electrónica', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(41, 'Muebles', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(42, 'Joyas y relojes', 1, '2024-08-21 10:50:35.483', '2024-08-21 10:50:35.483'),
(49, 'Otra', 1, '2024-10-04 10:00:07.000', '2024-10-04 10:00:07.000');

-- --------------------------------------------------------

--
-- Table structure for table `cliente`
--

CREATE TABLE `cliente` (
  `id` int(11) NOT NULL,
  `identificacion` varchar(50) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `contactoId` int(11) NOT NULL,
  `tipoCliente` enum('FISCAL','FISICO') NOT NULL DEFAULT 'FISICO',
  `empresaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cliente`
--

INSERT INTO `cliente` (`id`, `identificacion`, `nombre`, `contactoId`, `tipoCliente`, `empresaId`, `createdAt`, `updatedAt`) VALUES
(1, '07400052499', 'Malfry Perez', 4, 'FISICO', 1, '2024-09-23 09:35:26.000', '2024-09-23 09:35:26.000');

-- --------------------------------------------------------

--
-- Table structure for table `compra`
--

CREATE TABLE `compra` (
  `id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `usuarioId` int(11) NOT NULL,
  `empresaId` int(11) NOT NULL,
  `moneda` enum('USD','DOP','EU') NOT NULL DEFAULT 'DOP',
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3),
  `proveedorId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `compra`
--

INSERT INTO `compra` (`id`, `total`, `usuarioId`, `empresaId`, `moneda`, `createdAt`, `updatedAt`, `proveedorId`) VALUES
(48, 12500.00, 1, 1, 'DOP', '2024-09-03 09:59:59.950', '2024-09-03 09:59:59.950', 1),
(49, 29000.00, 1, 1, 'DOP', '2024-09-03 15:16:49.006', '2024-09-03 15:16:49.006', 1),
(57, 30000.00, 1, 1, 'DOP', '2024-09-20 16:28:42.048', '2024-09-20 16:28:42.048', 1),
(58, 2500.00, 1, 1, 'DOP', '2024-09-23 15:22:29.942', '2024-09-23 15:22:29.942', 1),
(59, 50000.00, 1, 1, 'DOP', '2024-09-27 11:49:15.064', '2024-09-27 11:49:15.064', 1),
(60, 586300.00, 1, 1, 'DOP', '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154', 1);

-- --------------------------------------------------------

--
-- Table structure for table `contacto`
--

CREATE TABLE `contacto` (
  `id` int(11) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `whatsapp` varchar(15) DEFAULT NULL,
  `instagram` varchar(30) DEFAULT NULL,
  `direccion` varchar(50) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacto`
--

INSERT INTO `contacto` (`id`, `email`, `telefono`, `whatsapp`, `instagram`, `direccion`, `createdAt`, `updatedAt`) VALUES
(1, 'kamilaShop.com', '000-000-0000', '000-000-0000', 'kamilashop', 'Río Limpio', '2024-08-21 10:48:06.250', '2024-08-21 10:48:06.250'),
(2, 'usuario1.com', '000-000-1111', '000-000-1111', 'usuario1', 'Usuario1', '2024-08-21 10:48:33.044', '2024-08-21 10:48:33.044'),
(3, 'Proveedor1.com', '000-000-2222', '000-000-2222', 'Proveedor1', 'Santo domingo', '2024-08-21 10:49:09.865', '2024-08-21 10:49:09.865'),
(4, 'cliente1.com', '000-000-333', '000-000-333', 'cliente1', 'Rio Limpio', '2024-08-21 10:50:11.151', '2024-08-21 10:50:11.151');

-- --------------------------------------------------------

--
-- Table structure for table `descuento`
--

CREATE TABLE `descuento` (
  `id` int(11) NOT NULL,
  `tipo` enum('FIJO','PORCENTUAL','Volumen','CATEGORIA','CLIENTE','PROMOCIONAL') NOT NULL DEFAULT 'PORCENTUAL',
  `valor` decimal(10,2) NOT NULL DEFAULT 0.00,
  `fechaInicio` datetime(3) NOT NULL,
  `fechaFin` datetime(3) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3),
  `condicion` text NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `empresaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `descuentocliente`
--

CREATE TABLE `descuentocliente` (
  `id` int(11) NOT NULL,
  `descuentoId` int(11) NOT NULL,
  `clienteId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3),
  `empresaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `descuentoproducto`
--

CREATE TABLE `descuentoproducto` (
  `id` int(11) NOT NULL,
  `descuentoId` int(11) NOT NULL,
  `productoId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3),
  `empresaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `descuentosubcategoria`
--

CREATE TABLE `descuentosubcategoria` (
  `id` int(11) NOT NULL,
  `descuentoId` int(11) NOT NULL,
  `subCategoriaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3),
  `empresaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detallecompra`
--

CREATE TABLE `detallecompra` (
  `id` int(11) NOT NULL,
  `productoId` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `compraId` int(11) DEFAULT NULL,
  `empresaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3),
  `precioCompra` decimal(10,2) NOT NULL,
  `precioVenta` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `detallecompra`
--

INSERT INTO `detallecompra` (`id`, `productoId`, `cantidad`, `subtotal`, `compraId`, `empresaId`, `createdAt`, `updatedAt`, `precioCompra`, `precioVenta`) VALUES
(44, 4, 5, 12500.00, 48, 1, '2024-09-03 13:59:59.951', '2024-09-03 13:59:59.951', 2500.00, 3000.00),
(45, 6, 20, 10000.00, 49, 1, '2024-09-03 19:16:49.013', '2024-09-03 19:16:49.013', 500.00, 700.00),
(46, 7, 20, 16000.00, 49, 1, '2024-09-03 19:16:49.013', '2024-09-03 19:16:49.013', 800.00, 900.00),
(47, 5, 30, 3000.00, 49, 1, '2024-09-03 19:16:49.013', '2024-09-03 19:16:49.013', 100.00, 150.00),
(48, 4, 10, 30000.00, 57, 1, '2024-09-20 20:28:42.050', '2024-09-20 20:28:42.050', 3000.00, 4000.00),
(49, 6, 5, 2500.00, 58, 1, '2024-09-23 19:22:29.947', '2024-09-23 19:22:29.947', 500.00, 800.00),
(50, 4, 10, 50000.00, 59, 1, '2024-09-27 15:49:15.066', '2024-09-27 15:49:15.066', 5000.00, 6000.00),
(51, 30, 100, 80000.00, 60, 1, '2024-10-04 14:13:07.158', '2024-10-04 14:13:07.158', 800.00, 1200.00),
(52, 39, 20, 20000.00, 60, 1, '2024-10-04 14:13:07.158', '2024-10-04 14:13:07.158', 1000.00, 1500.00),
(53, 38, 50, 35000.00, 60, 1, '2024-10-04 14:13:07.158', '2024-10-04 14:13:07.158', 700.00, 1000.00),
(54, 37, 10, 50000.00, 60, 1, '2024-10-04 14:13:07.158', '2024-10-04 14:13:07.158', 5000.00, 6000.00),
(55, 36, 5, 1500.00, 60, 1, '2024-10-04 14:13:07.158', '2024-10-04 14:13:07.158', 300.00, 350.00),
(56, 35, 10, 30000.00, 60, 1, '2024-10-04 14:13:07.158', '2024-10-04 14:13:07.158', 3000.00, 3500.00),
(57, 34, 50, 300000.00, 60, 1, '2024-10-04 14:13:07.158', '2024-10-04 14:13:07.158', 6000.00, 7000.00),
(58, 33, 26, 20800.00, 60, 1, '2024-10-04 14:13:07.158', '2024-10-04 14:13:07.158', 800.00, 1000.00),
(59, 32, 20, 24000.00, 60, 1, '2024-10-04 14:13:07.158', '2024-10-04 14:13:07.158', 1200.00, 2000.00),
(60, 31, 50, 25000.00, 60, 1, '2024-10-04 14:13:07.158', '2024-10-04 14:13:07.158', 500.00, 700.00);

-- --------------------------------------------------------

--
-- Table structure for table `detallefactura`
--

CREATE TABLE `detallefactura` (
  `id` int(11) NOT NULL,
  `facturaId` int(11) NOT NULL,
  `productoId` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precioUnitario` decimal(10,2) DEFAULT 0.00,
  `importe` decimal(10,2) NOT NULL DEFAULT 0.00,
  `itebis` decimal(10,2) NOT NULL DEFAULT 0.00,
  `empresaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `detallefactura`
--

INSERT INTO `detallefactura` (`id`, `facturaId`, `productoId`, `cantidad`, `precioUnitario`, `importe`, `itebis`, `empresaId`, `createdAt`, `updatedAt`) VALUES
(21, 17, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-03 10:01:24.842', '2024-09-03 10:01:24.842'),
(22, 18, 6, 1, 700.00, 700.00, 0.00, 1, '2024-09-16 14:53:44.311', '2024-09-16 14:53:44.311'),
(23, 20, 6, 1, 700.00, 700.00, 0.00, 1, '2024-09-17 08:01:53.583', '2024-09-17 08:01:53.583'),
(24, 22, 5, 1, 150.00, 150.00, 0.00, 1, '2024-09-17 08:43:12.560', '2024-09-17 08:43:12.560'),
(25, 23, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-17 11:03:45.064', '2024-09-17 11:03:45.064'),
(26, 24, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-17 11:13:08.969', '2024-09-17 11:13:08.970'),
(27, 25, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-17 15:59:56.105', '2024-09-17 15:59:56.105'),
(28, 26, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-20 07:33:27.896', '2024-09-20 07:33:27.896'),
(29, 51, 6, 1, 700.00, 700.00, 0.00, 1, '2024-09-20 14:58:25.233', '2024-09-20 14:58:25.233'),
(30, 52, 6, 2, 700.00, 1400.00, 0.00, 1, '2024-09-20 15:02:54.325', '2024-09-20 15:02:54.325'),
(31, 53, 6, 4, 700.00, 2800.00, 0.00, 1, '2024-09-20 15:11:05.498', '2024-09-20 15:11:05.498'),
(32, 54, 6, 2, 700.00, 1400.00, 0.00, 1, '2024-09-20 16:22:26.706', '2024-09-20 16:22:26.706'),
(33, 55, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-23 10:16:15.213', '2024-09-23 10:16:15.213'),
(34, 56, 6, 1, 700.00, 700.00, 0.00, 1, '2024-09-23 10:19:34.773', '2024-09-23 10:19:34.773'),
(35, 57, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-26 09:00:29.526', '2024-09-26 09:00:29.526'),
(36, 58, 6, 1, 700.00, 700.00, 0.00, 1, '2024-09-27 07:00:38.297', '2024-09-27 07:00:38.297'),
(37, 58, 5, 1, 150.00, 150.00, 0.00, 1, '2024-09-27 07:00:38.297', '2024-09-27 07:00:38.297'),
(38, 58, 7, 1, 900.00, 900.00, 0.00, 1, '2024-09-27 07:00:38.297', '2024-09-27 07:00:38.297'),
(39, 59, 5, 4, 150.00, 600.00, 0.00, 1, '2024-09-27 07:18:46.193', '2024-09-27 07:18:46.193'),
(40, 60, 6, 2, 700.00, 1400.00, 0.00, 1, '2024-09-27 08:18:21.801', '2024-09-27 08:18:21.801'),
(41, 61, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-27 08:25:43.766', '2024-09-27 08:25:43.766'),
(42, 62, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-27 08:50:04.989', '2024-09-27 08:50:04.989'),
(43, 63, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-27 08:50:40.445', '2024-09-27 08:50:40.445'),
(44, 64, 7, 1, 900.00, 900.00, 0.00, 1, '2024-09-27 08:56:26.448', '2024-09-27 08:56:26.448'),
(45, 65, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-27 08:58:26.418', '2024-09-27 08:58:26.418'),
(46, 66, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-27 09:20:28.990', '2024-09-27 09:20:28.990'),
(47, 67, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-27 09:45:31.318', '2024-09-27 09:45:31.319'),
(48, 68, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-27 09:50:28.498', '2024-09-27 09:50:28.498'),
(49, 69, 4, 1, 3000.00, 3000.00, 0.00, 1, '2024-09-27 09:53:23.703', '2024-09-27 09:53:23.703'),
(50, 71, 6, 1, 700.00, 700.00, 0.00, 1, '2024-09-27 10:07:16.752', '2024-09-27 10:07:16.752'),
(51, 72, 6, 1, 700.00, 700.00, 0.00, 1, '2024-09-27 10:10:46.051', '2024-09-27 10:10:46.051'),
(52, 73, 6, 1, 700.00, 700.00, 0.00, 1, '2024-09-27 10:11:19.988', '2024-09-27 10:11:19.988'),
(53, 74, 6, 1, 700.00, 700.00, 0.00, 1, '2024-09-27 10:13:25.309', '2024-09-27 10:13:25.309'),
(54, 75, 7, 1, 900.00, 900.00, 0.00, 1, '2024-09-27 10:14:43.776', '2024-09-27 10:14:43.776'),
(55, 76, 5, 1, 150.00, 150.00, 0.00, 1, '2024-09-27 10:25:22.636', '2024-09-27 10:25:22.636'),
(56, 77, 5, 1, 150.00, 150.00, 0.00, 1, '2024-09-27 10:28:28.544', '2024-09-27 10:28:28.544'),
(57, 78, 6, 1, 700.00, 700.00, 0.00, 1, '2024-09-27 10:33:04.085', '2024-09-27 10:33:04.085'),
(58, 79, 6, 1, 800.00, 800.00, 0.00, 1, '2024-09-27 10:40:23.681', '2024-09-27 10:40:23.681'),
(59, 80, 7, 1, 900.00, 900.00, 0.00, 1, '2024-09-27 10:50:15.973', '2024-09-27 10:50:15.973'),
(60, 81, 6, 1, 800.00, 800.00, 0.00, 1, '2024-09-27 10:54:40.509', '2024-09-27 10:54:40.509'),
(61, 82, 7, 1, 900.00, 900.00, 0.00, 1, '2024-09-27 11:14:13.061', '2024-09-27 11:14:13.061'),
(62, 82, 5, 1, 150.00, 150.00, 0.00, 1, '2024-09-27 11:14:13.061', '2024-09-27 11:14:13.061'),
(63, 82, 6, 1, 800.00, 800.00, 0.00, 1, '2024-09-27 11:14:13.061', '2024-09-27 11:14:13.061'),
(64, 83, 5, 1, 150.00, 150.00, 0.00, 1, '2024-09-30 15:50:21.164', '2024-09-30 15:50:21.164'),
(65, 84, 5, 2, 150.00, 300.00, 0.00, 1, '2024-10-01 12:50:11.533', '2024-10-01 12:50:11.533'),
(66, 84, 4, 1, 6000.00, 6000.00, 0.00, 1, '2024-10-01 12:50:11.533', '2024-10-01 12:50:11.533'),
(67, 85, 5, 2, 150.00, 300.00, 0.00, 1, '2024-10-01 14:06:42.828', '2024-10-01 14:06:42.828'),
(68, 85, 4, 1, 6000.00, 6000.00, 0.00, 1, '2024-10-01 14:06:42.828', '2024-10-01 14:06:42.828'),
(69, 86, 5, 2, 150.00, 300.00, 0.00, 1, '2024-10-01 14:06:44.639', '2024-10-01 14:06:44.639'),
(70, 86, 4, 1, 6000.00, 6000.00, 0.00, 1, '2024-10-01 14:06:44.639', '2024-10-01 14:06:44.639'),
(71, 87, 5, 2, 150.00, 300.00, 0.00, 1, '2024-10-01 14:06:45.862', '2024-10-01 14:06:45.862'),
(72, 87, 4, 1, 6000.00, 6000.00, 0.00, 1, '2024-10-01 14:06:45.862', '2024-10-01 14:06:45.862'),
(73, 88, 5, 9, 150.00, 1350.00, 0.00, 1, '2024-10-01 14:39:17.348', '2024-10-01 14:39:17.348'),
(74, 88, 4, 1, 6000.00, 6000.00, 0.00, 1, '2024-10-01 14:39:17.348', '2024-10-01 14:39:17.348'),
(76, 90, 4, 1, 6000.00, 6000.00, 0.00, 1, '2024-10-01 14:52:33.644', '2024-10-01 14:52:33.644'),
(77, 91, 4, 1, 6000.00, 6000.00, 0.00, 1, '2024-10-01 14:53:19.605', '2024-10-01 14:53:19.605'),
(78, 92, 5, 1, 150.00, 150.00, 0.00, 1, '2024-10-01 15:16:45.786', '2024-10-01 15:16:45.786'),
(79, 93, 7, 1, 900.00, 900.00, 0.00, 1, '2024-10-01 15:17:26.082', '2024-10-01 15:17:26.082'),
(80, 94, 4, 1, 6000.00, 6000.00, 0.00, 1, '2024-10-01 15:18:55.643', '2024-10-01 15:18:55.643'),
(81, 95, 4, 1, 6000.00, 6000.00, 0.00, 1, '2024-10-01 15:19:57.348', '2024-10-01 15:19:57.348'),
(82, 96, 4, 1, 6000.00, 6000.00, 0.00, 1, '2024-10-01 15:24:52.095', '2024-10-01 15:24:52.095'),
(83, 98, 6, 1, 800.00, 800.00, 0.00, 1, '2024-10-01 15:35:11.225', '2024-10-01 15:35:11.225'),
(84, 99, 7, 2, 900.00, 1800.00, 0.00, 1, '2024-10-01 15:50:22.842', '2024-10-01 15:50:22.842'),
(85, 101, 7, 1, 900.00, 900.00, 0.00, 1, '2024-10-02 07:41:02.981', '2024-10-02 07:41:02.981'),
(86, 138, 5, 1, 150.00, 150.00, 0.00, 1, '2024-10-02 15:55:49.998', '2024-10-02 15:55:49.998'),
(87, 139, 5, 1, 150.00, 150.00, 0.00, 1, '2024-10-03 07:52:25.884', '2024-10-03 07:52:25.884'),
(88, 139, 7, 1, 900.00, 900.00, 0.00, 1, '2024-10-03 07:52:25.884', '2024-10-03 07:52:25.884'),
(89, 141, 6, 1, 800.00, 800.00, 0.00, 1, '2024-10-03 08:23:12.648', '2024-10-03 08:23:12.648'),
(90, 142, 7, 1, 900.00, 900.00, 0.00, 1, '2024-10-03 08:25:15.567', '2024-10-03 08:25:15.567'),
(91, 143, 7, 1, 900.00, 900.00, 0.00, 1, '2024-10-03 08:34:37.909', '2024-10-03 08:34:37.909'),
(92, 144, 7, 1, 900.00, 900.00, 0.00, 1, '2024-10-03 09:03:37.184', '2024-10-03 09:03:37.184'),
(93, 145, 7, 1, 900.00, 900.00, 0.00, 1, '2024-10-03 09:04:49.994', '2024-10-03 09:04:49.994'),
(94, 146, 7, 1, 900.00, 900.00, 0.00, 1, '2024-10-03 09:11:38.703', '2024-10-03 09:11:38.703'),
(95, 147, 7, 1, 900.00, 900.00, 0.00, 1, '2024-10-03 09:58:57.829', '2024-10-03 09:58:57.829'),
(96, 148, 7, 1, 900.00, 900.00, 0.00, 1, '2024-10-03 10:04:38.898', '2024-10-03 10:04:38.898'),
(97, 149, 7, 1, 900.00, 900.00, 0.00, 1, '2024-10-03 10:38:43.769', '2024-10-03 10:38:43.769'),
(98, 150, 7, 1, 900.00, 900.00, 0.00, 1, '2024-10-03 10:45:35.248', '2024-10-03 10:45:35.248'),
(99, 151, 7, 1, 900.00, 900.00, 0.00, 1, '2024-10-03 12:26:37.064', '2024-10-03 12:26:37.064'),
(100, 152, 31, 2, 700.00, 1400.00, 0.00, 1, '2024-10-04 10:15:06.936', '2024-10-04 10:15:06.936'),
(101, 153, 32, 1, 2000.00, 2000.00, 0.00, 1, '2024-10-04 15:00:12.095', '2024-10-04 15:00:12.095'),
(102, 154, 32, 1, 2000.00, 2000.00, 0.00, 1, '2024-10-04 15:02:08.079', '2024-10-04 15:02:08.079'),
(103, 155, 31, 1, 700.00, 700.00, 0.00, 1, '2024-10-04 15:30:45.073', '2024-10-04 15:30:45.073'),
(104, 155, 35, 1, 3500.00, 3500.00, 0.00, 1, '2024-10-04 15:30:45.073', '2024-10-04 15:30:45.073');

-- --------------------------------------------------------

--
-- Table structure for table `devolucioncliente`
--

CREATE TABLE `devolucioncliente` (
  `id` int(11) NOT NULL,
  `facturaId` int(11) NOT NULL,
  `productoId` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `motivo` varchar(100) NOT NULL,
  `fecha` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `usuarioId` int(11) NOT NULL,
  `empresaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `devolucionproveedor`
--

CREATE TABLE `devolucionproveedor` (
  `id` int(11) NOT NULL,
  `compraId` int(11) NOT NULL,
  `productoId` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `motivo` varchar(100) NOT NULL,
  `fecha` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `usuarioId` int(11) NOT NULL,
  `empresaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `empresa`
--

CREATE TABLE `empresa` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `contactoId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `empresa`
--

INSERT INTO `empresa` (`id`, `nombre`, `descripcion`, `contactoId`, `createdAt`, `updatedAt`) VALUES
(1, 'Kamila Shop', 'Tienda lider', 1, '2024-08-21 10:50:28.193', '2024-08-21 10:50:28.193');

-- --------------------------------------------------------

--
-- Table structure for table `factura`
--

CREATE TABLE `factura` (
  `id` int(11) NOT NULL,
  `codigo` varchar(191) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `itebisTotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `metodoPago` enum('EFECTIVO','TRANSFERENCIA','TARJETA') NOT NULL DEFAULT 'EFECTIVO',
  `usuarioId` int(11) NOT NULL,
  `clienteId` int(11) DEFAULT NULL,
  `clienteNombre` varchar(50) DEFAULT NULL,
  `empresaId` int(11) NOT NULL,
  `estado` enum('CANCELADA','PAGADA') NOT NULL DEFAULT 'PAGADA',
  `moneda` enum('USD','DOP','EU') NOT NULL DEFAULT 'DOP',
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3),
  `cajaId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `factura`
--

INSERT INTO `factura` (`id`, `codigo`, `subtotal`, `total`, `itebisTotal`, `metodoPago`, `usuarioId`, `clienteId`, `clienteNombre`, `empresaId`, `estado`, `moneda`, `createdAt`, `updatedAt`, `cajaId`) VALUES
(17, 'FACT-17', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, 'Cliente 1', 1, 'PAGADA', 'DOP', '2024-09-03 10:01:24.830', '2024-09-03 10:01:24.879', 1),
(18, 'FACT-18', 700.00, 700.00, 0.00, 'EFECTIVO', 1, NULL, 'Cliente 1', 1, 'PAGADA', 'DOP', '2024-09-16 14:53:44.302', '2024-09-16 14:53:44.352', 1),
(20, 'FACT-20', 700.00, 700.00, 0.00, 'EFECTIVO', 1, NULL, 'Cliente 1', 1, 'PAGADA', 'DOP', '2024-09-17 08:01:53.583', '2024-09-17 08:01:53.622', 1),
(22, 'FACT-22', 150.00, 150.00, 0.00, 'EFECTIVO', 1, NULL, 'Cliente 1', 1, 'PAGADA', 'DOP', '2024-09-17 08:43:12.560', '2024-09-17 08:43:12.608', 1),
(23, 'FACT-23', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, 'Malfry Pérez', 1, 'PAGADA', 'DOP', '2024-09-17 11:03:45.064', '2024-09-17 11:03:45.114', 1),
(24, 'FACT-24', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-17 11:13:08.969', '2024-09-17 11:13:09.017', 1),
(25, 'FACT-25', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, 'Malfry Perez', 1, 'PAGADA', 'DOP', '2024-09-17 15:59:56.105', '2024-09-17 15:59:56.224', 1),
(26, 'FACT-26', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-09-20 07:33:27.896', '2024-09-20 07:33:28.000', 1),
(51, 'FACT-51', 700.00, 700.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-09-20 14:58:25.233', '2024-09-20 14:58:25.300', 1),
(52, 'FACT-52', 1400.00, 1400.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-09-20 15:02:54.325', '2024-09-20 15:02:54.357', 1),
(53, 'FACT-53', 2800.00, 2800.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-09-20 15:11:05.498', '2024-09-20 15:11:05.529', 3),
(54, 'FACT-54', 1400.00, 1400.00, 0.00, 'EFECTIVO', 1, NULL, 'Fran', 1, 'PAGADA', 'DOP', '2024-09-20 16:22:26.706', '2024-09-20 16:22:26.743', 3),
(55, 'FACT-55', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, 'Malfry Perez', 1, 'PAGADA', 'DOP', '2024-09-23 10:16:15.213', '2024-09-23 10:16:15.284', 1),
(56, 'FACT-56', 700.00, 700.00, 0.00, 'EFECTIVO', 1, 1, 'Malfry Perez', 1, 'PAGADA', 'DOP', '2024-09-23 10:19:34.773', '2024-09-23 10:19:34.805', 1),
(57, 'FACT-57', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, 1, 'Malfry Perez', 1, 'PAGADA', 'DOP', '2024-09-26 09:00:29.526', '2024-09-26 09:00:29.573', 1),
(58, 'FACT-58', 1750.00, 1750.00, 0.00, 'EFECTIVO', 1, 1, 'Malfry Perez', 1, 'PAGADA', 'DOP', '2024-09-27 07:00:38.297', '2024-09-27 07:00:38.375', 1),
(59, 'FACT-59', 600.00, 600.00, 0.00, 'EFECTIVO', 1, 1, 'Malfry Perez', 1, 'PAGADA', 'DOP', '2024-09-27 07:18:46.193', '2024-09-27 07:18:46.255', 1),
(60, 'FACT-60', 1400.00, 1400.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 08:18:21.801', '2024-09-27 08:18:21.849', 1),
(61, 'FACT-61', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 08:25:43.766', '2024-09-27 08:25:43.800', 1),
(62, 'FACT-62', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 08:50:04.989', '2024-09-27 08:50:05.019', 1),
(63, 'FACT-63', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 08:50:40.445', '2024-09-27 08:50:40.485', 1),
(64, 'FACT-64', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 08:56:26.448', '2024-09-27 08:56:26.479', 1),
(65, 'FACT-65', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 08:58:26.418', '2024-09-27 08:58:26.459', 1),
(66, 'FACT-66', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 09:20:28.990', '2024-09-27 09:20:29.025', 1),
(67, 'FACT-67', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 09:45:31.318', '2024-09-27 09:45:31.373', 1),
(68, 'FACT-68', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 09:50:28.498', '2024-09-27 09:50:28.532', 1),
(69, 'FACT-69', 3000.00, 3000.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 09:53:23.703', '2024-09-27 09:53:23.731', 1),
(71, 'FACT-71', 700.00, 700.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 10:07:16.752', '2024-09-27 10:07:16.797', 1),
(72, 'FACT-72', 700.00, 700.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 10:10:46.051', '2024-09-27 10:10:46.081', 1),
(73, 'FACT-73', 700.00, 700.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 10:11:19.988', '2024-09-27 10:11:20.019', 1),
(74, 'FACT-74', 700.00, 700.00, 0.00, 'EFECTIVO', 1, NULL, 'Malfry Perez', 1, 'PAGADA', 'DOP', '2024-09-27 10:13:25.309', '2024-09-27 10:13:25.328', 1),
(75, 'FACT-75', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, 'Malfry Perez', 1, 'PAGADA', 'DOP', '2024-09-27 10:14:43.776', '2024-09-27 10:14:43.812', 1),
(76, 'FACT-76', 150.00, 150.00, 0.00, 'EFECTIVO', 1, NULL, 'Malfry Perez', 1, 'PAGADA', 'DOP', '2024-09-27 10:25:22.636', '2024-09-27 10:25:22.673', 1),
(77, 'FACT-77', 150.00, 150.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-09-27 10:28:28.544', '2024-09-27 10:28:28.583', 1),
(78, 'FACT-78', 700.00, 700.00, 0.00, 'EFECTIVO', 1, NULL, 'Malfry Perez', 1, 'PAGADA', 'DOP', '2024-09-27 10:33:04.085', '2024-09-27 10:33:04.127', 1),
(79, 'FACT-79', 800.00, 800.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 10:40:23.681', '2024-09-27 10:40:23.727', 1),
(80, 'FACT-80', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 10:50:15.973', '2024-09-27 10:50:16.015', 1),
(81, 'FACT-81', 800.00, 800.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-09-27 10:54:40.509', '2024-09-27 10:54:40.542', 1),
(82, 'FACT-82', 1850.00, 1850.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-27 11:14:13.061', '2024-09-27 11:14:13.131', 1),
(83, 'FACT-83', 150.00, 150.00, 0.00, 'EFECTIVO', 1, NULL, 'Milaurys Contreras', 1, 'PAGADA', 'DOP', '2024-09-30 15:50:21.164', '2024-09-30 15:50:21.227', 1),
(84, 'FACT-84', 6300.00, 6300.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 12:50:11.533', '2024-10-01 12:50:11.598', 1),
(85, 'FACT-85', 6300.00, 6300.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 14:06:42.828', '2024-10-01 14:06:42.855', 1),
(86, 'FACT-86', 6300.00, 6300.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 14:06:44.639', '2024-10-01 14:06:44.668', 1),
(87, 'FACT-87', 6300.00, 6300.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 14:06:45.862', '2024-10-01 14:06:45.888', 1),
(88, 'FACT-88', 7350.00, 7350.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 14:39:17.348', '2024-10-01 14:39:17.384', 1),
(90, 'FACT-90', 6000.00, 6000.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 14:52:33.644', '2024-10-01 14:52:33.670', 1),
(91, 'FACT-91', 6000.00, 6000.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 14:53:19.605', '2024-10-01 14:53:19.625', 1),
(92, 'FACT-92', 150.00, 150.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 15:16:45.786', '2024-10-01 15:16:45.812', 1),
(93, 'FACT-93', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 15:17:26.082', '2024-10-01 15:17:26.104', 1),
(94, 'FACT-94', 6000.00, 6000.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 15:18:55.643', '2024-10-01 15:18:55.664', 1),
(95, 'FACT-95', 6000.00, 6000.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 15:19:57.348', '2024-10-01 15:19:57.392', 1),
(96, 'FACT-96', 6000.00, 6000.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 15:24:52.095', '2024-10-01 15:24:52.117', 1),
(98, 'FACT-98', 800.00, 800.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 15:35:11.225', '2024-10-01 15:35:11.250', 1),
(99, 'FACT-99', 1800.00, 1800.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-01 15:50:22.842', '2024-10-01 15:50:22.868', 1),
(101, 'FACT-101', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-02 07:41:02.981', '2024-10-02 07:41:03.036', 1),
(138, 'FACT-138', 150.00, 150.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-02 15:55:49.998', '2024-10-02 15:55:50.055', 1),
(139, 'FACT-139', 1050.00, 1050.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-03 07:52:25.884', '2024-10-03 07:52:25.934', 1),
(141, 'FACT-141', 800.00, 800.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-03 08:23:12.648', '2024-10-03 08:23:12.675', 1),
(142, 'FACT-142', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-03 08:25:15.567', '2024-10-03 08:25:15.595', 1),
(143, 'FACT-143', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-03 08:34:37.909', '2024-10-03 08:34:37.938', 1),
(144, 'FACT-144', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-03 09:03:37.184', '2024-10-03 09:03:37.246', 1),
(145, 'FACT-145', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-03 09:04:49.994', '2024-10-03 09:04:50.014', 1),
(146, 'FACT-146', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-03 09:11:38.703', '2024-10-03 09:11:38.732', 1),
(147, 'FACT-147', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-03 09:58:57.829', '2024-10-03 09:58:57.874', 1),
(148, 'FACT-148', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-03 10:04:38.898', '2024-10-03 10:04:38.930', 1),
(149, 'FACT-149', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-03 10:38:43.769', '2024-10-03 10:38:43.800', 1),
(150, 'FACT-150', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-03 10:45:35.248', '2024-10-03 10:45:35.275', 1),
(151, 'FACT-151', 900.00, 900.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-03 12:26:37.064', '2024-10-03 12:26:37.114', 1),
(152, 'FACT-152', 1400.00, 1400.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-04 10:15:06.936', '2024-10-04 10:15:06.957', 1),
(153, 'FACT-153', 2000.00, 2000.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-04 15:00:12.095', '2024-10-04 15:00:12.128', 1),
(154, 'FACT-154', 2000.00, 2000.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-04 15:02:08.079', '2024-10-04 15:02:08.098', 1),
(155, 'FACT-155', 4200.00, 4200.00, 0.00, 'EFECTIVO', 1, NULL, '', 1, 'PAGADA', 'DOP', '2024-10-04 15:30:45.073', '2024-10-04 15:30:45.111', 1);

-- --------------------------------------------------------

--
-- Table structure for table `historialcaja`
--

CREATE TABLE `historialcaja` (
  `id` int(11) NOT NULL,
  `cajaId` int(11) NOT NULL,
  `montoInicial` decimal(10,2) NOT NULL DEFAULT 0.00,
  `montoFinal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `estado` enum('ABIERTA','CERRADA') NOT NULL DEFAULT 'ABIERTA',
  `fechaApertura` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `fechaCierre` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `historialcaja`
--

INSERT INTO `historialcaja` (`id`, `cajaId`, `montoInicial`, `montoFinal`, `estado`, `fechaApertura`, `fechaCierre`, `createdAt`, `updatedAt`) VALUES
(33, 1, 3000.00, 0.00, 'ABIERTA', '2024-09-03 08:40:32.832', NULL, '2024-09-03 08:40:32.832', '2024-09-03 08:40:32.832'),
(34, 1, 5000.00, 0.00, 'ABIERTA', '2024-09-03 10:00:51.684', NULL, '2024-09-03 10:00:51.684', '2024-09-03 10:00:51.684'),
(35, 1, 20.00, 25.00, 'CERRADA', '2024-09-03 12:28:24.068', '2024-09-03 12:28:35.537', '2024-09-03 12:28:24.068', '2024-09-03 12:28:35.537'),
(36, 1, 20000.00, 20000.00, 'CERRADA', '2024-09-04 08:34:58.752', '2024-09-04 08:38:10.608', '2024-09-04 08:34:58.752', '2024-09-04 08:38:10.608'),
(37, 1, 2000.00, 2000.00, 'CERRADA', '2024-09-16 14:53:07.652', '2024-09-16 15:27:35.485', '2024-09-16 14:53:07.652', '2024-09-16 15:27:35.485'),
(38, 2, 2000.00, 20000.00, 'CERRADA', '2024-09-17 07:17:28.011', '2024-09-19 08:32:03.065', '2024-09-17 07:17:28.011', '2024-09-19 08:32:03.065'),
(39, 1, 1000.00, 20.00, 'CERRADA', '2024-09-19 08:35:53.248', '2024-09-19 09:27:45.716', '2024-09-19 08:35:53.248', '2024-09-19 09:27:45.716'),
(40, 1, 1000.00, 2000.00, 'CERRADA', '2024-09-19 09:28:43.203', '2024-09-20 14:16:19.500', '2024-09-19 09:28:43.203', '2024-09-20 14:16:19.500'),
(41, 1, 5000.00, 25.00, 'CERRADA', '2024-09-20 14:47:28.821', '2024-09-20 14:51:32.664', '2024-09-20 14:47:28.821', '2024-09-20 14:51:32.664'),
(42, 3, 5000.00, 3.00, 'CERRADA', '2024-09-20 14:51:43.271', '2024-09-20 15:10:15.962', '2024-09-20 14:51:43.271', '2024-09-20 15:10:15.962'),
(43, 3, 1000.00, 3200.00, 'CERRADA', '2024-09-20 15:10:45.914', '2024-09-23 07:01:39.883', '2024-09-20 15:10:45.914', '2024-09-23 07:01:39.883'),
(44, 1, 100.00, 3700.00, 'CERRADA', '2024-09-23 09:28:13.711', '2024-09-23 10:23:45.370', '2024-09-23 09:28:13.711', '2024-09-23 10:23:45.370'),
(45, 1, 1000.00, 1000.00, 'CERRADA', '2024-09-23 10:32:59.455', '2024-09-26 08:59:34.964', '2024-09-23 10:32:59.455', '2024-09-26 08:59:34.964'),
(46, 1, 1000.00, 1400.00, 'CERRADA', '2024-09-26 08:59:43.313', '2024-10-04 14:58:34.735', '2024-09-26 08:59:43.313', '2024-10-04 14:58:34.735');

-- --------------------------------------------------------

--
-- Table structure for table `historialdescuentos`
--

CREATE TABLE `historialdescuentos` (
  `id` int(11) NOT NULL,
  `descuentoId` int(11) NOT NULL,
  `productoId` int(11) NOT NULL,
  `facturaId` int(11) NOT NULL,
  `fechaAplicacion` datetime(3) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL DEFAULT 0.00,
  `valorDescuento` decimal(10,2) NOT NULL DEFAULT 0.00,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3),
  `empresaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `historialprecio`
--

CREATE TABLE `historialprecio` (
  `id` int(11) NOT NULL,
  `productoId` int(11) NOT NULL,
  `precioAnterior` decimal(10,2) NOT NULL,
  `precioNuevo` decimal(10,2) NOT NULL,
  `fechaCambio` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `empresaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loteproducto`
--

CREATE TABLE `loteproducto` (
  `id` int(11) NOT NULL,
  `productoId` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `empresaId` int(11) NOT NULL,
  `fechaEntrada` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3),
  `precioVenta` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `loteproducto`
--

INSERT INTO `loteproducto` (`id`, `productoId`, `cantidad`, `empresaId`, `fechaEntrada`, `updatedAt`, `precioVenta`) VALUES
(44, 4, 0, 1, '2024-09-03 09:59:59.950', '2024-09-20 11:33:27.909', 3000.00),
(45, 6, 0, 1, '2024-09-03 15:16:49.006', '2024-09-27 14:33:04.086', 700.00),
(46, 7, 0, 1, '2024-09-03 15:16:49.006', '2024-10-03 16:26:37.066', 900.00),
(47, 5, 0, 1, '2024-09-03 15:16:49.006', '2024-10-03 11:52:25.889', 150.00),
(48, 4, 0, 1, '2024-09-20 16:28:42.048', '2024-09-27 13:53:23.705', 4000.00),
(49, 6, 0, 1, '2024-09-23 15:22:29.942', '2024-10-03 12:23:12.651', 800.00),
(50, 4, 0, 1, '2024-09-27 11:49:15.064', '2024-10-01 19:24:52.097', 6000.00),
(51, 30, 100, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154', 1200.00),
(52, 39, 20, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154', 1500.00),
(53, 38, 50, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154', 1000.00),
(54, 37, 10, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154', 6000.00),
(55, 36, 5, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154', 350.00),
(56, 35, 9, 1, '2024-10-04 10:13:07.154', '2024-10-04 19:30:45.075', 3500.00),
(57, 34, 50, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154', 7000.00),
(58, 33, 26, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154', 1000.00),
(59, 32, 18, 1, '2024-10-04 10:13:07.154', '2024-10-04 19:02:08.080', 2000.00),
(60, 31, 47, 1, '2024-10-04 10:13:07.154', '2024-10-04 19:30:45.075', 700.00);

-- --------------------------------------------------------

--
-- Table structure for table `movimientoinventario`
--

CREATE TABLE `movimientoinventario` (
  `id` int(11) NOT NULL,
  `productoId` int(11) NOT NULL,
  `tipo` enum('ENTRADA','SALIDA') NOT NULL DEFAULT 'ENTRADA',
  `cantidad` int(11) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `usuarioId` int(11) NOT NULL,
  `empresaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `movimientoinventario`
--

INSERT INTO `movimientoinventario` (`id`, `productoId`, `tipo`, `cantidad`, `descripcion`, `usuarioId`, `empresaId`, `createdAt`, `updatedAt`) VALUES
(57, 4, 'ENTRADA', 5, 'Compra de producto', 1, 1, '2024-09-03 09:59:59.950', '2024-09-03 09:59:59.950'),
(58, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-17', 1, 1, '2024-09-03 10:01:24.870', '2024-09-03 10:01:24.870'),
(59, 6, 'ENTRADA', 20, 'Compra de producto', 1, 1, '2024-09-03 15:16:49.006', '2024-09-03 15:16:49.006'),
(60, 7, 'ENTRADA', 20, 'Compra de producto', 1, 1, '2024-09-03 15:16:49.006', '2024-09-03 15:16:49.006'),
(61, 5, 'ENTRADA', 30, 'Compra de producto', 1, 1, '2024-09-03 15:16:49.006', '2024-09-03 15:16:49.006'),
(62, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-18', 1, 1, '2024-09-16 14:53:44.338', '2024-09-16 14:53:44.338'),
(63, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-20', 1, 1, '2024-09-17 08:01:53.583', '2024-09-17 08:01:53.583'),
(64, 5, 'SALIDA', 1, 'Venta de producto en factura FACT-22', 1, 1, '2024-09-17 08:43:12.560', '2024-09-17 08:43:12.560'),
(65, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-23', 1, 1, '2024-09-17 11:03:45.064', '2024-09-17 11:03:45.064'),
(66, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-24', 1, 1, '2024-09-17 11:13:08.969', '2024-09-17 11:13:08.970'),
(67, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-25', 1, 1, '2024-09-17 15:59:56.105', '2024-09-17 15:59:56.105'),
(68, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-26', 1, 1, '2024-09-20 07:33:27.896', '2024-09-20 07:33:27.896'),
(69, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-51', 1, 1, '2024-09-20 14:58:25.233', '2024-09-20 14:58:25.233'),
(70, 6, 'SALIDA', 2, 'Venta de producto en factura FACT-52', 1, 1, '2024-09-20 15:02:54.325', '2024-09-20 15:02:54.325'),
(71, 6, 'SALIDA', 4, 'Venta de producto en factura FACT-53', 1, 1, '2024-09-20 15:11:05.498', '2024-09-20 15:11:05.498'),
(72, 6, 'SALIDA', 2, 'Venta de producto en factura FACT-54', 1, 1, '2024-09-20 16:22:26.706', '2024-09-20 16:22:26.706'),
(73, 4, 'ENTRADA', 10, 'Compra de producto', 1, 1, '2024-09-20 16:28:42.048', '2024-09-20 16:28:42.048'),
(74, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-55', 1, 1, '2024-09-23 10:16:15.213', '2024-09-23 10:16:15.213'),
(75, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-56', 1, 1, '2024-09-23 10:19:34.773', '2024-09-23 10:19:34.773'),
(76, 6, 'ENTRADA', 5, 'Compra de producto', 1, 1, '2024-09-23 15:22:29.942', '2024-09-23 15:22:29.942'),
(77, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-57', 1, 1, '2024-09-26 09:00:29.526', '2024-09-26 09:00:29.526'),
(78, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-58', 1, 1, '2024-09-27 07:00:38.297', '2024-09-27 07:00:38.297'),
(79, 5, 'SALIDA', 1, 'Venta de producto en factura FACT-58', 1, 1, '2024-09-27 07:00:38.297', '2024-09-27 07:00:38.297'),
(80, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-58', 1, 1, '2024-09-27 07:00:38.297', '2024-09-27 07:00:38.297'),
(81, 5, 'SALIDA', 4, 'Venta de producto en factura FACT-59', 1, 1, '2024-09-27 07:18:46.193', '2024-09-27 07:18:46.193'),
(82, 6, 'SALIDA', 2, 'Venta de producto en factura FACT-60', 1, 1, '2024-09-27 08:18:21.801', '2024-09-27 08:18:21.801'),
(83, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-61', 1, 1, '2024-09-27 08:25:43.766', '2024-09-27 08:25:43.766'),
(84, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-62', 1, 1, '2024-09-27 08:50:04.989', '2024-09-27 08:50:04.989'),
(85, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-63', 1, 1, '2024-09-27 08:50:40.445', '2024-09-27 08:50:40.445'),
(86, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-64', 1, 1, '2024-09-27 08:56:26.448', '2024-09-27 08:56:26.448'),
(87, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-65', 1, 1, '2024-09-27 08:58:26.418', '2024-09-27 08:58:26.418'),
(88, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-66', 1, 1, '2024-09-27 09:20:28.990', '2024-09-27 09:20:28.990'),
(89, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-67', 1, 1, '2024-09-27 09:45:31.318', '2024-09-27 09:45:31.319'),
(90, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-68', 1, 1, '2024-09-27 09:50:28.498', '2024-09-27 09:50:28.498'),
(91, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-69', 1, 1, '2024-09-27 09:53:23.703', '2024-09-27 09:53:23.703'),
(92, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-71', 1, 1, '2024-09-27 10:07:16.752', '2024-09-27 10:07:16.752'),
(93, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-72', 1, 1, '2024-09-27 10:10:46.051', '2024-09-27 10:10:46.051'),
(94, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-73', 1, 1, '2024-09-27 10:11:19.988', '2024-09-27 10:11:19.988'),
(95, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-74', 1, 1, '2024-09-27 10:13:25.309', '2024-09-27 10:13:25.309'),
(96, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-75', 1, 1, '2024-09-27 10:14:43.776', '2024-09-27 10:14:43.776'),
(97, 5, 'SALIDA', 1, 'Venta de producto en factura FACT-76', 1, 1, '2024-09-27 10:25:22.636', '2024-09-27 10:25:22.636'),
(98, 5, 'SALIDA', 1, 'Venta de producto en factura FACT-77', 1, 1, '2024-09-27 10:28:28.544', '2024-09-27 10:28:28.544'),
(99, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-78', 1, 1, '2024-09-27 10:33:04.085', '2024-09-27 10:33:04.085'),
(100, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-79', 1, 1, '2024-09-27 10:40:23.681', '2024-09-27 10:40:23.681'),
(101, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-80', 1, 1, '2024-09-27 10:50:15.973', '2024-09-27 10:50:15.973'),
(102, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-81', 1, 1, '2024-09-27 10:54:40.509', '2024-09-27 10:54:40.509'),
(103, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-82', 1, 1, '2024-09-27 11:14:13.061', '2024-09-27 11:14:13.061'),
(104, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-82', 1, 1, '2024-09-27 11:14:13.061', '2024-09-27 11:14:13.061'),
(105, 5, 'SALIDA', 1, 'Venta de producto en factura FACT-82', 1, 1, '2024-09-27 11:14:13.061', '2024-09-27 11:14:13.061'),
(106, 4, 'ENTRADA', 10, 'Compra de producto', 1, 1, '2024-09-27 11:49:15.064', '2024-09-27 11:49:15.064'),
(107, 5, 'SALIDA', 1, 'Venta de producto en factura FACT-83', 1, 1, '2024-09-30 15:50:21.164', '2024-09-30 15:50:21.164'),
(108, 5, 'SALIDA', 2, 'Venta de producto en factura FACT-84', 1, 1, '2024-10-01 12:50:11.533', '2024-10-01 12:50:11.533'),
(109, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-84', 1, 1, '2024-10-01 12:50:11.533', '2024-10-01 12:50:11.533'),
(110, 5, 'SALIDA', 2, 'Venta de producto en factura FACT-85', 1, 1, '2024-10-01 14:06:42.828', '2024-10-01 14:06:42.828'),
(111, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-85', 1, 1, '2024-10-01 14:06:42.828', '2024-10-01 14:06:42.828'),
(112, 5, 'SALIDA', 2, 'Venta de producto en factura FACT-86', 1, 1, '2024-10-01 14:06:44.639', '2024-10-01 14:06:44.639'),
(113, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-86', 1, 1, '2024-10-01 14:06:44.639', '2024-10-01 14:06:44.639'),
(114, 5, 'SALIDA', 2, 'Venta de producto en factura FACT-87', 1, 1, '2024-10-01 14:06:45.862', '2024-10-01 14:06:45.862'),
(115, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-87', 1, 1, '2024-10-01 14:06:45.862', '2024-10-01 14:06:45.862'),
(116, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-88', 1, 1, '2024-10-01 14:39:17.348', '2024-10-01 14:39:17.348'),
(117, 5, 'SALIDA', 9, 'Venta de producto en factura FACT-88', 1, 1, '2024-10-01 14:39:17.348', '2024-10-01 14:39:17.348'),
(118, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-90', 1, 1, '2024-10-01 14:52:33.644', '2024-10-01 14:52:33.644'),
(119, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-91', 1, 1, '2024-10-01 14:53:19.605', '2024-10-01 14:53:19.605'),
(120, 5, 'SALIDA', 1, 'Venta de producto en factura FACT-92', 1, 1, '2024-10-01 15:16:45.786', '2024-10-01 15:16:45.786'),
(121, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-93', 1, 1, '2024-10-01 15:17:26.082', '2024-10-01 15:17:26.082'),
(122, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-94', 1, 1, '2024-10-01 15:18:55.643', '2024-10-01 15:18:55.643'),
(123, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-95', 1, 1, '2024-10-01 15:19:57.348', '2024-10-01 15:19:57.348'),
(124, 4, 'SALIDA', 1, 'Venta de producto en factura FACT-96', 1, 1, '2024-10-01 15:24:52.095', '2024-10-01 15:24:52.095'),
(125, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-98', 1, 1, '2024-10-01 15:35:11.225', '2024-10-01 15:35:11.225'),
(126, 7, 'SALIDA', 2, 'Venta de producto en factura FACT-99', 1, 1, '2024-10-01 15:50:22.842', '2024-10-01 15:50:22.842'),
(127, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-101', 1, 1, '2024-10-02 07:41:02.981', '2024-10-02 07:41:02.981'),
(128, 5, 'SALIDA', 1, 'Venta de producto en factura FACT-138', 1, 1, '2024-10-02 15:55:49.998', '2024-10-02 15:55:49.998'),
(129, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-139', 1, 1, '2024-10-03 07:52:25.884', '2024-10-03 07:52:25.884'),
(130, 5, 'SALIDA', 1, 'Venta de producto en factura FACT-139', 1, 1, '2024-10-03 07:52:25.884', '2024-10-03 07:52:25.884'),
(131, 6, 'SALIDA', 1, 'Venta de producto en factura FACT-141', 1, 1, '2024-10-03 08:23:12.648', '2024-10-03 08:23:12.648'),
(132, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-142', 1, 1, '2024-10-03 08:25:15.567', '2024-10-03 08:25:15.567'),
(133, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-143', 1, 1, '2024-10-03 08:34:37.909', '2024-10-03 08:34:37.909'),
(134, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-144', 1, 1, '2024-10-03 09:03:37.184', '2024-10-03 09:03:37.184'),
(135, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-145', 1, 1, '2024-10-03 09:04:49.994', '2024-10-03 09:04:49.994'),
(136, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-146', 1, 1, '2024-10-03 09:11:38.703', '2024-10-03 09:11:38.703'),
(137, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-147', 1, 1, '2024-10-03 09:58:57.829', '2024-10-03 09:58:57.829'),
(138, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-148', 1, 1, '2024-10-03 10:04:38.898', '2024-10-03 10:04:38.898'),
(139, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-149', 1, 1, '2024-10-03 10:38:43.769', '2024-10-03 10:38:43.769'),
(140, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-150', 1, 1, '2024-10-03 10:45:35.248', '2024-10-03 10:45:35.248'),
(141, 7, 'SALIDA', 1, 'Venta de producto en factura FACT-151', 1, 1, '2024-10-03 12:26:37.064', '2024-10-03 12:26:37.064'),
(142, 30, 'ENTRADA', 100, 'Compra de producto', 1, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154'),
(143, 39, 'ENTRADA', 20, 'Compra de producto', 1, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154'),
(144, 38, 'ENTRADA', 50, 'Compra de producto', 1, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154'),
(145, 37, 'ENTRADA', 10, 'Compra de producto', 1, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154'),
(146, 36, 'ENTRADA', 5, 'Compra de producto', 1, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154'),
(147, 35, 'ENTRADA', 10, 'Compra de producto', 1, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154'),
(148, 34, 'ENTRADA', 50, 'Compra de producto', 1, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154'),
(149, 33, 'ENTRADA', 26, 'Compra de producto', 1, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154'),
(150, 32, 'ENTRADA', 20, 'Compra de producto', 1, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154'),
(151, 31, 'ENTRADA', 50, 'Compra de producto', 1, 1, '2024-10-04 10:13:07.154', '2024-10-04 10:13:07.154'),
(152, 31, 'SALIDA', 2, 'Venta de producto en factura FACT-152', 1, 1, '2024-10-04 10:15:06.936', '2024-10-04 10:15:06.936'),
(153, 32, 'SALIDA', 1, 'Venta de producto en factura FACT-153', 1, 1, '2024-10-04 15:00:12.095', '2024-10-04 15:00:12.095'),
(154, 32, 'SALIDA', 1, 'Venta de producto en factura FACT-154', 1, 1, '2024-10-04 15:02:08.079', '2024-10-04 15:02:08.079'),
(155, 31, 'SALIDA', 1, 'Venta de producto en factura FACT-155', 1, 1, '2024-10-04 15:30:45.073', '2024-10-04 15:30:45.073'),
(156, 35, 'SALIDA', 1, 'Venta de producto en factura FACT-155', 1, 1, '2024-10-04 15:30:45.073', '2024-10-04 15:30:45.073');

-- --------------------------------------------------------

--
-- Table structure for table `movimientoscaja`
--

CREATE TABLE `movimientoscaja` (
  `id` int(11) NOT NULL,
  `historialCajaId` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tipo` enum('INGRESO','EGRESO','VENTA','INICIAL','CIERRE') NOT NULL,
  `descripcion` varchar(191) DEFAULT NULL,
  `usuarioId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `movimientoscaja`
--

INSERT INTO `movimientoscaja` (`id`, `historialCajaId`, `monto`, `tipo`, `descripcion`, `usuarioId`, `createdAt`, `updatedAt`) VALUES
(58, 34, 5000.00, 'INICIAL', 'Inicio de caja', 1, '2024-09-03 10:00:51.690', '2024-09-03 10:00:51.690'),
(59, 34, 3000.00, 'VENTA', 'Venta de producto en factura FACT-17', 1, '2024-09-03 10:01:24.861', '2024-09-03 10:01:24.861'),
(60, 35, 20.00, 'INICIAL', 'Inicio de caja', 1, '2024-09-03 12:28:24.084', '2024-09-03 12:28:24.084'),
(61, 35, 25.00, 'CIERRE', 'Cierre de caja', 1, '2024-09-03 12:28:35.549', '2024-09-03 12:28:35.550'),
(62, 36, 20000.00, 'INICIAL', 'Inicio de caja', 1, '2024-09-04 08:34:58.779', '2024-09-04 08:34:58.779'),
(63, 36, 20000.00, 'CIERRE', 'Cierre de caja', 1, '2024-09-04 08:38:10.622', '2024-09-04 08:38:10.622'),
(64, 37, 2000.00, 'INICIAL', 'Inicio de caja', 1, '2024-09-16 14:53:07.680', '2024-09-16 14:53:07.680'),
(65, 37, 700.00, 'VENTA', 'Venta de producto en factura FACT-18', 1, '2024-09-16 14:53:44.331', '2024-09-16 14:53:44.331'),
(66, 37, 2000.00, 'CIERRE', 'Cierre de caja', 1, '2024-09-16 15:27:35.498', '2024-09-16 15:27:35.498'),
(67, 38, 2000.00, 'INICIAL', 'Inicio de caja', 1, '2024-09-17 07:17:28.025', '2024-09-17 07:17:28.025'),
(68, 38, 700.00, 'VENTA', 'Venta de producto en factura FACT-20', 1, '2024-09-17 08:01:53.583', '2024-09-17 08:01:53.583'),
(69, 34, 150.00, 'VENTA', 'Venta de producto en factura FACT-22', 1, '2024-09-17 08:43:12.560', '2024-09-17 08:43:12.560'),
(70, 34, 3000.00, 'VENTA', 'Venta de producto en factura FACT-23', 1, '2024-09-17 11:03:45.064', '2024-09-17 11:03:45.064'),
(71, 34, 3000.00, 'VENTA', 'Venta de producto en factura FACT-24', 1, '2024-09-17 11:13:08.969', '2024-09-17 11:13:08.970'),
(72, 34, 3000.00, 'VENTA', 'Venta de producto en factura FACT-25', 1, '2024-09-17 15:59:56.105', '2024-09-17 15:59:56.105'),
(73, 38, 20000.00, 'CIERRE', 'Cierre de caja', 1, '2024-09-19 08:32:03.106', '2024-09-19 08:32:03.106'),
(74, 39, 1000.00, 'INICIAL', 'Inicio de caja', 1, '2024-09-19 08:35:53.253', '2024-09-19 08:35:53.253'),
(75, 39, 20.00, 'CIERRE', 'Cierre de caja', 1, '2024-09-19 09:27:45.730', '2024-09-19 09:27:45.730'),
(76, 40, 1000.00, 'INICIAL', 'Inicio de caja', 1, '2024-09-19 09:28:43.209', '2024-09-19 09:28:43.209'),
(77, 40, 3000.00, 'VENTA', 'Venta de producto en factura FACT-26', 1, '2024-09-20 07:33:27.896', '2024-09-20 07:33:27.896'),
(78, 40, 2000.00, 'CIERRE', 'Cierre de caja', 1, '2024-09-20 14:16:19.530', '2024-09-20 14:16:19.530'),
(79, 41, 5000.00, 'INICIAL', 'Inicio de caja', 1, '2024-09-20 14:47:28.835', '2024-09-20 14:47:28.835'),
(80, 41, 25.00, 'CIERRE', 'Cierre de caja', 1, '2024-09-20 14:51:32.677', '2024-09-20 14:51:32.677'),
(81, 42, 5000.00, 'INICIAL', 'Inicio de caja', 1, '2024-09-20 14:51:43.279', '2024-09-20 14:51:43.279'),
(82, 34, 700.00, 'VENTA', 'Venta de producto en factura FACT-51', 1, '2024-09-20 14:58:25.233', '2024-09-20 14:58:25.233'),
(83, 34, 1400.00, 'VENTA', 'Venta de producto en factura FACT-52', 1, '2024-09-20 15:02:54.325', '2024-09-20 15:02:54.325'),
(84, 42, 3.00, 'CIERRE', 'Cierre de caja', 1, '2024-09-20 15:10:15.975', '2024-09-20 15:10:15.975'),
(85, 43, 1000.00, 'INICIAL', 'Inicio de caja', 1, '2024-09-20 15:10:45.924', '2024-09-20 15:10:45.924'),
(86, 43, 2800.00, 'VENTA', 'Venta de producto en factura FACT-53', 1, '2024-09-20 15:11:05.498', '2024-09-20 15:11:05.498'),
(87, 43, 1400.00, 'VENTA', 'Venta de producto en factura FACT-54', 1, '2024-09-20 16:22:26.706', '2024-09-20 16:22:26.706'),
(88, 43, 3200.00, 'CIERRE', 'Cierre de caja', 1, '2024-09-23 07:01:39.896', '2024-09-23 07:01:39.896'),
(89, 44, 100.00, 'INICIAL', 'Inicio de caja', 1, '2024-09-23 09:28:13.742', '2024-09-23 09:28:13.742'),
(90, 44, 3000.00, 'VENTA', 'Venta de producto en factura FACT-55', 1, '2024-09-23 10:16:15.213', '2024-09-23 10:16:15.213'),
(91, 44, 700.00, 'VENTA', 'Venta de producto en factura FACT-56', 1, '2024-09-23 10:19:34.773', '2024-09-23 10:19:34.773'),
(92, 44, 3700.00, 'CIERRE', 'Cierre de caja', 1, '2024-09-23 10:23:45.379', '2024-09-23 10:23:45.379'),
(93, 45, 1000.00, 'INICIAL', 'Inicio de caja', 1, '2024-09-23 10:32:59.465', '2024-09-23 10:32:59.465'),
(94, 45, 1000.00, 'CIERRE', 'Cierre de caja', 1, '2024-09-26 08:59:34.981', '2024-09-26 08:59:34.981'),
(95, 46, 1000.00, 'INICIAL', 'Inicio de caja', 1, '2024-09-26 08:59:43.320', '2024-09-26 08:59:43.320'),
(96, 46, 3000.00, 'VENTA', 'Venta de producto en factura FACT-57', 1, '2024-09-26 09:00:29.526', '2024-09-26 09:00:29.526'),
(97, 46, 1750.00, 'VENTA', 'Venta de producto en factura FACT-58', 1, '2024-09-27 07:00:38.297', '2024-09-27 07:00:38.297'),
(98, 46, 1750.00, 'VENTA', 'Venta de producto en factura FACT-58', 1, '2024-09-27 07:00:38.297', '2024-09-27 07:00:38.297'),
(99, 46, 1750.00, 'VENTA', 'Venta de producto en factura FACT-58', 1, '2024-09-27 07:00:38.297', '2024-09-27 07:00:38.297'),
(100, 46, 600.00, 'VENTA', 'Venta de producto en factura FACT-59', 1, '2024-09-27 07:18:46.193', '2024-09-27 07:18:46.193'),
(101, 46, 1400.00, 'VENTA', 'Venta de producto en factura FACT-60', 1, '2024-09-27 08:18:21.801', '2024-09-27 08:18:21.801'),
(102, 46, 3000.00, 'VENTA', 'Venta de producto en factura FACT-61', 1, '2024-09-27 08:25:43.766', '2024-09-27 08:25:43.766'),
(103, 46, 3000.00, 'VENTA', 'Venta de producto en factura FACT-62', 1, '2024-09-27 08:50:04.989', '2024-09-27 08:50:04.989'),
(104, 46, 3000.00, 'VENTA', 'Venta de producto en factura FACT-63', 1, '2024-09-27 08:50:40.445', '2024-09-27 08:50:40.445'),
(105, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-64', 1, '2024-09-27 08:56:26.448', '2024-09-27 08:56:26.448'),
(106, 46, 3000.00, 'VENTA', 'Venta de producto en factura FACT-65', 1, '2024-09-27 08:58:26.418', '2024-09-27 08:58:26.418'),
(107, 46, 3000.00, 'VENTA', 'Venta de producto en factura FACT-66', 1, '2024-09-27 09:20:28.990', '2024-09-27 09:20:28.990'),
(108, 46, 3000.00, 'VENTA', 'Venta de producto en factura FACT-67', 1, '2024-09-27 09:45:31.318', '2024-09-27 09:45:31.319'),
(109, 46, 3000.00, 'VENTA', 'Venta de producto en factura FACT-68', 1, '2024-09-27 09:50:28.498', '2024-09-27 09:50:28.498'),
(110, 46, 3000.00, 'VENTA', 'Venta de producto en factura FACT-69', 1, '2024-09-27 09:53:23.703', '2024-09-27 09:53:23.703'),
(111, 46, 700.00, 'VENTA', 'Venta de producto en factura FACT-71', 1, '2024-09-27 10:07:16.752', '2024-09-27 10:07:16.752'),
(112, 46, 700.00, 'VENTA', 'Venta de producto en factura FACT-72', 1, '2024-09-27 10:10:46.051', '2024-09-27 10:10:46.051'),
(113, 46, 700.00, 'VENTA', 'Venta de producto en factura FACT-73', 1, '2024-09-27 10:11:19.988', '2024-09-27 10:11:19.988'),
(114, 46, 700.00, 'VENTA', 'Venta de producto en factura FACT-74', 1, '2024-09-27 10:13:25.309', '2024-09-27 10:13:25.309'),
(115, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-75', 1, '2024-09-27 10:14:43.776', '2024-09-27 10:14:43.776'),
(116, 46, 150.00, 'VENTA', 'Venta de producto en factura FACT-76', 1, '2024-09-27 10:25:22.636', '2024-09-27 10:25:22.636'),
(117, 46, 150.00, 'VENTA', 'Venta de producto en factura FACT-77', 1, '2024-09-27 10:28:28.544', '2024-09-27 10:28:28.544'),
(118, 46, 700.00, 'VENTA', 'Venta de producto en factura FACT-78', 1, '2024-09-27 10:33:04.085', '2024-09-27 10:33:04.085'),
(119, 46, 800.00, 'VENTA', 'Venta de producto en factura FACT-79', 1, '2024-09-27 10:40:23.681', '2024-09-27 10:40:23.681'),
(120, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-80', 1, '2024-09-27 10:50:15.973', '2024-09-27 10:50:15.973'),
(121, 46, 800.00, 'VENTA', 'Venta de producto en factura FACT-81', 1, '2024-09-27 10:54:40.509', '2024-09-27 10:54:40.509'),
(122, 46, 1850.00, 'VENTA', 'Venta de producto en factura FACT-82', 1, '2024-09-27 11:14:13.061', '2024-09-27 11:14:13.061'),
(123, 46, 1850.00, 'VENTA', 'Venta de producto en factura FACT-82', 1, '2024-09-27 11:14:13.061', '2024-09-27 11:14:13.061'),
(124, 46, 1850.00, 'VENTA', 'Venta de producto en factura FACT-82', 1, '2024-09-27 11:14:13.061', '2024-09-27 11:14:13.061'),
(125, 46, 150.00, 'VENTA', 'Venta de producto en factura FACT-83', 1, '2024-09-30 15:50:21.164', '2024-09-30 15:50:21.164'),
(126, 46, 6300.00, 'VENTA', 'Venta de producto en factura FACT-84', 1, '2024-10-01 12:50:11.533', '2024-10-01 12:50:11.533'),
(127, 46, 6300.00, 'VENTA', 'Venta de producto en factura FACT-84', 1, '2024-10-01 12:50:11.533', '2024-10-01 12:50:11.533'),
(128, 46, 6300.00, 'VENTA', 'Venta de producto en factura FACT-85', 1, '2024-10-01 14:06:42.828', '2024-10-01 14:06:42.828'),
(129, 46, 6300.00, 'VENTA', 'Venta de producto en factura FACT-85', 1, '2024-10-01 14:06:42.828', '2024-10-01 14:06:42.828'),
(130, 46, 6300.00, 'VENTA', 'Venta de producto en factura FACT-86', 1, '2024-10-01 14:06:44.639', '2024-10-01 14:06:44.639'),
(131, 46, 6300.00, 'VENTA', 'Venta de producto en factura FACT-86', 1, '2024-10-01 14:06:44.639', '2024-10-01 14:06:44.639'),
(132, 46, 6300.00, 'VENTA', 'Venta de producto en factura FACT-87', 1, '2024-10-01 14:06:45.862', '2024-10-01 14:06:45.862'),
(133, 46, 6300.00, 'VENTA', 'Venta de producto en factura FACT-87', 1, '2024-10-01 14:06:45.862', '2024-10-01 14:06:45.862'),
(134, 46, 7350.00, 'VENTA', 'Venta de producto en factura FACT-88', 1, '2024-10-01 14:39:17.348', '2024-10-01 14:39:17.348'),
(135, 46, 7350.00, 'VENTA', 'Venta de producto en factura FACT-88', 1, '2024-10-01 14:39:17.348', '2024-10-01 14:39:17.348'),
(136, 46, 6000.00, 'VENTA', 'Venta de producto en factura FACT-90', 1, '2024-10-01 14:52:33.644', '2024-10-01 14:52:33.644'),
(137, 46, 6000.00, 'VENTA', 'Venta de producto en factura FACT-91', 1, '2024-10-01 14:53:19.605', '2024-10-01 14:53:19.605'),
(138, 46, 150.00, 'VENTA', 'Venta de producto en factura FACT-92', 1, '2024-10-01 15:16:45.786', '2024-10-01 15:16:45.786'),
(139, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-93', 1, '2024-10-01 15:17:26.082', '2024-10-01 15:17:26.082'),
(140, 46, 6000.00, 'VENTA', 'Venta de producto en factura FACT-94', 1, '2024-10-01 15:18:55.643', '2024-10-01 15:18:55.643'),
(141, 46, 6000.00, 'VENTA', 'Venta de producto en factura FACT-95', 1, '2024-10-01 15:19:57.348', '2024-10-01 15:19:57.348'),
(142, 46, 6000.00, 'VENTA', 'Venta de producto en factura FACT-96', 1, '2024-10-01 15:24:52.095', '2024-10-01 15:24:52.095'),
(143, 46, 800.00, 'VENTA', 'Venta de producto en factura FACT-98', 1, '2024-10-01 15:35:11.225', '2024-10-01 15:35:11.225'),
(144, 46, 1800.00, 'VENTA', 'Venta de producto en factura FACT-99', 1, '2024-10-01 15:50:22.842', '2024-10-01 15:50:22.842'),
(145, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-101', 1, '2024-10-02 07:41:02.981', '2024-10-02 07:41:02.981'),
(146, 46, 150.00, 'VENTA', 'Venta de producto en factura FACT-138', 1, '2024-10-02 15:55:49.998', '2024-10-02 15:55:49.998'),
(147, 46, 1050.00, 'VENTA', 'Venta de producto en factura FACT-139', 1, '2024-10-03 07:52:25.884', '2024-10-03 07:52:25.884'),
(148, 46, 1050.00, 'VENTA', 'Venta de producto en factura FACT-139', 1, '2024-10-03 07:52:25.884', '2024-10-03 07:52:25.884'),
(149, 46, 800.00, 'VENTA', 'Venta de producto en factura FACT-141', 1, '2024-10-03 08:23:12.648', '2024-10-03 08:23:12.648'),
(150, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-142', 1, '2024-10-03 08:25:15.567', '2024-10-03 08:25:15.567'),
(151, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-143', 1, '2024-10-03 08:34:37.909', '2024-10-03 08:34:37.909'),
(152, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-144', 1, '2024-10-03 09:03:37.184', '2024-10-03 09:03:37.184'),
(153, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-145', 1, '2024-10-03 09:04:49.994', '2024-10-03 09:04:49.994'),
(154, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-146', 1, '2024-10-03 09:11:38.703', '2024-10-03 09:11:38.703'),
(155, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-147', 1, '2024-10-03 09:58:57.829', '2024-10-03 09:58:57.829'),
(156, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-148', 1, '2024-10-03 10:04:38.898', '2024-10-03 10:04:38.898'),
(157, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-149', 1, '2024-10-03 10:38:43.769', '2024-10-03 10:38:43.769'),
(158, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-150', 1, '2024-10-03 10:45:35.248', '2024-10-03 10:45:35.248'),
(159, 46, 900.00, 'VENTA', 'Venta de producto en factura FACT-151', 1, '2024-10-03 12:26:37.064', '2024-10-03 12:26:37.064'),
(160, 46, 1400.00, 'VENTA', 'Venta de producto en factura FACT-152', 1, '2024-10-04 10:15:06.936', '2024-10-04 10:15:06.936'),
(161, 46, 1400.00, 'CIERRE', 'Cierre de caja', 1, '2024-10-04 14:58:34.752', '2024-10-04 14:58:34.752'),
(162, 34, 2000.00, 'VENTA', 'Venta de producto en factura FACT-153', 1, '2024-10-04 15:00:12.095', '2024-10-04 15:00:12.095'),
(163, 34, 2000.00, 'VENTA', 'Venta de producto en factura FACT-154', 1, '2024-10-04 15:02:08.079', '2024-10-04 15:02:08.079'),
(164, 34, 4200.00, 'VENTA', 'Venta de producto en factura FACT-155', 1, '2024-10-04 15:30:45.073', '2024-10-04 15:30:45.073'),
(165, 34, 4200.00, 'VENTA', 'Venta de producto en factura FACT-155', 1, '2024-10-04 15:30:45.073', '2024-10-04 15:30:45.073');

-- --------------------------------------------------------

--
-- Table structure for table `notificacion`
--

CREATE TABLE `notificacion` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `mensaje` text NOT NULL,
  `leido` tinyint(1) NOT NULL DEFAULT 0,
  `fecha` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `usuarioId` int(11) NOT NULL,
  `empresaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permiso`
--

CREATE TABLE `permiso` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `producto`
--

CREATE TABLE `producto` (
  `id` int(11) NOT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `codigoBarras` varchar(50) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `precio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) DEFAULT 0,
  `ubicacion` varchar(40) DEFAULT NULL,
  `descripcion` varchar(70) DEFAULT NULL,
  `color` varchar(25) DEFAULT NULL,
  `marca` varchar(25) DEFAULT NULL,
  `talla` varchar(10) DEFAULT NULL,
  `genero` enum('HOMBRE','MUJER','UNISEX') NOT NULL DEFAULT 'UNISEX',
  `estado` enum('INSTOCK','OUTOFSTOCK','LOWSTOCK') NOT NULL DEFAULT 'OUTOFSTOCK',
  `categoriaId` int(11) NOT NULL,
  `subCategoriaId` int(11) DEFAULT NULL,
  `volumen` varchar(10) DEFAULT NULL,
  `peso` varchar(10) DEFAULT NULL,
  `edadRecomendada` varchar(10) DEFAULT NULL,
  `empresaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `producto`
--

INSERT INTO `producto` (`id`, `codigo`, `codigoBarras`, `nombre`, `precio`, `stock`, `ubicacion`, `descripcion`, `color`, `marca`, `talla`, `genero`, `estado`, `categoriaId`, `subCategoriaId`, `volumen`, `peso`, `edadRecomendada`, `empresaId`, `createdAt`, `updatedAt`) VALUES
(4, 'JORD7R404', '123456789', 'Jordan 7 Retro', 6000.00, 0, 'Gabinete 1', '', 'Negro', 'Jordan', '40', 'UNISEX', 'OUTOFSTOCK', 27, 24, '', '', '', 1, '2024-09-03 09:59:11.980', '2024-10-01 15:24:52.116'),
(5, 'SHAH5', '12345678', 'Shampoo Hidratante', 150.00, 0, 'Gabinete 2', '', 'Transparente', 'Pantene', '', 'UNISEX', 'OUTOFSTOCK', 24, 14, '', '', '', 1, '2024-09-03 15:10:07.375', '2024-10-03 07:52:25.928'),
(6, 'ACOR6', '1234567', 'Acondicionador Reparador', 800.00, 0, 'Estante 2', '', 'Blanco', 'L\'Oréal', '', 'UNISEX', 'OUTOFSTOCK', 24, 14, '', '', '', 1, '2024-09-03 15:11:40.317', '2024-10-03 08:23:12.673'),
(7, 'MASCN7', '123456', 'Mascarilla Capilar Nutritiva', 900.00, 0, '', '', 'Amarillo', 'Garnier Fructis', '', 'UNISEX', 'OUTOFSTOCK', 24, 14, '', '', '', 1, '2024-09-03 15:13:17.238', '2024-10-03 12:26:37.106'),
(8, 'BOTAMONT4568', '0987654321099', 'Botas de Montaña', 0.00, 0, 'Almacén A, Estante 2', 'Botas resistentes para caminatas en montaña.', 'Marrón', 'MountainGear', '42', 'HOMBRE', 'OUTOFSTOCK', 27, 1, '0.03m³', '1200g', '', 1, '2024-10-04 09:51:13.731', '2024-10-04 13:51:13.749'),
(9, 'ZAPBALLE1239', '0987654321100', 'Zapatillas de Ballet', 0.00, 0, 'Almacén C, Estante 3', 'Zapatillas suaves y flexibles para bailarinas.', 'Rosa', 'DanceWorld', '36', 'MUJER', 'OUTOFSTOCK', 27, 1, '0.01m³', '500g', '5-15 años', 1, '2024-10-04 09:51:32.748', '2024-10-04 13:51:32.757'),
(10, 'CAMCAS12310', '0987654321101', 'Camisa Casual', 0.00, 0, 'Almacén B, Estante 1', 'Camisa de algodón para uso diario.', 'Azul', 'FashionCo', 'M', 'UNISEX', 'OUTOFSTOCK', 23, 1, '0.005m³', '300g', '', 1, '2024-10-04 09:52:15.958', '2024-10-04 13:52:15.964'),
(11, 'JEANS12311', '0987654321102', 'Pantalones Jeans', 0.00, 0, 'Almacén B, Estante 4', 'Jeans cómodos para el uso diario.', 'Negro', 'DenimStyle', 'L', 'UNISEX', 'OUTOFSTOCK', 23, 1, '0.02m³', '600g', '', 1, '2024-10-04 09:52:28.069', '2024-10-04 13:52:28.075'),
(12, 'SUDACAP12312', '0987654321103', 'Sudadera con Capucha', 0.00, 0, 'Almacén C, Estante 2', 'Sudadera suave y cómoda para clima fresco.', 'Gris', 'CozyWear', 'XL', 'UNISEX', 'OUTOFSTOCK', 23, 1, '0.015m³', '700g', '', 1, '2024-10-04 09:52:40.703', '2024-10-04 13:52:40.710'),
(13, 'RELOJDEP12313', '0987654321104', 'Reloj Deportivo', 0.00, 0, 'Almacén A, Estante 3', 'Reloj resistente al agua para actividades al aire libre.', 'Negro', 'TimeMaster', '', 'UNISEX', 'OUTOFSTOCK', 42, 1, '0.001m³', '200g', '', 1, '2024-10-04 09:52:51.241', '2024-10-04 13:52:51.245'),
(14, 'MOCHES12314', '0987654321105', 'Mochila Escolar', 0.00, 0, 'Almacén B, Estante 6', 'Mochila espaciosa para estudiantes.', 'Rojo', 'SchoolGear', '', 'UNISEX', 'OUTOFSTOCK', 27, 1, '0.03m³', '400g', '6-18 años', 1, '2024-10-04 09:53:00.359', '2024-10-04 13:53:00.365'),
(15, 'LIBCOC12315', '0987654321106', 'Libro de Cocina', 0.00, 0, 'Almacén C, Estante 1', 'Recetario con deliciosas recetas.', '', 'CooksUnited', '', 'UNISEX', 'OUTOFSTOCK', 38, 1, '0.002m³', '350g', '', 1, '2024-10-04 09:53:08.797', '2024-10-04 13:53:08.802'),
(16, 'LAMP12316', '0987654321107', 'Lámpara de Mesa', 0.00, 0, 'Almacén A, Estante 5', 'Lámpara moderna para decorar tu hogar.', 'Blanco', 'HomeStyle', '', 'UNISEX', 'OUTOFSTOCK', 33, 1, '0.02m³', '1200g', '', 1, '2024-10-04 09:53:26.073', '2024-10-04 13:53:26.079'),
(17, 'SILOFF12317', '0987654321108', 'Silla de Oficina', 0.00, 0, 'Almacén B, Estante 7', 'Silla ergonómica para oficina.', 'Negro', 'OfficeComfort', '', 'UNISEX', 'OUTOFSTOCK', 41, 1, '0.05m³', '8000g', '', 1, '2024-10-04 09:53:34.254', '2024-10-04 13:53:34.258'),
(18, 'TAB10D12318', '0987654321109', 'Tablet 10\"', 0.00, 0, 'Almacén A, Estante 8', 'Tablet con pantalla de 10 pulgadas y 64GB de almacenamiento.', 'Negro', 'TechGiant', '', 'UNISEX', 'OUTOFSTOCK', 40, 1, '0.003m³', '600g', '', 1, '2024-10-04 09:53:41.492', '2024-10-04 13:53:41.498'),
(19, 'CARGPORT12319', '0987654321110', 'Cargador Portátil', 0.00, 0, 'Almacén C, Estante 4', 'Cargador portátil de 20000 mAh.', 'Blanco', 'PowerOn', '', 'UNISEX', 'OUTOFSTOCK', 40, 1, '0.002m³', '400g', '', 1, '2024-10-04 09:53:55.593', '2024-10-04 13:53:55.598'),
(20, 'AURIN12320', '0987654321111', 'Auriculares Inalámbricos', 0.00, 0, 'Almacén A, Estante 9', 'Auriculares Bluetooth con cancelación de ruido.', 'Negro', 'SoundTech', '', 'UNISEX', 'OUTOFSTOCK', 40, 1, '0.001m³', '300g', '', 1, '2024-10-04 09:54:03.111', '2024-10-04 13:54:03.117'),
(21, 'CAMDIG12321', '0987654321112', 'Cámara Digital', 0.00, 0, 'Almacén C, Estante 5', 'Cámara de 20MP con lente intercambiable.', 'Negro', 'PhotoPro', '', 'UNISEX', 'OUTOFSTOCK', 40, 1, '0.01m³', '800g', '', 1, '2024-10-04 09:54:11.902', '2024-10-04 13:54:11.907'),
(22, 'LIBMAT12322', '0987654321113', 'Libro de Texto Matemáticas', 0.00, 0, 'Almacén A, Estante 1', 'Libro de texto para matemáticas de secundaria.', '', 'EduBooks', '', 'UNISEX', 'OUTOFSTOCK', 38, 1, '0.002m³', '500g', '12-18 años', 1, '2024-10-04 09:54:18.971', '2024-10-04 13:54:18.979'),
(24, 'JUEGCON12324', '0987654321114', 'Juego de Construcción', 0.00, 0, 'Almacén B, Estante 3', 'Juego de bloques para construir diferentes formas.', 'Multicolor', 'PlayTime', '', 'UNISEX', 'OUTOFSTOCK', 25, 18, '0.04m³', '1000g', '3-10 años', 1, '2024-10-04 09:55:46.039', '2024-10-04 13:55:46.045'),
(25, 'MUPE12325', '0987654321115', 'Muñeca de Peluche', 0.00, 0, 'Almacén C, Estante 6', 'Muñeca suave y abrazable.', 'Rosa', 'SoftToys', '', 'MUJER', 'OUTOFSTOCK', 25, 18, '0.03m³', '300g', '0-5 años', 1, '2024-10-04 09:56:15.302', '2024-10-04 13:56:15.308'),
(26, 'JUEGME12326', '0987654321116', 'Juego de Mesa', 0.00, 0, 'Almacén A, Estante 2', 'Juego de mesa para toda la familia.', '', 'FamilyFun', '', 'UNISEX', 'OUTOFSTOCK', 25, 18, '0.02m³', '800g', '8 años en ', 1, '2024-10-04 09:56:31.604', '2024-10-04 13:56:31.610'),
(27, 'ESDEC12327', '0987654321117', 'Espejo Decorativo', 0.00, 0, 'Almacén B, Estante 8', 'Espejo elegante para decoración de interiores.', 'Plateado', 'HomeDecor', '', 'UNISEX', 'OUTOFSTOCK', 33, 46, '0.01m³', '1200g', '', 1, '2024-10-04 09:58:20.200', '2024-10-04 13:58:20.205'),
(28, 'PORTCUERO12328', '0987654321118', 'Portafolio de Cuero', 0.00, 0, 'Almacén C, Estante 7', 'Portafolio elegante para profesionales.', 'Negro', 'BusinessClass', '', 'UNISEX', 'OUTOFSTOCK', 41, 1, '0.03m³', '700g', '', 1, '2024-10-04 09:58:34.341', '2024-10-04 13:58:34.347'),
(29, 'AURCABLE12329', '0987654321119', 'Auriculares con Cable', 0.00, 0, 'Almacén A, Estante 4', 'Auriculares con cable y excelente calidad de sonido.', 'Negro', 'SoundWaves', '', 'UNISEX', 'OUTOFSTOCK', 49, 76, '0.001m³', '250g', '', 1, '2024-10-04 10:02:23.507', '2024-10-04 14:02:23.512'),
(30, 'SOFACAMA12330', '0987654321120', 'Sofá Cama', 1200.00, 100, 'Almacén B, Estante 9', 'Sofá transformable en cama.', 'Gris', 'ComfortHome', '', 'UNISEX', 'INSTOCK', 33, 49, '0.15m³', '25000g', '', 1, '2024-10-04 10:03:05.288', '2024-10-04 10:13:07.154'),
(31, 'ROPACAMA12331', '0987654321121', 'Ropa de Cama', 700.00, 47, 'Almacén C, Estante 5', 'Juego de sábanas de alta calidad.', 'Blanco', 'HomeComfort', 'Queen', 'UNISEX', 'INSTOCK', 33, 49, '0.05m³', '1500g', '', 1, '2024-10-04 10:03:21.767', '2024-10-04 15:30:45.105'),
(32, 'CAFEEL12332', '0987654321122', 'Cafetera Eléctrica', 2000.00, 18, 'Almacén A, Estante 6', 'Cafetera con función de programación.', 'Negro', 'BrewMaster', '', 'UNISEX', 'INSTOCK', 32, 49, '0.02m³', '1200g', '', 1, '2024-10-04 10:03:38.902', '2024-10-04 15:02:08.096'),
(33, 'BATIDORA12333', '0987654321123', 'Batidora de Mano', 1000.00, 26, 'Almacén B, Estante 1', 'Batidora eléctrica con varias velocidades.', 'Blanco', 'MixMaster', '', 'UNISEX', 'INSTOCK', 32, 49, '0.004m³', '500g', '', 1, '2024-10-04 10:03:51.864', '2024-10-04 10:13:07.154'),
(34, 'HORNOEL12334', '0987654321124', 'Horno Eléctrico', 7000.00, 50, 'Almacén C, Estante 8', 'Horno eléctrico multifuncional.', 'Negro', 'CookMaster', '', 'UNISEX', 'INSTOCK', 32, 49, '0.1m³', '8000g', '', 1, '2024-10-04 10:04:02.028', '2024-10-04 10:13:07.154'),
(35, 'PLANCHA12335', '0987654321125', 'Plancha de Ropa', 3500.00, 9, 'Almacén A, Estante 2', 'Plancha de vapor con sistema anti-cal.', 'Azul', 'SmoothPress', '', 'UNISEX', 'LOWSTOCK', 32, 49, '0.002m³', '1200g', '', 1, '2024-10-04 10:04:11.871', '2024-10-04 15:30:45.108'),
(36, 'FRIGORIF12336', '0987654321126', 'Frigorífico', 350.00, 5, 'Almacén B, Estante 7', 'Frigorífico de dos puertas con sistema de bajo consumo.', 'Blanco', 'CoolMaster', '', 'UNISEX', 'LOWSTOCK', 32, 49, '0.4m³', '60000g', '', 1, '2024-10-04 10:04:21.648', '2024-10-04 10:13:07.154'),
(37, 'MICROOND12337', '0987654321127', 'Microondas', 6000.00, 10, 'Almacén A, Estante 3', 'Microondas con función de grill.', 'Negro', 'QuickCook', '', 'UNISEX', 'LOWSTOCK', 32, 49, '0.05m³', '12000g', '', 1, '2024-10-04 10:04:32.593', '2024-10-04 10:13:07.154'),
(38, 'MOCHES12338', '0987654321128', 'Mochila Escolar', 1000.00, 50, 'Almacén C, Estante 9', 'Mochila espaciosa y resistente.', 'Azul', 'SchoolPro', '', 'UNISEX', 'INSTOCK', 38, 49, '0.02m³', '500g', '6-12 años', 1, '2024-10-04 10:04:43.311', '2024-10-04 10:13:07.154'),
(39, 'ZAPDEPO12339', '0987654321129', 'Zapatos Deportivos', 1500.00, 20, 'Almacén B, Estante 2', 'Zapatos cómodos para actividad física.', 'Negro', 'SportWear', '42', 'HOMBRE', 'INSTOCK', 37, 49, '0.003m³', '900g', '12 años en', 1, '2024-10-04 10:05:01.385', '2024-10-04 10:13:07.154'),
(40, 'BOLSO12340', '0987654321130', 'Bolso de Mano', 0.00, 0, 'Almacén C, Estante 4', 'Bolso elegante para uso diario.', 'Rojo', 'FashionBag', '', 'MUJER', 'OUTOFSTOCK', 36, 1, '0.02m³', '300g', '', 1, '2024-10-04 10:05:17.473', '2024-10-04 14:05:17.479');

-- --------------------------------------------------------

--
-- Table structure for table `promocion`
--

CREATE TABLE `promocion` (
  `id` int(11) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `descripcion` varchar(191) NOT NULL,
  `fechaInicio` datetime(3) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3),
  `empresaId` int(11) NOT NULL,
  `fechaFin` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `promociondetalle`
--

CREATE TABLE `promociondetalle` (
  `id` int(11) NOT NULL,
  `promocionId` int(11) NOT NULL,
  `productoId` int(11) NOT NULL,
  `descuentoId` int(11) NOT NULL,
  `empresaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proveedor`
--

CREATE TABLE `proveedor` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `contactoId` int(11) DEFAULT NULL,
  `empresaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `proveedor`
--

INSERT INTO `proveedor` (`id`, `nombre`, `contactoId`, `empresaId`, `createdAt`, `updatedAt`) VALUES
(1, 'Importadora Juan', 3, 1, '2024-08-21 10:51:06.110', '2024-08-21 10:51:06.110');

-- --------------------------------------------------------

--
-- Table structure for table `reporte`
--

CREATE TABLE `reporte` (
  `id` int(11) NOT NULL,
  `tipo` enum('VENTAS','COMPRAS','INVENTARIO','CLIENTES','PROVEEDORES') NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `datos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`datos`)),
  `empresaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rolpermiso`
--

CREATE TABLE `rolpermiso` (
  `id` int(11) NOT NULL,
  `rol` enum('ADMIN','EMPLEADO','USUARIO','GERENTE') NOT NULL,
  `permisoId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subcategoria`
--

CREATE TABLE `subcategoria` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `categoriaId` int(11) NOT NULL,
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subcategoria`
--

INSERT INTO `subcategoria` (`id`, `nombre`, `categoriaId`, `createdAt`, `updatedAt`) VALUES
(1, 'Zapatillas', 1, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(2, 'Zapatillas Deportiva', 1, '2024-08-22 09:27:00.271', '2024-08-22 09:27:00.271'),
(3, 'Jeans Ancho', 2, '2024-08-22 11:09:17.150', '2024-08-22 11:09:17.150'),
(4, 'Camisas', 23, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(5, 'Pantalones', 23, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(6, 'Chaquetas', 23, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(7, 'Vestidos', 23, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(8, 'Ropa interior', 23, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(9, 'Bufandas', 23, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(10, 'Sombreros', 23, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(11, 'Base de maquillaje', 24, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(12, 'Lipsticks', 24, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(13, 'Cuidado de la piel', 24, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(14, 'Cuidado del cabello', 24, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(15, 'Fragancias', 24, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(16, 'Juguetes para bebés', 25, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(17, 'Juguetes educativos', 25, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(18, 'Juegos de construcción', 25, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(19, 'Muñecas y figuras', 25, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(20, 'Licuasadoras', 26, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(21, 'Microondas', 26, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(22, 'Aspiradoras', 26, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(23, 'Refrigeradores', 26, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(24, 'Zapatos de hombre', 27, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(25, 'Zapatos de mujer', 27, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(26, 'Botas', 27, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(27, 'Sandalias', 27, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(28, 'Jabones', 28, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(29, 'Champús', 28, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(30, 'Pasta de dientes', 28, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(31, 'Desodorantes', 28, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(32, 'Pampers', 29, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(33, 'Toallitas húmedas', 29, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(34, 'Cremas para bebés', 29, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(35, 'Detergentes líquidos', 30, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(36, 'Limpiadores multiusos', 30, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(37, 'Esponjas', 30, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(38, 'Paños de limpieza', 30, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(39, 'Papel higiénico', 31, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(40, 'Servilletas', 31, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(41, 'Papel para imprimir', 31, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(42, 'Bolígrafos', 31, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(43, 'Snacks', 32, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(44, 'Bebidas', 32, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(45, 'Productos enlatados', 32, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(46, 'Artículos de decoración', 33, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(47, 'Utensilios de cocina', 33, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(48, 'Muebles pequeños', 33, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(49, 'Suplementos', 34, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(50, 'Vitaminas', 34, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(51, 'Cuidado personal', 34, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(52, 'Cuadros', 35, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(53, 'Lámparas', 35, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(54, 'Cortinas', 35, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(55, 'Destornilladores', 36, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(56, 'Martillos', 36, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(57, 'Alicates', 36, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(58, 'Pelotas', 37, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(59, 'Raquetas', 37, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(60, 'Zapatillas deportivas', 37, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(61, 'Novelas', 38, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(62, 'Revistas de moda', 38, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(63, 'Libros de cocina', 38, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(64, 'Comida para perros', 39, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(65, 'Juguetes para gatos', 39, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(66, 'Accesorios para pájaros', 39, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(67, 'Teléfonos móviles', 40, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(68, 'Computadoras', 40, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(69, 'Televisores', 40, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(70, 'Sofás', 41, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(71, 'Sillas', 41, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(72, 'Mesas', 41, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(73, 'Anillos', 42, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(74, 'Collares', 42, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(75, 'Relojes de pulsera', 42, '2024-08-21 10:50:41.033', '2024-08-21 10:50:41.033'),
(76, 'Otra', 49, '2024-10-04 10:01:39.000', '2024-10-04 10:01:39.000');

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombreUsuario` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `contactoId` int(11) NOT NULL,
  `role` enum('ADMIN','EMPLEADO','USUARIO','GERENTE') NOT NULL DEFAULT 'EMPLEADO',
  `genero` enum('MASCULINO','FEMENINO') NOT NULL,
  `empresaId` int(11) NOT NULL,
  `estado` enum('HABILITADO','INHABILITADO','PENDIENTE') NOT NULL DEFAULT 'PENDIENTE',
  `createdAt` datetime(3) DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id`, `nombreUsuario`, `password`, `contactoId`, `role`, `genero`, `empresaId`, `estado`, `createdAt`, `updatedAt`) VALUES
(1, 'malfry.perez', '$2b$10$H0E5hda./1imx.V24UV.kuFhQApX/xzd/7Tsx9/ehR529lBeaxzj6', 2, 'ADMIN', 'MASCULINO', 1, 'HABILITADO', '2024-08-21 10:54:17.970', '2024-08-21 10:54:17.970');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('121956ae-9d16-4f6a-bc4c-1b6ec8808463', 'c361f422216a5c20201d7c670700065cb800e05b462473f2a1633da9e3bbfe7c', '2024-08-27 12:25:01.458', '20240827122501_v21', NULL, NULL, '2024-08-27 12:25:01.339', 1),
('30a3c6af-db19-4d7d-8651-ef7ffe64ae65', 'c5a24a606ff4d902b2795c1188b200bf74ae6b60bd987cc11f4acdc6bd1ae979', '2024-08-27 11:37:24.978', '20240827113724_v21', NULL, NULL, '2024-08-27 11:37:24.855', 1),
('481d8d19-d8f2-4a93-b6ea-565b4252a15f', 'b08c5797c745c863c31369a950f401f94928875c3d44fb8ce5de4d505c1cbfe5', '2024-08-22 15:54:48.993', '20240821144649_v20', NULL, NULL, '2024-08-22 15:54:48.988', 1),
('48885747-5110-4fed-a68a-f81bcb76d8d9', 'f1eb90368ff8c300893c0b46cca02551d4c5bb35e1a7c9a88961ca6990c18f9a', '2024-08-22 15:54:48.918', '20240821000804_v19', NULL, NULL, '2024-08-22 15:54:48.884', 1),
('4b619d82-e3a7-4d2e-ab7d-2cdbbb93cb67', '74f8fe480d150e884449333a01738dbbb11ea60d02e2c5e1e101ff06919c2d3e', '2024-08-27 12:57:51.696', '20240827125751_v21', NULL, NULL, '2024-08-27 12:57:51.644', 1),
('561613b7-4fc9-4a29-b151-dd8453185bea', '54f94c0391d5e1cf21149e5f16b3ab96ed103bbcd37be37c25bdedebdf1717f3', '2024-08-22 15:54:48.926', '20240821115248_v19', NULL, NULL, '2024-08-22 15:54:48.919', 1),
('6788404a-00cd-4fdd-89ca-1763b9fa8377', '2779c010d656d1055f0389c991c116b30ff4602e842c5ea1a4483d6fb6631e6f', '2024-08-22 16:10:52.044', '20240822161052_v20', NULL, NULL, '2024-08-22 16:10:52.031', 1),
('7c12d3f0-2cec-4ee6-afef-c6a6866bf645', '09c9ede8d50f9618b55c97a8e457dfaf1869f8a839c2e3cfb6a9725e18024180', '2024-08-22 15:54:48.980', '20240821134104_v20', NULL, NULL, '2024-08-22 15:54:48.928', 1),
('8126f1f4-b06b-4b78-b180-62626c351eb4', '9a4d8da08674f26d56d0e8e0393c30a4fe2070bb66f16c9d740adc18b510fc27', '2024-08-22 15:54:48.883', '20240820164022_v19', NULL, NULL, '2024-08-22 15:54:48.324', 1),
('901b5102-8ce4-4713-bc8f-201dc48269a6', 'dcd301e0e6fadc319b43191c0e6dd26e5bff818eeb04603daea7424a2ac276be', '2024-08-22 15:54:48.987', '20240821134139_v20', NULL, NULL, '2024-08-22 15:54:48.981', 1),
('aaf27140-bbf1-4c81-8a4e-cf00fad1de3e', '9b8e4643c855a8db04e739e9d8a1d65829a5a049161c9797d23882a14646ee1a', '2024-08-27 11:37:20.158', '20240823010525_v20', NULL, NULL, '2024-08-27 11:37:20.143', 1),
('bc5b36d4-8989-4bbd-b312-662bf8ac74cf', '3373c54070d3462a082d577e8d63f51ec942eeff8660716451caa293b4f86641', '2024-08-22 15:54:55.180', '20240822155455_v20', NULL, NULL, '2024-08-22 15:54:55.172', 1),
('dc71bd02-2c0a-42b8-b4a4-d984b46729c2', '6a63fe276fbcf3b0ac5dfcf2f32eb72dd8ae1163598362b43fac6036c137aec5', '2024-08-22 15:54:48.322', '20240820160507_v18', NULL, NULL, '2024-08-22 15:54:44.796', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `caja`
--
ALTER TABLE `caja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Caja_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Categoria_nombre_key` (`nombre`),
  ADD UNIQUE KEY `empresa_categoria_unique` (`empresaId`,`nombre`);

--
-- Indexes for table `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Cliente_identificacion_key` (`identificacion`),
  ADD UNIQUE KEY `Cliente_contactoId_key` (`contactoId`),
  ADD KEY `Cliente_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Compra_usuarioId_fkey` (`usuarioId`),
  ADD KEY `Compra_empresaId_fkey` (`empresaId`),
  ADD KEY `Compra_proveedorId_fkey` (`proveedorId`);

--
-- Indexes for table `contacto`
--
ALTER TABLE `contacto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Contacto_email_key` (`email`);

--
-- Indexes for table `descuento`
--
ALTER TABLE `descuento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Descuento_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `descuentocliente`
--
ALTER TABLE `descuentocliente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DescuentoCliente_descuentoId_fkey` (`descuentoId`),
  ADD KEY `DescuentoCliente_clienteId_fkey` (`clienteId`),
  ADD KEY `DescuentoCliente_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `descuentoproducto`
--
ALTER TABLE `descuentoproducto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DescuentoProducto_descuentoId_fkey` (`descuentoId`),
  ADD KEY `DescuentoProducto_productoId_fkey` (`productoId`),
  ADD KEY `DescuentoProducto_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `descuentosubcategoria`
--
ALTER TABLE `descuentosubcategoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DescuentoSubcategoria_descuentoId_fkey` (`descuentoId`),
  ADD KEY `DescuentoSubcategoria_subCategoriaId_fkey` (`subCategoriaId`),
  ADD KEY `DescuentoSubcategoria_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `detallecompra`
--
ALTER TABLE `detallecompra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DetalleCompra_compraId_fkey` (`compraId`),
  ADD KEY `DetalleCompra_productoId_fkey` (`productoId`),
  ADD KEY `DetalleCompra_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `detallefactura`
--
ALTER TABLE `detallefactura`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detalle_factura_idx` (`facturaId`,`productoId`),
  ADD KEY `DetalleFactura_empresaId_fkey` (`empresaId`),
  ADD KEY `DetalleFactura_productoId_fkey` (`productoId`);

--
-- Indexes for table `devolucioncliente`
--
ALTER TABLE `devolucioncliente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DevolucionCliente_facturaId_fkey` (`facturaId`),
  ADD KEY `DevolucionCliente_productoId_fkey` (`productoId`),
  ADD KEY `DevolucionCliente_empresaId_fkey` (`empresaId`),
  ADD KEY `DevolucionCliente_usuarioId_fkey` (`usuarioId`);

--
-- Indexes for table `devolucionproveedor`
--
ALTER TABLE `devolucionproveedor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `DevolucionProveedor_compraId_fkey` (`compraId`),
  ADD KEY `DevolucionProveedor_productoId_fkey` (`productoId`),
  ADD KEY `DevolucionProveedor_empresaId_fkey` (`empresaId`),
  ADD KEY `DevolucionProveedor_usuarioId_fkey` (`usuarioId`);

--
-- Indexes for table `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Empresa_contactoId_key` (`contactoId`),
  ADD KEY `empresa_nombre_idx` (`nombre`);

--
-- Indexes for table `factura`
--
ALTER TABLE `factura`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Factura_codigo_key` (`codigo`),
  ADD KEY `factura_cliente_idx` (`clienteNombre`),
  ADD KEY `Factura_empresaId_fkey` (`empresaId`),
  ADD KEY `Factura_usuarioId_fkey` (`usuarioId`),
  ADD KEY `Factura_clienteId_fkey` (`clienteId`),
  ADD KEY `Factura_cajaId_fkey` (`cajaId`);

--
-- Indexes for table `historialcaja`
--
ALTER TABLE `historialcaja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `HistorialCaja_cajaId_fkey` (`cajaId`);

--
-- Indexes for table `historialdescuentos`
--
ALTER TABLE `historialdescuentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `HistorialDescuentos_descuentoId_fkey` (`descuentoId`),
  ADD KEY `HistorialDescuentos_productoId_fkey` (`productoId`),
  ADD KEY `HistorialDescuentos_facturaId_fkey` (`facturaId`),
  ADD KEY `HistorialDescuentos_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `historialprecio`
--
ALTER TABLE `historialprecio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `HistorialPrecio_productoId_fkey` (`productoId`),
  ADD KEY `HistorialPrecio_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `loteproducto`
--
ALTER TABLE `loteproducto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `LoteProducto_productoId_fkey` (`productoId`),
  ADD KEY `LoteProducto_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `movimientoinventario`
--
ALTER TABLE `movimientoinventario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `MovimientoInventario_productoId_fkey` (`productoId`),
  ADD KEY `MovimientoInventario_empresaId_fkey` (`empresaId`),
  ADD KEY `MovimientoInventario_usuarioId_fkey` (`usuarioId`);

--
-- Indexes for table `movimientoscaja`
--
ALTER TABLE `movimientoscaja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `MovimientosCaja_historialCajaId_idx` (`historialCajaId`),
  ADD KEY `MovimientosCaja_usuarioId_idx` (`usuarioId`);

--
-- Indexes for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Notificacion_usuarioId_fkey` (`usuarioId`),
  ADD KEY `Notificacion_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `permiso`
--
ALTER TABLE `permiso`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Producto_codigoBarras_key` (`codigoBarras`),
  ADD KEY `producto_nombre_idx` (`nombre`),
  ADD KEY `Producto_empresaId_fkey` (`empresaId`),
  ADD KEY `Producto_categoriaId_fkey` (`categoriaId`),
  ADD KEY `Producto_subCategoriaId_fkey` (`subCategoriaId`);

--
-- Indexes for table `promocion`
--
ALTER TABLE `promocion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Promocion_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `promociondetalle`
--
ALTER TABLE `promociondetalle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PromocionDetalle_descuentoId_fkey` (`descuentoId`),
  ADD KEY `PromocionDetalle_promocionId_fkey` (`promocionId`),
  ADD KEY `PromocionDetalle_productoId_fkey` (`productoId`),
  ADD KEY `PromocionDetalle_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Proveedor_contactoId_key` (`contactoId`),
  ADD KEY `Proveedor_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `reporte`
--
ALTER TABLE `reporte`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Reporte_empresaId_fkey` (`empresaId`);

--
-- Indexes for table `rolpermiso`
--
ALTER TABLE `rolpermiso`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rol_permiso_unique` (`rol`,`permisoId`),
  ADD KEY `RolPermiso_permisoId_fkey` (`permisoId`);

--
-- Indexes for table `subcategoria`
--
ALTER TABLE `subcategoria`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categoria_subcategoria_unique` (`categoriaId`,`nombre`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Usuario_contactoId_key` (`contactoId`),
  ADD UNIQUE KEY `empresa_usuario_unique` (`empresaId`,`nombreUsuario`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `caja`
--
ALTER TABLE `caja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `compra`
--
ALTER TABLE `compra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `contacto`
--
ALTER TABLE `contacto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `descuento`
--
ALTER TABLE `descuento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `descuentocliente`
--
ALTER TABLE `descuentocliente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `descuentoproducto`
--
ALTER TABLE `descuentoproducto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `descuentosubcategoria`
--
ALTER TABLE `descuentosubcategoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `detallecompra`
--
ALTER TABLE `detallecompra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `detallefactura`
--
ALTER TABLE `detallefactura`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `devolucioncliente`
--
ALTER TABLE `devolucioncliente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `devolucionproveedor`
--
ALTER TABLE `devolucionproveedor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `factura`
--
ALTER TABLE `factura`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT for table `historialcaja`
--
ALTER TABLE `historialcaja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `historialdescuentos`
--
ALTER TABLE `historialdescuentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `historialprecio`
--
ALTER TABLE `historialprecio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loteproducto`
--
ALTER TABLE `loteproducto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `movimientoinventario`
--
ALTER TABLE `movimientoinventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- AUTO_INCREMENT for table `movimientoscaja`
--
ALTER TABLE `movimientoscaja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=166;

--
-- AUTO_INCREMENT for table `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permiso`
--
ALTER TABLE `permiso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `promocion`
--
ALTER TABLE `promocion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `promociondetalle`
--
ALTER TABLE `promociondetalle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reporte`
--
ALTER TABLE `reporte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rolpermiso`
--
ALTER TABLE `rolpermiso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subcategoria`
--
ALTER TABLE `subcategoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `caja`
--
ALTER TABLE `caja`
  ADD CONSTRAINT `Caja_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `categoria`
--
ALTER TABLE `categoria`
  ADD CONSTRAINT `Categoria_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `Cliente_contactoId_fkey` FOREIGN KEY (`contactoId`) REFERENCES `contacto` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Cliente_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `Compra_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Compra_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `proveedor` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Compra_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `descuento`
--
ALTER TABLE `descuento`
  ADD CONSTRAINT `Descuento_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `descuentocliente`
--
ALTER TABLE `descuentocliente`
  ADD CONSTRAINT `DescuentoCliente_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `cliente` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DescuentoCliente_descuentoId_fkey` FOREIGN KEY (`descuentoId`) REFERENCES `descuento` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DescuentoCliente_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `descuentoproducto`
--
ALTER TABLE `descuentoproducto`
  ADD CONSTRAINT `DescuentoProducto_descuentoId_fkey` FOREIGN KEY (`descuentoId`) REFERENCES `descuento` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DescuentoProducto_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DescuentoProducto_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `producto` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `descuentosubcategoria`
--
ALTER TABLE `descuentosubcategoria`
  ADD CONSTRAINT `DescuentoSubcategoria_descuentoId_fkey` FOREIGN KEY (`descuentoId`) REFERENCES `descuento` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DescuentoSubcategoria_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DescuentoSubcategoria_subCategoriaId_fkey` FOREIGN KEY (`subCategoriaId`) REFERENCES `subcategoria` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `detallecompra`
--
ALTER TABLE `detallecompra`
  ADD CONSTRAINT `DetalleCompra_compraId_fkey` FOREIGN KEY (`compraId`) REFERENCES `compra` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `DetalleCompra_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DetalleCompra_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `producto` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `detallefactura`
--
ALTER TABLE `detallefactura`
  ADD CONSTRAINT `DetalleFactura_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DetalleFactura_facturaId_fkey` FOREIGN KEY (`facturaId`) REFERENCES `factura` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DetalleFactura_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `producto` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `devolucioncliente`
--
ALTER TABLE `devolucioncliente`
  ADD CONSTRAINT `DevolucionCliente_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DevolucionCliente_facturaId_fkey` FOREIGN KEY (`facturaId`) REFERENCES `factura` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DevolucionCliente_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `producto` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DevolucionCliente_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `devolucionproveedor`
--
ALTER TABLE `devolucionproveedor`
  ADD CONSTRAINT `DevolucionProveedor_compraId_fkey` FOREIGN KEY (`compraId`) REFERENCES `compra` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DevolucionProveedor_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DevolucionProveedor_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `producto` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `DevolucionProveedor_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `empresa`
--
ALTER TABLE `empresa`
  ADD CONSTRAINT `Empresa_contactoId_fkey` FOREIGN KEY (`contactoId`) REFERENCES `contacto` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `factura`
--
ALTER TABLE `factura`
  ADD CONSTRAINT `Factura_cajaId_fkey` FOREIGN KEY (`cajaId`) REFERENCES `caja` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Factura_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `cliente` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Factura_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Factura_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `historialcaja`
--
ALTER TABLE `historialcaja`
  ADD CONSTRAINT `HistorialCaja_cajaId_fkey` FOREIGN KEY (`cajaId`) REFERENCES `caja` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `historialdescuentos`
--
ALTER TABLE `historialdescuentos`
  ADD CONSTRAINT `HistorialDescuentos_descuentoId_fkey` FOREIGN KEY (`descuentoId`) REFERENCES `descuento` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `HistorialDescuentos_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `HistorialDescuentos_facturaId_fkey` FOREIGN KEY (`facturaId`) REFERENCES `factura` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `HistorialDescuentos_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `producto` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `historialprecio`
--
ALTER TABLE `historialprecio`
  ADD CONSTRAINT `HistorialPrecio_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `HistorialPrecio_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `producto` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `loteproducto`
--
ALTER TABLE `loteproducto`
  ADD CONSTRAINT `LoteProducto_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `LoteProducto_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `producto` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `movimientoinventario`
--
ALTER TABLE `movimientoinventario`
  ADD CONSTRAINT `MovimientoInventario_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `MovimientoInventario_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `producto` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `MovimientoInventario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `movimientoscaja`
--
ALTER TABLE `movimientoscaja`
  ADD CONSTRAINT `MovimientosCaja_historialCajaId_fkey` FOREIGN KEY (`historialCajaId`) REFERENCES `historialcaja` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `MovimientosCaja_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `Notificacion_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Notificacion_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `Producto_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categoria` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Producto_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Producto_subCategoriaId_fkey` FOREIGN KEY (`subCategoriaId`) REFERENCES `subcategoria` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `promocion`
--
ALTER TABLE `promocion`
  ADD CONSTRAINT `Promocion_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `promociondetalle`
--
ALTER TABLE `promociondetalle`
  ADD CONSTRAINT `PromocionDetalle_descuentoId_fkey` FOREIGN KEY (`descuentoId`) REFERENCES `descuento` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `PromocionDetalle_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `PromocionDetalle_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `producto` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `PromocionDetalle_promocionId_fkey` FOREIGN KEY (`promocionId`) REFERENCES `promocion` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `proveedor`
--
ALTER TABLE `proveedor`
  ADD CONSTRAINT `Proveedor_contactoId_fkey` FOREIGN KEY (`contactoId`) REFERENCES `contacto` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Proveedor_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `reporte`
--
ALTER TABLE `reporte`
  ADD CONSTRAINT `Reporte_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `rolpermiso`
--
ALTER TABLE `rolpermiso`
  ADD CONSTRAINT `RolPermiso_permisoId_fkey` FOREIGN KEY (`permisoId`) REFERENCES `permiso` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `subcategoria`
--
ALTER TABLE `subcategoria`
  ADD CONSTRAINT `SubCategoria_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categoria` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `Usuario_contactoId_fkey` FOREIGN KEY (`contactoId`) REFERENCES `contacto` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Usuario_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresa` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
