import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaService } from '../prisma.service';
import { EncryptionService } from 'src/utility/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, PrismaService, EncryptionService, JwtService],
})
export class UsuarioModule {}
