import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { constants } from 'buffer';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async validatedUser(username: string, pass: string): Promise<any> {

    const user = await this.prisma.usuario.findFirst({
       where: { nombreUsuario: username },
       include:{
        empresa:{
          select: {
            nombre: true
          }
        }
       } 
      });

    if (user && await bcrypt.compare(pass, user.password)) {

      const payload = { sub: user.id, username: user.nombreUsuario, userRole: user.role, created: user.createdAt, empresa: {nombre: user.empresa.nombre, id: user.empresaId} };
      return {
        access_token: await this.jwtService.signAsync(payload),

      };
    }

    throw new UnauthorizedException();
  }
}