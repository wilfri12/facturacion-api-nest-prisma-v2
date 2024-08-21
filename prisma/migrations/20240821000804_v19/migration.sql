/*
  Warnings:

  - You are about to drop the column `proveedorId` on the `producto` table. All the data in the column will be lost.
  - Added the required column `proveedorId` to the `Compra` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `producto` DROP FOREIGN KEY `Producto_proveedorId_fkey`;

-- AlterTable
ALTER TABLE `compra` ADD COLUMN `proveedorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `producto` DROP COLUMN `proveedorId`;

-- AddForeignKey
ALTER TABLE `Compra` ADD CONSTRAINT `Compra_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `Proveedor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
