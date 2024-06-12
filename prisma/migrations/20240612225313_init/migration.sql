/*
  Warnings:

  - You are about to drop the column `direccion` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the `detalle_factura` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[contactoId]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contactoId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `total` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genero` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `detalle_factura` DROP FOREIGN KEY `Detalle_factura_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `detalle_factura` DROP FOREIGN KEY `Detalle_factura_facturaId_fkey`;

-- DropForeignKey
ALTER TABLE `detalle_factura` DROP FOREIGN KEY `Detalle_factura_productoId_fkey`;

-- DropIndex
DROP INDEX `Empresa_email_key` ON `empresa`;

-- AlterTable
ALTER TABLE `empresa` DROP COLUMN `direccion`,
    DROP COLUMN `email`,
    DROP COLUMN `instagram`,
    DROP COLUMN `telefono`,
    DROP COLUMN `whatsapp`,
    ADD COLUMN `contactoId` INTEGER NULL;

-- AlterTable
ALTER TABLE `factura` ADD COLUMN `total` DECIMAL(10, 2) NOT NULL,
    MODIFY `cliente` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `producto` ADD COLUMN `descripcion` VARCHAR(70) NULL,
    ADD COLUMN `proveedorId` INTEGER NULL,
    ADD COLUMN `stock` INTEGER NULL,
    MODIFY `estado` ENUM('INSTOCK', 'OUTOFSTOCK', 'DISCONTINUED', 'BACKORDER') NOT NULL DEFAULT 'INSTOCK';

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `contactoId` INTEGER NULL,
    ADD COLUMN `estado` ENUM('HABILITADO', 'INHABILITADO', 'PENDIENTE') NOT NULL DEFAULT 'PENDIENTE',
    ADD COLUMN `genero` ENUM('MASCULINO', 'FEMENINO') NOT NULL,
    MODIFY `role` ENUM('ADMIN', 'CLIENTE', 'EMPLEADO', 'USUARIO') NOT NULL DEFAULT 'EMPLEADO';

-- DropTable
DROP TABLE `detalle_factura`;

-- CreateTable
CREATE TABLE `Contacto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `direccion` VARCHAR(50) NULL,
    `telefono` VARCHAR(15) NULL,
    `email` VARCHAR(50) NULL,
    `instagram` VARCHAR(30) NULL,
    `whatsapp` VARCHAR(15) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Contacto_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proveedor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `contactoId` INTEGER NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `empresaId` INTEGER NOT NULL,

    UNIQUE INDEX `Proveedor_contactoId_key`(`contactoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `identificacion` VARCHAR(50) NOT NULL,
    `contactoId` INTEGER NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `empresaId` INTEGER NOT NULL,

    UNIQUE INDEX `Cliente_identificacion_key`(`identificacion`),
    UNIQUE INDEX `Cliente_contactoId_key`(`contactoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleFactura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `facturaId` INTEGER NOT NULL,
    `empresaId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precioUnitario` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `detalle_factura_idx`(`facturaId`, `productoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleOrdenCompra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordenId` INTEGER NULL,
    `productoId` INTEGER NULL,
    `cantidad` INTEGER NOT NULL,
    `precioUnitario` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdenCompra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `proveedorId` INTEGER NULL,
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productoId` INTEGER NULL,
    `cantidadProducida` INTEGER NOT NULL,
    `costoTotal` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Empresa_contactoId_key` ON `Empresa`(`contactoId`);

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_contactoId_key` ON `Usuario`(`contactoId`);

-- AddForeignKey
ALTER TABLE `Empresa` ADD CONSTRAINT `Empresa_contactoId_fkey` FOREIGN KEY (`contactoId`) REFERENCES `Contacto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proveedor` ADD CONSTRAINT `Proveedor_contactoId_fkey` FOREIGN KEY (`contactoId`) REFERENCES `Contacto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Proveedor` ADD CONSTRAINT `Proveedor_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_contactoId_fkey` FOREIGN KEY (`contactoId`) REFERENCES `Contacto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_contactoId_fkey` FOREIGN KEY (`contactoId`) REFERENCES `Contacto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleFactura` ADD CONSTRAINT `DetalleFactura_facturaId_fkey` FOREIGN KEY (`facturaId`) REFERENCES `Factura`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleFactura` ADD CONSTRAINT `DetalleFactura_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleFactura` ADD CONSTRAINT `DetalleFactura_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleOrdenCompra` ADD CONSTRAINT `DetalleOrdenCompra_ordenId_fkey` FOREIGN KEY (`ordenId`) REFERENCES `OrdenCompra`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleOrdenCompra` ADD CONSTRAINT `DetalleOrdenCompra_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleOrdenCompra` ADD CONSTRAINT `DetalleOrdenCompra_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenCompra` ADD CONSTRAINT `OrdenCompra_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenCompra` ADD CONSTRAINT `OrdenCompra_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produccion` ADD CONSTRAINT `Produccion_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produccion` ADD CONSTRAINT `Produccion_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
