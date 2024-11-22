import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService, PrismaService, JwtService],
})
export class CategoriaModule {}
