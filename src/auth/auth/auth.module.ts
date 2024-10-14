import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';

@Module({
  imports:[PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register(
      {
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '99999y' }, // 1 hora de expiración
      }
    )
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy]
})
export class AuthModule {}
