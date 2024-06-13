import { Module } from '@nestjs/common';
import { DetalleOrdenCompraService } from './detalle-orden-compra.service';
import { DetalleOrdenCompraController } from './detalle-orden-compra.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DetalleOrdenCompraController],
  providers: [DetalleOrdenCompraService, PrismaService],
})
export class DetalleOrdenCompraModule {}
