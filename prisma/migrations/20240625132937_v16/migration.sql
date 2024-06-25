/*
  Warnings:

  - You are about to drop the column `cantidadMateria` on the `detalleproduccion` table. All the data in the column will be lost.
  - You are about to drop the column `materiaPrimaId` on the `detalleproduccion` table. All the data in the column will be lost.
  - You are about to alter the column `estado` on the `producto` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- DropForeignKey
ALTER TABLE `detalleproduccion` DROP FOREIGN KEY `DetalleProduccion_materiaPrimaId_fkey`;

-- AlterTable
ALTER TABLE `detalleproduccion` DROP COLUMN `cantidadMateria`,
    DROP COLUMN `materiaPrimaId`;

-- AlterTable
ALTER TABLE `materiaprima` MODIFY `stock` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `producto` MODIFY `estado` ENUM('INSTOCK', 'OUTOFSTOCK', 'LOWSTOCK') NOT NULL DEFAULT 'OUTOFSTOCK';

-- CreateTable
CREATE TABLE `DetalleMateriaPrima` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `detalleProduccionId` INTEGER NOT NULL,
    `materiaPrimaId` INTEGER NOT NULL,
    `cantidadMateria` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DetalleMateriaPrima` ADD CONSTRAINT `DetalleMateriaPrima_detalleProduccionId_fkey` FOREIGN KEY (`detalleProduccionId`) REFERENCES `DetalleProduccion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleMateriaPrima` ADD CONSTRAINT `DetalleMateriaPrima_materiaPrimaId_fkey` FOREIGN KEY (`materiaPrimaId`) REFERENCES `MateriaPrima`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
