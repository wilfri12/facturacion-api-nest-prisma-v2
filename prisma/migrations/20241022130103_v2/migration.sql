-- AlterTable
ALTER TABLE `caja` ADD COLUMN `usuarioId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Caja` ADD CONSTRAINT `Caja_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
