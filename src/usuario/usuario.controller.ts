import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from '@prisma/client';
import { UsuarioDto } from './DTO/usuario.dto';
import { ApiResponse } from 'src/interface';

@Controller('api/v1/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

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
}
