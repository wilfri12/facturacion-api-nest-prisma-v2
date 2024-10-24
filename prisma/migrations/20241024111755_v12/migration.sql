/*
  Warnings:

  - The values [CLIENTES] on the enum `Transaccion_tipo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `transaccion` MODIFY `tipo` ENUM('VENTA', 'COMPRA', 'INVENTARIO') NOT NULL;
