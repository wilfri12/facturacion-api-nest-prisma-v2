import { Module } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [EmpresaController],
  providers: [EmpresaService, PrismaService, JwtService],
})
export class EmpresaModule {}
