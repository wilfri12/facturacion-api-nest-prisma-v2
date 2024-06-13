import { Module } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { ContactoController } from './contacto.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ContactoController],
  providers: [ContactoService, PrismaService],
})
export class ContactoModule {}
