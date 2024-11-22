-- AlterTable
ALTER TABLE `movimientoinventario` ADD COLUMN `precioCompra` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `precioVenta` DECIMAL(10, 2) NOT NULL DEFAULT 0;
