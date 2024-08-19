/*
  Warnings:

  - You are about to drop the column `precio` on the `producto` table. All the data in the column will be lost.
  - You are about to drop the `detallemateriaprima` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detalleordencompra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `detalleproduccion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `materiaprima` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ordencompra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `produccion` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[codigoBarras]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - Made the column `contactoId` on table `cliente` required. This step will fail if there are existing NULL values in that column.
  - Made the column `direccion` on table `contacto` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `itebisTotal` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Made the column `usuarioId` on table `factura` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactoId` on table `usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `cliente` DROP FOREIGN KEY `Cliente_contactoId_fkey`;

-- DropForeignKey
ALTER TABLE `detallemateriaprima` DROP FOREIGN KEY `DetalleMateriaPrima_detalleProduccionId_fkey`;

-- DropForeignKey
ALTER TABLE `detallemateriaprima` DROP FOREIGN KEY `DetalleMateriaPrima_materiaPrimaId_fkey`;

-- DropForeignKey
ALTER TABLE `detalleordencompra` DROP FOREIGN KEY `DetalleOrdenCompra_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `detalleordencompra` DROP FOREIGN KEY `DetalleOrdenCompra_ordenId_fkey`;

-- DropForeignKey
ALTER TABLE `detalleordencompra` DROP FOREIGN KEY `DetalleOrdenCompra_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `detalleproduccion` DROP FOREIGN KEY `DetalleProduccion_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `detalleproduccion` DROP FOREIGN KEY `DetalleProduccion_produccionId_fkey`;

-- DropForeignKey
ALTER TABLE `detalleproduccion` DROP FOREIGN KEY `DetalleProduccion_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `factura` DROP FOREIGN KEY `Factura_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `materiaprima` DROP FOREIGN KEY `MateriaPrima_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `materiaprima` DROP FOREIGN KEY `MateriaPrima_proveedorId_fkey`;

-- DropForeignKey
ALTER TABLE `ordencompra` DROP FOREIGN KEY `OrdenCompra_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `ordencompra` DROP FOREIGN KEY `OrdenCompra_proveedorId_fkey`;

-- DropForeignKey
ALTER TABLE `ordencompra` DROP FOREIGN KEY `OrdenCompra_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `produccion` DROP FOREIGN KEY `Produccion_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `Usuario_contactoId_fkey`;

-- AlterTable
ALTER TABLE `cliente` MODIFY `contactoId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `contacto` MODIFY `direccion` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `detallefactura` ADD COLUMN `descuento` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `itebis` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `factura` ADD COLUMN `itebisTotal` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `metodoPago` ENUM('EFECTIVO', 'TRANSFERENCIA', 'TARJETA') NOT NULL DEFAULT 'EFECTIVO',
    MODIFY `usuarioId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `producto` DROP COLUMN `precio`,
    ADD COLUMN `codigo` VARCHAR(50) NULL,
    ADD COLUMN `codigoBarras` VARCHAR(50) NULL,
    ADD COLUMN `color` VARCHAR(25) NULL,
    ADD COLUMN `edadRecomendada` VARCHAR(10) NULL,
    ADD COLUMN `genero` ENUM('HOMBRE', 'MUJER', 'UNISEX') NOT NULL DEFAULT 'UNISEX',
    ADD COLUMN `marca` VARCHAR(25) NULL,
    ADD COLUMN `peso` VARCHAR(10) NULL,
    ADD COLUMN `precioCompra` DECIMAL(10, 2) NULL DEFAULT 0.0,
    ADD COLUMN `precioVenta` DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    ADD COLUMN `proveedorId` INTEGER NULL,
    ADD COLUMN `subCategoriaId` INTEGER NULL,
    ADD COLUMN `talla` VARCHAR(10) NULL,
    ADD COLUMN `ubicacion` VARCHAR(40) NULL,
    ADD COLUMN `volumen` VARCHAR(10) NULL,
    MODIFY `estado` ENUM('INSTOCK', 'OUTOFSTOCK', 'LOWSTOCK') NOT NULL DEFAULT 'INSTOCK';

-- AlterTable
ALTER TABLE `usuario` MODIFY `contactoId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `detallemateriaprima`;

-- DropTable
DROP TABLE `detalleordencompra`;

-- DropTable
DROP TABLE `detalleproduccion`;

-- DropTable
DROP TABLE `materiaprima`;

-- DropTable
DROP TABLE `ordencompra`;

-- DropTable
DROP TABLE `produccion`;

-- CreateTable
CREATE TABLE `SubCategoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoriaId` INTEGER NOT NULL,
    `nombre` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `categoria_subcategoria_unique`(`categoriaId`, `nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Compra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `empresaId` INTEGER NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleCompra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `compraId` INTEGER NULL,
    `productoId` INTEGER NULL,
    `cantidad` INTEGER NOT NULL,
    `empresaId` INTEGER NOT NULL,
    `precioUnitario` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Producto_codigoBarras_key` ON `Producto`(`codigoBarras`);

-- AddForeignKey
ALTER TABLE `SubCategoria` ADD CONSTRAINT `SubCategoria_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_subCategoriaId_fkey` FOREIGN KEY (`subCategoriaId`) REFERENCES `SubCategoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_contactoId_fkey` FOREIGN KEY (`contactoId`) REFERENCES `Contacto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_contactoId_fkey` FOREIGN KEY (`contactoId`) REFERENCES `Contacto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Factura` ADD CONSTRAINT `Factura_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Compra` ADD CONSTRAINT `Compra_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Compra` ADD CONSTRAINT `Compra_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleCompra` ADD CONSTRAINT `DetalleCompra_compraId_fkey` FOREIGN KEY (`compraId`) REFERENCES `Compra`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleCompra` ADD CONSTRAINT `DetalleCompra_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleCompra` ADD CONSTRAINT `DetalleCompra_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
