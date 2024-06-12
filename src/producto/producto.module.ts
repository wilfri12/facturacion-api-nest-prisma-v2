import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { PrismaService } from '../prisma.service';

@Module({
  
  controllers: [ProductoController],
  providers: [ProductoService, PrismaService],
})
export class ProductoModule {}
