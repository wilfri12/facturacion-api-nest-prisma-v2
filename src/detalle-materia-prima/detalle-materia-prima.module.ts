import { Module } from '@nestjs/common';
import { DetalleMateriaPrimaService } from './detalle-materia-prima.service';
import { DetalleMateriaPrimaController } from './detalle-materia-prima.controller';

@Module({
  controllers: [DetalleMateriaPrimaController],
  providers: [DetalleMateriaPrimaService],
})
export class DetalleMateriaPrimaModule {}
