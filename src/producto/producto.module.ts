import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  
  controllers: [ProductoController],
  providers: [ProductoService, PrismaService, JwtService],
})
export class ProductoModule {}
