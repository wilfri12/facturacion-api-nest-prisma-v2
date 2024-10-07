import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { PrismaService } from '../prisma.service';
import { DetalleFacturaService } from 'src/shop/detalle-factura/detalle-factura.service';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  controllers: [FacturaController],
  providers: [FacturaService, PrismaService, DetalleFacturaService],
  imports: [PrinterModule]

})
export class FacturaModule {}
