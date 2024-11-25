import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthPayLoadDTO } from './dto';
import { EstadoUsuario } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { CajaService } from 'src/caja/caja.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,
     private jwtService: JwtService,
     private cajaService: CajaService
    ) { }

  async validatedUser(authPayload: AuthPayLoadDTO): Promise<{
    access_token: string;
    success: boolean;
    message: string;
    statusCode: number;
  }> {
    const { nombreUsuario, password } = authPayload;
    console.log('authPayload', authPayload);
    

    // Buscar usuario
    const user = await this.prisma.usuario.findFirst({
      where: { nombreUsuario },
      include: {
        empresa: {
          select: {
            nombre: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('No se encontro ningun usuario');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña es incorrecta');
    }

    if (user?.estado !== EstadoUsuario.HABILITADO) {
      throw new UnauthorizedException('El usuario no está habilitado. Contacte al administrador.');
    }
    
    // Validar usuario y contraseña
    if (user && (await bcrypt.compare(password, user.password))) {

      const cajaAbierta = await this.cajaService.verificarCajaAbierta(user.id);
      console.log('cajaAbierta', cajaAbierta);
      


      // Generar payload del token
      const payload = {
        sub: user.id,
        username: user.nombreUsuario,
        userRole: user.role,
        cajaAbierta: {
          nombre: cajaAbierta?.nombre || null,
          id: cajaAbierta?.id || null,
          estado: cajaAbierta?.estado || null },
        empresa: { nombre: user.empresa.nombre, id: user.empresaId },
      };



      return {
        access_token: await this.jwtService.signAsync(payload),
        success: true,
        message: 'Autorizado',
        statusCode: 200,
      };
    }

    
  }

}