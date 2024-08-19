import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DetalleOrdenCompraController } from './detalle-compra.controller';
import { DetalleOrdenCompraService } from './detalle-compra.service';

@Module({
  controllers: [DetalleOrdenCompraController],
  providers: [DetalleOrdenCompraService, PrismaService],
})
export class DetalleOrdenCompraModule {}
