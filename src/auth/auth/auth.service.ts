import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthPayLoadDTO } from './dto';
import { EstadoUsuario } from '@prisma/client';
import { ApiResponse } from 'src/interface';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  async validatedUser(authPayload: AuthPayLoadDTO): Promise<{
    access_token: string;
    success: boolean;
    message: string;
    statusCode: number;
  }> {
    const { nombreUsuario, password } = authPayload;

    // Buscar usuario
    const user = await this.prisma.usuario.findFirst({
      where: { nombreUsuario, estado: EstadoUsuario.HABILITADO },
      include: {
        empresa: {
          select: {
            nombre: true,
          },
        },
      },
    });

    if (user?.estado !== EstadoUsuario.HABILITADO) {
      throw new UnauthorizedException('El usuario está deshabilitado. Contacte al administrador.');
    }
    

    if (!user) {
      throw new UnauthorizedException('El usuario no está habilitado o no existe');
    }

    // Validar usuario y contraseña
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generar payload del token
      const payload = {
        sub: user.id,
        username: user.nombreUsuario,
        userRole: user.role,
        // Opcionalmente elimina datos sensibles
        empresa: { nombre: user.empresa.nombre, id: user.empresaId },
      };

      console.log(payload);


      return {
        access_token: await this.jwtService.signAsync(payload),
        success: true,
        message: 'Autorizado',
        statusCode: 200,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña es incorrecta');
    }
  }

}