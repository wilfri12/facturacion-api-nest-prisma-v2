import { Module } from '@nestjs/common';
import { DetalleMateriaPrimaService } from './detalle-materia-prima.service';
import { DetalleMateriaPrimaController } from './detalle-materia-prima.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DetalleMateriaPrimaController],
  providers: [DetalleMateriaPrimaService, PrismaService],
})
export class DetalleMateriaPrimaModule {}
