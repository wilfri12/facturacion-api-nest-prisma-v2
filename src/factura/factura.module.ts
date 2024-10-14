import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { PrismaService } from '../prisma.service';
import { DetalleFacturaService } from 'src/shop/detalle-factura/detalle-factura.service';
import { PrinterModule } from 'src/printer/printer.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [FacturaController],
  providers: [FacturaService, PrismaService, DetalleFacturaService, JwtService],
  imports: [PrinterModule]

})
export class FacturaModule {}
