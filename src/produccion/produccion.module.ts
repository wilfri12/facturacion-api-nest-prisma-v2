import { Module } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import { ProduccionController } from './produccion.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ProduccionController],
  providers: [ProduccionService, PrismaService],
})
export class ProduccionModule {}
