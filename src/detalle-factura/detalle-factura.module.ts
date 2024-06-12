import { Module } from '@nestjs/common';
import { DetalleFacturaService } from './detalle-factura.service';
import { DetalleFacturaController } from './detalle-factura.controller';
import { PrismaService } from '../prisma.service';
import { FacturaService } from 'src/factura/factura.service';

@Module({
  controllers: [DetalleFacturaController],
  providers: [DetalleFacturaService, PrismaService, FacturaService],
})
export class DetalleFacturaModule {}
