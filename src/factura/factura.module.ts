import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { PrismaService } from '../prisma.service';
import { DetalleFacturaService } from 'src/shop/detalle-factura/detalle-factura.service';

@Module({
  controllers: [FacturaController],
  providers: [FacturaService, PrismaService, DetalleFacturaService],
})
export class FacturaModule {}
