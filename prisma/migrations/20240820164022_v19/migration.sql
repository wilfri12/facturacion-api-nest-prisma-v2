/*
  Warnings:

  - You are about to drop the `descuento_cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `descuento_producto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `descuento_subcategoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historial_descuentos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promocion_detalle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `descuento_cliente` DROP FOREIGN KEY `Descuento_Cliente_clienteId_fkey`;

-- DropForeignKey
ALTER TABLE `descuento_cliente` DROP FOREIGN KEY `Descuento_Cliente_descuentoId_fkey`;

-- DropForeignKey
ALTER TABLE `descuento_cliente` DROP FOREIGN KEY `Descuento_Cliente_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `descuento_producto` DROP FOREIGN KEY `Descuento_Producto_descuentoId_fkey`;

-- DropForeignKey
ALTER TABLE `descuento_producto` DROP FOREIGN KEY `Descuento_Producto_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `descuento_producto` DROP FOREIGN KEY `Descuento_Producto_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `descuento_subcategoria` DROP FOREIGN KEY `Descuento_Subcategoria_descuentoId_fkey`;

-- DropForeignKey
ALTER TABLE `descuento_subcategoria` DROP FOREIGN KEY `Descuento_Subcategoria_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `descuento_subcategoria` DROP FOREIGN KEY `Descuento_Subcategoria_subCategoriaId_fkey`;

-- DropForeignKey
ALTER TABLE `historial_descuentos` DROP FOREIGN KEY `Historial_Descuentos_descuentoId_fkey`;

-- DropForeignKey
ALTER TABLE `historial_descuentos` DROP FOREIGN KEY `Historial_Descuentos_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `historial_descuentos` DROP FOREIGN KEY `Historial_Descuentos_facturaId_fkey`;

-- DropForeignKey
ALTER TABLE `historial_descuentos` DROP FOREIGN KEY `Historial_Descuentos_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `promocion_detalle` DROP FOREIGN KEY `Promocion_Detalle_descuentoId_fkey`;

-- DropForeignKey
ALTER TABLE `promocion_detalle` DROP FOREIGN KEY `Promocion_Detalle_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `promocion_detalle` DROP FOREIGN KEY `Promocion_Detalle_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `promocion_detalle` DROP FOREIGN KEY `Promocion_Detalle_promocionId_fkey`;

-- DropTable
DROP TABLE `descuento_cliente`;

-- DropTable
DROP TABLE `descuento_producto`;

-- DropTable
DROP TABLE `descuento_subcategoria`;

-- DropTable
DROP TABLE `historial_descuentos`;

-- DropTable
DROP TABLE `promocion_detalle`;

-- CreateTable
CREATE TABLE `DescuentoProducto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descuentoId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DescuentoSubcategoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descuentoId` INTEGER NOT NULL,
    `subCategoriaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DescuentoCliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descuentoId` INTEGER NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistorialDescuentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descuentoId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,
    `facturaId` INTEGER NOT NULL,
    `fechaAplicacion` DATETIME(3) NOT NULL,
    `cantidad` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `valorDescuento` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PromocionDetalle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `promocionId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,
    `descuentoId` INTEGER NOT NULL,
    `empresaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DescuentoProducto` ADD CONSTRAINT `DescuentoProducto_descuentoId_fkey` FOREIGN KEY (`descuentoId`) REFERENCES `Descuento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DescuentoProducto` ADD CONSTRAINT `DescuentoProducto_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DescuentoProducto` ADD CONSTRAINT `DescuentoProducto_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DescuentoSubcategoria` ADD CONSTRAINT `DescuentoSubcategoria_descuentoId_fkey` FOREIGN KEY (`descuentoId`) REFERENCES `Descuento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DescuentoSubcategoria` ADD CONSTRAINT `DescuentoSubcategoria_subCategoriaId_fkey` FOREIGN KEY (`subCategoriaId`) REFERENCES `SubCategoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DescuentoSubcategoria` ADD CONSTRAINT `DescuentoSubcategoria_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DescuentoCliente` ADD CONSTRAINT `DescuentoCliente_descuentoId_fkey` FOREIGN KEY (`descuentoId`) REFERENCES `Descuento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DescuentoCliente` ADD CONSTRAINT `DescuentoCliente_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DescuentoCliente` ADD CONSTRAINT `DescuentoCliente_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistorialDescuentos` ADD CONSTRAINT `HistorialDescuentos_descuentoId_fkey` FOREIGN KEY (`descuentoId`) REFERENCES `Descuento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistorialDescuentos` ADD CONSTRAINT `HistorialDescuentos_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistorialDescuentos` ADD CONSTRAINT `HistorialDescuentos_facturaId_fkey` FOREIGN KEY (`facturaId`) REFERENCES `Factura`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistorialDescuentos` ADD CONSTRAINT `HistorialDescuentos_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PromocionDetalle` ADD CONSTRAINT `PromocionDetalle_descuentoId_fkey` FOREIGN KEY (`descuentoId`) REFERENCES `Descuento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PromocionDetalle` ADD CONSTRAINT `PromocionDetalle_promocionId_fkey` FOREIGN KEY (`promocionId`) REFERENCES `Promocion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PromocionDetalle` ADD CONSTRAINT `PromocionDetalle_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PromocionDetalle` ADD CONSTRAINT `PromocionDetalle_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
