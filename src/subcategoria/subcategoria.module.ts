import { Module } from '@nestjs/common';
import { SubcategoriaService } from './subcategoria.service';
import { SubcategoriaController } from './subcategoria.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SubcategoriaController],
  providers: [SubcategoriaService, PrismaService, JwtService],
})
export class SubcategoriaModule {}
