import { Module } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { LotesController } from './lotes.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [LotesController],
  providers: [LotesService, PrismaService],
})
export class LotesModule {}
