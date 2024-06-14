import { Module } from '@nestjs/common';
import { MateriaPrimaService } from './materia-prima.service';
import { MateriaPrimaController } from './materia-prima.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MateriaPrimaController],
  providers: [MateriaPrimaService, PrismaService],
})
export class MateriaPrimaModule {}
