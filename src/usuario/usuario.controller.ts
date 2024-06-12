import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from '@prisma/client';

@Controller('api/v1/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(@Body() data: any): Promise<any> {
    try {
      
      const usuario = await this.usuarioService.createUsuario(data);

      return { success: true, usuario }; 

    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Get()
  async find(): Promise<Usuario[]>
  {
    const usuarios = this.usuarioService.findAllUsuario();
    return usuarios;
  }
}
