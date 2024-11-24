import { Body, Controller, Post, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayLoadDTO } from './dto';
import { Response } from 'express';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() authPayload: AuthPayLoadDTO, @Res({ passthrough: true }) res: Response) {
    const { access_token, success, message, statusCode } = await this.authService.validatedUser(authPayload);

    // Establecer el token en una cookie segura
    res.cookie('token', access_token, {
      httpOnly: true, // No accesible desde JavaScript
      secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
      sameSite: 'strict', // Previene CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    return { success, message, statusCode, access_token }; // Solo devuelve información básica
  }
}