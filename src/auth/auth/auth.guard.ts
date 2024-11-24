import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants'; // Asegúrate de definir esta constante con tu secreto
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Extraer el token de la solicitud
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Token no encontrado en la solicitud');
    }

    try {
      // Verificar y decodificar el token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // Validar el esquema del payload
      if (!payload || !payload.sub || !payload.userRole) {
        throw new UnauthorizedException('El token no contiene información válida');
      }

      // Agregar el payload al objeto `request` para usarlo más adelante
      request['usuario'] = payload;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  /**
   * Extraer el token de la solicitud.
   * Priorizamos el encabezado `Authorization` y luego verificamos las cookies.
   */
  private extractToken(request: Request): string | undefined {
    // Buscar en el encabezado Authorization
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer') {
        return token;
      }
    }

    // Buscar en las cookies
    return request.cookies?.token;
  }
}
