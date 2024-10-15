/*
  Warnings:

  - You are about to drop the column `proveedorId` on the `compra` table. All the data in the column will be lost.
  - The values [PROVEEDORES] on the enum `Reporte_tipo` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `devolucionproveedor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proveedor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `compra` DROP FOREIGN KEY `Compra_proveedorId_fkey`;

-- DropForeignKey
ALTER TABLE `devolucionproveedor` DROP FOREIGN KEY `DevolucionProveedor_compraId_fkey`;

-- DropForeignKey
ALTER TABLE `devolucionproveedor` DROP FOREIGN KEY `DevolucionProveedor_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `devolucionproveedor` DROP FOREIGN KEY `DevolucionProveedor_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `devolucionproveedor` DROP FOREIGN KEY `DevolucionProveedor_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `proveedor` DROP FOREIGN KEY `Proveedor_contactoId_fkey`;

-- DropForeignKey
ALTER TABLE `proveedor` DROP FOREIGN KEY `Proveedor_empresaId_fkey`;

-- AlterTable
ALTER TABLE `compra` DROP COLUMN `proveedorId`;

-- AlterTable
ALTER TABLE `reporte` MODIFY `tipo` ENUM('VENTAS', 'COMPRAS', 'INVENTARIO', 'CLIENTES') NOT NULL;

-- DropTable
DROP TABLE `devolucionproveedor`;

-- DropTable
DROP TABLE `proveedor`;
