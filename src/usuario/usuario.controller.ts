import { Body, Controller, Get, Param, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from '@prisma/client';
import { UpdateUsuarioDto, UsuarioDto } from './DTO/usuario.dto';
import { ApiResponse } from 'src/interface';

@Controller('api/v1/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Post()
  async create(@Body() data: UsuarioDto): Promise<ApiResponse<Usuario>> {
    try {
      const response = await this.usuarioService.createUsuario(data);
      if (response.success) {
        return {
          success: true,
          data: response.data,
        };
        
      }
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() UpdateUsuarioDto: UpdateUsuarioDto,
  ) {
    const response = await this.usuarioService.update(+id, UpdateUsuarioDto);
    return response;
  }
}
