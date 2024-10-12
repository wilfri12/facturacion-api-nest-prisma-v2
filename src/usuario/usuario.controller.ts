import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from '@prisma/client';
import { UsuarioDto } from './DTO/usuario.dto';
import { ApiResponse } from 'src/interface';
import { AuthPayLoadDTO } from 'src/auth/dto/auth.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('api/v1/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService, private authService: AuthService) { }

  @Post()
  async create(@Body() data: UsuarioDto): Promise<ApiResponse<Usuario>> {
    try {
      const usuario = await this.usuarioService.createUsuario(data);
      return usuario;
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Get()
  async find(): Promise<ApiResponse<Usuario[]>> {
    try {
      const usuarios = this.usuarioService.findAllUsuario();
      return usuarios;
    } catch (error) {
      return { success: false, error: error.message }
    }
  }


  @Post("auth/login")
    async login(@Body() authPayload: AuthPayLoadDTO) {
        console.log(authPayload);
        
        const user = await this.authService.validateUser(authPayload);
        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }
        return this.authService.login(user);
    }
}
