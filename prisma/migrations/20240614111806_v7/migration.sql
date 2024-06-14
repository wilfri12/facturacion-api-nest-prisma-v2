/*
  Warnings:

  - You are about to drop the column `productoId` on the `produccion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `produccion` DROP FOREIGN KEY `Produccion_productoId_fkey`;

-- AlterTable
ALTER TABLE `produccion` DROP COLUMN `productoId`;

-- AlterTable
ALTER TABLE `producto` ADD COLUMN `produccionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_produccionId_fkey` FOREIGN KEY (`produccionId`) REFERENCES `Produccion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
