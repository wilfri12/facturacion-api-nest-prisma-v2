/*
  Warnings:

  - You are about to drop the column `contactoId` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the column `idTransaccionAnulada` on the `transaccioncompra` table. All the data in the column will be lost.
  - You are about to drop the column `idTransaccionAnulada` on the `transaccionventa` table. All the data in the column will be lost.
  - You are about to drop the `atributo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `descuento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `descuentocliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `descuentoproducto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `descuentosubcategoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `devolucioncliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gastosoperativos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historialdescuentos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historialprecio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notificacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permiso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productoatributo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promocion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promociondetalle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reportefinanciero` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rolpermiso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transaccion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `valoratributo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `descuento` DROP FOREIGN KEY `Descuento_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `descuentocliente` DROP FOREIGN KEY `DescuentoCliente_clienteId_fkey`;

-- DropForeignKey
ALTER TABLE `descuentocliente` DROP FOREIGN KEY `DescuentoCliente_descuentoId_fkey`;

-- DropForeignKey
ALTER TABLE `descuentocliente` DROP FOREIGN KEY `DescuentoCliente_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `descuentoproducto` DROP FOREIGN KEY `DescuentoProducto_descuentoId_fkey`;

-- DropForeignKey
ALTER TABLE `descuentoproducto` DROP FOREIGN KEY `DescuentoProducto_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `descuentoproducto` DROP FOREIGN KEY `DescuentoProducto_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `descuentosubcategoria` DROP FOREIGN KEY `DescuentoSubcategoria_descuentoId_fkey`;

-- DropForeignKey
ALTER TABLE `descuentosubcategoria` DROP FOREIGN KEY `DescuentoSubcategoria_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `descuentosubcategoria` DROP FOREIGN KEY `DescuentoSubcategoria_subCategoriaId_fkey`;

-- DropForeignKey
ALTER TABLE `devolucioncliente` DROP FOREIGN KEY `DevolucionCliente_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `devolucioncliente` DROP FOREIGN KEY `DevolucionCliente_facturaId_fkey`;

-- DropForeignKey
ALTER TABLE `devolucioncliente` DROP FOREIGN KEY `DevolucionCliente_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `devolucioncliente` DROP FOREIGN KEY `DevolucionCliente_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `empresa` DROP FOREIGN KEY `Empresa_contactoId_fkey`;

-- DropForeignKey
ALTER TABLE `gastosoperativos` DROP FOREIGN KEY `GastosOperativos_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `historialdescuentos` DROP FOREIGN KEY `HistorialDescuentos_descuentoId_fkey`;

-- DropForeignKey
ALTER TABLE `historialdescuentos` DROP FOREIGN KEY `HistorialDescuentos_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `historialdescuentos` DROP FOREIGN KEY `HistorialDescuentos_facturaId_fkey`;

-- DropForeignKey
ALTER TABLE `historialdescuentos` DROP FOREIGN KEY `HistorialDescuentos_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `historialprecio` DROP FOREIGN KEY `HistorialPrecio_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `historialprecio` DROP FOREIGN KEY `HistorialPrecio_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `notificacion` DROP FOREIGN KEY `Notificacion_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `notificacion` DROP FOREIGN KEY `Notificacion_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `productoatributo` DROP FOREIGN KEY `ProductoAtributo_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `productoatributo` DROP FOREIGN KEY `ProductoAtributo_valorAtributoId_fkey`;

-- DropForeignKey
ALTER TABLE `promocion` DROP FOREIGN KEY `Promocion_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `promociondetalle` DROP FOREIGN KEY `PromocionDetalle_descuentoId_fkey`;

-- DropForeignKey
ALTER TABLE `promociondetalle` DROP FOREIGN KEY `PromocionDetalle_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `promociondetalle` DROP FOREIGN KEY `PromocionDetalle_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `promociondetalle` DROP FOREIGN KEY `PromocionDetalle_promocionId_fkey`;

-- DropForeignKey
ALTER TABLE `reportefinanciero` DROP FOREIGN KEY `ReporteFinanciero_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `rolpermiso` DROP FOREIGN KEY `RolPermiso_permisoId_fkey`;

-- DropForeignKey
ALTER TABLE `transaccion` DROP FOREIGN KEY `Transaccion_compraId_fkey`;

-- DropForeignKey
ALTER TABLE `transaccion` DROP FOREIGN KEY `Transaccion_empresaId_fkey`;

-- DropForeignKey
ALTER TABLE `transaccion` DROP FOREIGN KEY `Transaccion_facturaId_fkey`;

-- DropForeignKey
ALTER TABLE `valoratributo` DROP FOREIGN KEY `ValorAtributo_atributoId_fkey`;

-- DropIndex
DROP INDEX `Empresa_contactoId_key` ON `empresa`;

-- AlterTable
ALTER TABLE `contacto` ADD COLUMN `empresaId` INTEGER NULL;

-- AlterTable
ALTER TABLE `empresa` DROP COLUMN `contactoId`;

-- AlterTable
ALTER TABLE `transaccioncompra` DROP COLUMN `idTransaccionAnulada`;

-- AlterTable
ALTER TABLE `transaccionventa` DROP COLUMN `idTransaccionAnulada`;

-- DropTable
DROP TABLE `atributo`;

-- DropTable
DROP TABLE `descuento`;

-- DropTable
DROP TABLE `descuentocliente`;

-- DropTable
DROP TABLE `descuentoproducto`;

-- DropTable
DROP TABLE `descuentosubcategoria`;

-- DropTable
DROP TABLE `devolucioncliente`;

-- DropTable
DROP TABLE `gastosoperativos`;

-- DropTable
DROP TABLE `historialdescuentos`;

-- DropTable
DROP TABLE `historialprecio`;

-- DropTable
DROP TABLE `notificacion`;

-- DropTable
DROP TABLE `permiso`;

-- DropTable
DROP TABLE `productoatributo`;

-- DropTable
DROP TABLE `promocion`;

-- DropTable
DROP TABLE `promociondetalle`;

-- DropTable
DROP TABLE `reportefinanciero`;

-- DropTable
DROP TABLE `rolpermiso`;

-- DropTable
DROP TABLE `transaccion`;

-- DropTable
DROP TABLE `valoratributo`;

-- AddForeignKey
ALTER TABLE `Contacto` ADD CONSTRAINT `Contacto_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
