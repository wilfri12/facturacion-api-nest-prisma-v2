/*
  Warnings:

  - You are about to drop the column `cliente` on the `factura` table. All the data in the column will be lost.
  - Added the required column `usuarioId` to the `OrdenCompra` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `factura_cliente_idx` ON `factura`;

-- AlterTable
ALTER TABLE `factura` DROP COLUMN `cliente`,
    ADD COLUMN `clienteId` INTEGER NULL,
    ADD COLUMN `clienteNombre` VARCHAR(50) NULL,
    ADD COLUMN `usuarioId` INTEGER NULL;

-- AlterTable
ALTER TABLE `ordencompra` ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `factura_cliente_idx` ON `Factura`(`clienteNombre`);

-- AddForeignKey
ALTER TABLE `Factura` ADD CONSTRAINT `Factura_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Factura` ADD CONSTRAINT `Factura_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenCompra` ADD CONSTRAINT `OrdenCompra_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
