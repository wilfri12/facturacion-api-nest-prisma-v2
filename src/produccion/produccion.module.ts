import { Module } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import { ProduccionController } from './produccion.controller';
import { PrismaService } from 'src/prisma.service';
import { DetalleProduccionService } from 'src/detalle-produccion/detalle-produccion.service';
import { ProductoService } from 'src/producto/producto.service';
import { MateriaPrimaService } from 'src/materia-prima/materia-prima.service';

@Module({
  controllers: [ProduccionController],
  providers: [ProduccionService, PrismaService, DetalleProduccionService, ProductoService, MateriaPrimaService],
})
export class ProduccionModule {}
