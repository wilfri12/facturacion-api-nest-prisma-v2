-- AlterTable
ALTER TABLE `reportefinanciero` ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `transaccion` ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);
