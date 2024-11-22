import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CompraController } from './compra.controller';
import { CompraService } from './compra.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CompraController],
  providers: [CompraService, PrismaService, JwtService],
})
export class CompraModule {}
