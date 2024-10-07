import { Module } from '@nestjs/common';
import { DetalleFacturaService } from './detalle-factura.service';
import { DetalleFacturaController } from './detalle-factura.controller';
import { PrismaService } from '../../prisma.service';
import { FacturaService } from 'src/factura/factura.service';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  controllers: [DetalleFacturaController],
  providers: [DetalleFacturaService, PrismaService, FacturaService],
  imports: [PrinterModule]
})
export class DetalleFacturaModule {}
