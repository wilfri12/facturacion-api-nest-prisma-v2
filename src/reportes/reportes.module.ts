import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ReportesController],
  providers: [ReportesService, PrismaService],
})
export class ReportesModule {}
