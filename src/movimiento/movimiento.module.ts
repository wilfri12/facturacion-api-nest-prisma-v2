import { Module } from '@nestjs/common';
import { MovimientoService } from './movimiento.service';
import { MovimientoController } from './movimiento.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MovimientoController],
  providers: [MovimientoService, PrismaService],
})
export class MovimientoModule {}
