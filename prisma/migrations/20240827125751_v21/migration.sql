/*
  Warnings:

  - The values [GASTO] on the enum `MovimientosCaja_tipo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `factura` ADD COLUMN `cajaId` INTEGER NULL;

-- AlterTable
ALTER TABLE `movimientoscaja` MODIFY `tipo` ENUM('INGRESO', 'EGRESO', 'VENTA', 'INICIAL', 'CIERRE') NOT NULL;

-- AddForeignKey
ALTER TABLE `Factura` ADD CONSTRAINT `Factura_cajaId_fkey` FOREIGN KEY (`cajaId`) REFERENCES `Caja`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
