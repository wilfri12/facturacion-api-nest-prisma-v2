import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CompraController } from './compra.controller';
import { CompraService } from './compra.service';

@Module({
  controllers: [CompraController],
  providers: [CompraService, PrismaService],
})
export class CompraModule {}
