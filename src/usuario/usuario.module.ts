import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaService } from '../prisma.service';
import { EncryptionService } from 'src/utility/bcrypt/bcrypt.service';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, PrismaService, EncryptionService],
})
export class UsuarioModule {}
