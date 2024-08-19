import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrdenCompraController } from './compra.controller';
import { OrdenCompraService } from './compra.service';

@Module({
  controllers: [OrdenCompraController],
  providers: [OrdenCompraService, PrismaService],
})
export class OrdenCompraModule {}
