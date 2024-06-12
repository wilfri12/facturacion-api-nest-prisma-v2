/*
  Warnings:

  - You are about to alter the column `nombre` on the `categoria` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `nombre` on the `empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `direccion` on the `empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `telefono` on the `empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to alter the column `email` on the `empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `instagram` on the `empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `whatsapp` on the `empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to alter the column `descripcion` on the `empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `cliente` on the `factura` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `nombre` on the `producto` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `precio` on the `producto` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `nombre` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `password` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE `categoria` MODIFY `nombre` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `empresa` MODIFY `nombre` VARCHAR(50) NOT NULL,
    MODIFY `direccion` VARCHAR(50) NULL,
    MODIFY `telefono` VARCHAR(15) NULL,
    MODIFY `email` VARCHAR(50) NULL,
    MODIFY `instagram` VARCHAR(30) NULL,
    MODIFY `whatsapp` VARCHAR(15) NULL,
    MODIFY `descripcion` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `factura` MODIFY `cliente` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `producto` MODIFY `nombre` VARCHAR(50) NOT NULL,
    MODIFY `precio` DECIMAL(10, 2) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `usuario` MODIFY `nombre` VARCHAR(50) NOT NULL,
    MODIFY `password` VARCHAR(20) NOT NULL;
