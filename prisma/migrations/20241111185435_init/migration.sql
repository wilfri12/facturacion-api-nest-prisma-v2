-- AlterTable
ALTER TABLE `movimientoinventario` MODIFY `tipo` ENUM('ENTRADA', 'SALIDA', 'AJUSTE') NOT NULL DEFAULT 'ENTRADA';
