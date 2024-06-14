/*
  Warnings:

  - The values [CLIENTE,GERENTES] on the enum `Usuario_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `cliente` ADD COLUMN `tipoCliente` ENUM('FISCAL', 'FISICO') NOT NULL DEFAULT 'FISICO';

-- AlterTable
ALTER TABLE `usuario` MODIFY `role` ENUM('ADMIN', 'EMPLEADO', 'USUARIO', 'GERENTE') NOT NULL DEFAULT 'EMPLEADO';
