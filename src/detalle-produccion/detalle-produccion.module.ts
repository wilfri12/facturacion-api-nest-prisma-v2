import { Module } from '@nestjs/common';
import { DetalleProduccionService } from './detalle-produccion.service';
import { DetalleProduccionController } from './detalle-produccion.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DetalleProduccionController],
  providers: [DetalleProduccionService, PrismaService],
})
export class DetalleProduccionModule {}
