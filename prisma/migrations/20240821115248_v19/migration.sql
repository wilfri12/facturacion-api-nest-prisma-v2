/*
  Warnings:

  - You are about to drop the column `precioUnitario` on the `detallecompra` table. All the data in the column will be lost.
  - Added the required column `precioCompra` to the `DetalleCompra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioVenta` to the `DetalleCompra` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detallecompra` DROP COLUMN `precioUnitario`,
    ADD COLUMN `precioCompra` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `precioVenta` DECIMAL(10, 2) NOT NULL;
