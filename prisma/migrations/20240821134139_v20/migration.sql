/*
  Warnings:

  - You are about to drop the column `precio` on the `loteproducto` table. All the data in the column will be lost.
  - Added the required column `precioCompra` to the `LoteProducto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loteproducto` DROP COLUMN `precio`,
    ADD COLUMN `precioCompra` DECIMAL(10, 2) NOT NULL;
