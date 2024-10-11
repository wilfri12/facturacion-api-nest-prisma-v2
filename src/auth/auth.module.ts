import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {JwtStrategy} from './jwt.strategy';
import { PrismaService } from 'src/prisma.service';


@Module({
  imports:[PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register(
      {
        secret: 'Pecreto-Pest-Prisma-Auth-28/07/2024',
        signOptions: { expiresIn: '3600s' }, // 1 hora de expiración
      }
    )
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy]
})
export class AuthModule {}
