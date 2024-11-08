import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthPayLoadDTO } from './dto';
import { EstadoUsuario } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async validatedUser(authPayload: AuthPayLoadDTO): Promise<any> {
    const {nombreUsuario,  password } = authPayload;
    const user = await this.prisma.usuario.findFirst({
       where: { nombreUsuario, estado: EstadoUsuario.HABILITADO},
       include:{
        empresa:{
          select: {
            nombre: true
          }
        }
       } 
      });

    if (user && await bcrypt.compare(password, user.password)) {
      const payload = { sub: user.id, username: user.nombreUsuario, userRole: user.role, created: user.createdAt, empresa: {nombre: user.empresa.nombre, id: user.empresaId} };
      return {
        access_token: await this.jwtService.signAsync(payload),

      };
    }

    throw new UnauthorizedException();
  }
}