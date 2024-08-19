/*
  Warnings:

  - You are about to drop the column `categoriaId` on the `producto` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `producto` DROP FOREIGN KEY `Producto_categoriaId_fkey`;

-- AlterTable
ALTER TABLE `producto` DROP COLUMN `categoriaId`;
