import { Module } from '@nestjs/common';
import { OrdenCompraService } from './orden-compra.service';
import { OrdenCompraController } from './orden-compra.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [OrdenCompraController],
  providers: [OrdenCompraService, PrismaService],
})
export class OrdenCompraModule {}
