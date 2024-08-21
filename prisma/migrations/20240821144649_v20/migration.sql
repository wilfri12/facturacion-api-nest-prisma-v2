/*
  Warnings:

  - You are about to drop the column `precioCompra` on the `loteproducto` table. All the data in the column will be lost.
  - Added the required column `precioVenta` to the `LoteProducto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loteproducto` DROP COLUMN `precioCompra`,
    ADD COLUMN `precioVenta` DECIMAL(10, 2) NOT NULL;
