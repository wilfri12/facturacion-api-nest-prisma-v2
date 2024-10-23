/*
  Warnings:

  - You are about to drop the column `categoriaId` on the `transaccion` table. All the data in the column will be lost.
  - You are about to drop the column `detalles` on the `transaccion` table. All the data in the column will be lost.
  - The values [VENTAS,COMPRAS] on the enum `Transaccion_tipo` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `transaccion` DROP FOREIGN KEY `Transaccion_categoriaId_fkey`;

-- AlterTable
ALTER TABLE `transaccion` DROP COLUMN `categoriaId`,
    DROP COLUMN `detalles`,
    ADD COLUMN `compraId` INTEGER NULL,
    ADD COLUMN `facturaId` INTEGER NULL,
    MODIFY `tipo` ENUM('VENTA', 'COMPRA', 'INVENTARIO', 'CLIENTES') NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_compraId_fkey` FOREIGN KEY (`compraId`) REFERENCES `Compra`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_facturaId_fkey` FOREIGN KEY (`facturaId`) REFERENCES `Factura`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
