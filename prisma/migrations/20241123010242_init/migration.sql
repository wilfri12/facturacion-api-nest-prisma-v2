/*
  Warnings:

  - You are about to drop the column `delete` on the `caja` table. All the data in the column will be lost.
  - You are about to drop the column `delete` on the `historialcaja` table. All the data in the column will be lost.
  - You are about to drop the column `delete` on the `movimientoscaja` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `caja` DROP COLUMN `delete`;

-- AlterTable
ALTER TABLE `historialcaja` DROP COLUMN `delete`;

-- AlterTable
ALTER TABLE `movimientoscaja` DROP COLUMN `delete`;
