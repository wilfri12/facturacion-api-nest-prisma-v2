-- AlterTable
ALTER TABLE `loteproducto` ADD COLUMN `cantidadRestante` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Caja_nombre_idx` ON `Caja`(`nombre`);

-- CreateIndex
CREATE INDEX `Categoria_nombre_idx` ON `Categoria`(`nombre`);

-- CreateIndex
CREATE INDEX `Compra_createdAt_idx` ON `Compra`(`createdAt`);

-- CreateIndex
CREATE INDEX `Empresa_id_idx` ON `Empresa`(`id`);

-- CreateIndex
CREATE INDEX `Factura_createdAt_idx` ON `Factura`(`createdAt`);

-- CreateIndex
CREATE INDEX `Producto_nombre_idx` ON `Producto`(`nombre`);

-- CreateIndex
CREATE INDEX `ReporteFinanciero_empresaId_fechaInicio_fechaFin_idx` ON `ReporteFinanciero`(`empresaId`, `fechaInicio`, `fechaFin`);

-- CreateIndex
CREATE INDEX `SubCategoria_nombre_idx` ON `SubCategoria`(`nombre`);

-- CreateIndex
CREATE INDEX `Transaccion_empresaId_fecha_idx` ON `Transaccion`(`empresaId`, `fecha`);

-- CreateIndex
CREATE INDEX `Transaccion_tipo_idx` ON `Transaccion`(`tipo`);
