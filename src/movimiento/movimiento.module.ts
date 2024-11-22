import { Module } from '@nestjs/common';
import { MovimientoController } from './movimiento.controller';
import { PrismaService } from 'src/prisma.service';
import { PrinterService } from 'src/printer/printer.service';
import { MovimientoService } from './movimiento.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MovimientoController],
  providers: [MovimientoService, PrismaService, PrinterService, JwtService],
})
export class MovimientoModule {}
