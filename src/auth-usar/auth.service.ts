import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayLoadDTO} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService, 
    private readonly jwtService: JwtService
  ) {}

  /**
   * Valida el usuario mediante nombre de usuario y contraseña.
   * @param data - Datos de autenticación
   * @returns Usuario sin el campo de contraseña o null si no coincide.
   */
  async validateUser(data: AuthPayLoadDTO): Promise<Usuario | null> {
    const { nombreUsuario, password } = data;

    const user = await this.prisma.usuario.findUnique({ where: { nombreUsuario } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user; // Excluir el password
      return result as Usuario; // Retorna el usuario sin la contraseña
    }
    throw new UnauthorizedException('Invalid credentials'); // Manejo de credenciales incorrectas
  }

  /**
   * Genera un token de acceso para el usuario autenticado que nunca expira.
   * @param user - Datos del usuario
   * @returns Objeto con access_token
   */
  async login(user: Usuario): Promise<any> {
    const { nombreUsuario, id, role } = user;
    
    // Generar el payload para el JWT
    const payload = { userName: nombreUsuario, sub: id, role };
    
    // Crear el token de acceso SIN expiración
    const accessToken = this.jwtService.sign(payload, { expiresIn: '9999 years' });
    
    // Devolver el access_token
    return {
      access_token: accessToken,
    };
  }
}
