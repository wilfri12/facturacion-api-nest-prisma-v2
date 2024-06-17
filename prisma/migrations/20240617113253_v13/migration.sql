/*
  Warnings:

  - You are about to drop the column `produccionId` on the `producto` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Producto_produccionId_fkey` ON `producto`;

-- AlterTable
ALTER TABLE `detalleproduccion` ADD COLUMN `produccionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `producto` DROP COLUMN `produccionId`;

-- AddForeignKey
ALTER TABLE `DetalleProduccion` ADD CONSTRAINT `DetalleProduccion_produccionId_fkey` FOREIGN KEY (`produccionId`) REFERENCES `Produccion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
