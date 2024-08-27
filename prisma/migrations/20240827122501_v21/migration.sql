/*
  Warnings:

  - You are about to drop the column `saldoFinal` on the `caja` table. All the data in the column will be lost.
  - You are about to drop the column `saldoInicial` on the `caja` table. All the data in the column will be lost.
  - You are about to alter the column `nombre` on the `caja` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the `transaccion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ubicacion` to the `Caja` table without a default value. This is not possible if the table is not empty.
  - Made the column `updatedAt` on table `caja` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `transaccion` DROP FOREIGN KEY `Transaccion_cajaId_fkey`;

-- DropForeignKey
ALTER TABLE `transaccion` DROP FOREIGN KEY `Transaccion_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `transaccion` DROP FOREIGN KEY `Transaccion_facturaId_fkey`;

-- AlterTable
ALTER TABLE `caja` DROP COLUMN `saldoFinal`,
    DROP COLUMN `saldoInicial`,
    ADD COLUMN `ubicacion` VARCHAR(255) NOT NULL,
    MODIFY `nombre` VARCHAR(100) NOT NULL,
    MODIFY `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `transaccion`;

-- CreateTable
CREATE TABLE `HistorialCaja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cajaId` INTEGER NOT NULL,
    `montoInicial` DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    `montoFinal` DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    `estado` ENUM('ABIERTA', 'CERRADA') NOT NULL DEFAULT 'ABIERTA',
    `fechaApertura` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaCierre` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MovimientosCaja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historialCajaId` INTEGER NOT NULL,
    `monto` DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    `tipo` ENUM('GASTO', 'INGRESO', 'VENTA') NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `usuarioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    INDEX `MovimientosCaja_historialCajaId_idx`(`historialCajaId`),
    INDEX `MovimientosCaja_usuarioId_idx`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HistorialCaja` ADD CONSTRAINT `HistorialCaja_cajaId_fkey` FOREIGN KEY (`cajaId`) REFERENCES `Caja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientosCaja` ADD CONSTRAINT `MovimientosCaja_historialCajaId_fkey` FOREIGN KEY (`historialCajaId`) REFERENCES `HistorialCaja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MovimientosCaja` ADD CONSTRAINT `MovimientosCaja_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
