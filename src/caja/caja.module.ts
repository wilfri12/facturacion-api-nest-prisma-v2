import { Module } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CajaController],
  providers: [CajaService, PrismaService, JwtService],
})
export class CajaModule {}
