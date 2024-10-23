/*
  Warnings:

  - You are about to drop the `reporte` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `reporte` DROP FOREIGN KEY `Reporte_empresaId_fkey`;

-- DropTable
DROP TABLE `reporte`;

-- CreateTable
CREATE TABLE `Transaccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('VENTAS', 'COMPRAS', 'INVENTARIO', 'CLIENTES') NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `monto` DOUBLE NOT NULL,
    `detalles` JSON NULL,
    `empresaId` INTEGER NOT NULL,
    `categoriaId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReporteFinanciero` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaInicio` DATETIME(3) NOT NULL,
    `fechaFin` DATETIME(3) NOT NULL,
    `totalVentas` DOUBLE NOT NULL DEFAULT 0.0,
    `totalCompras` DOUBLE NOT NULL DEFAULT 0.0,
    `ganancia` DOUBLE NOT NULL DEFAULT 0.0,
    `detalles` JSON NULL,
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GastosOperativos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `concepto` VARCHAR(100) NOT NULL,
    `monto` DOUBLE NOT NULL,
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `empresaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaccion` ADD CONSTRAINT `Transaccion_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReporteFinanciero` ADD CONSTRAINT `ReporteFinanciero_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GastosOperativos` ADD CONSTRAINT `GastosOperativos_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
