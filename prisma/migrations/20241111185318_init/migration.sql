-- AlterTable
ALTER TABLE `reportefinanciero` ADD COLUMN `delete` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `transaccion` ADD COLUMN `delete` BOOLEAN NOT NULL DEFAULT false;
