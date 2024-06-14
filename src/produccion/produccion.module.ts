import { Module } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import { ProduccionController } from './produccion.controller';
import { PrismaService } from 'src/prisma.service';
import { DetalleProduccionService } from 'src/detalle-produccion/detalle-produccion.service';

@Module({
  controllers: [ProduccionController],
  providers: [ProduccionService, PrismaService, DetalleProduccionService],
})
export class ProduccionModule {}
