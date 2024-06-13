import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from '@prisma/client';
import { CategoriaDto } from './DTO/categoria.dto';
import { ApiResponse } from 'src/interface';

@Controller('api/v1/categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  async create(@Body() data: CategoriaDto): Promise<ApiResponse<Categoria>> {
    try {
      const categoria = await this.categoriaService.createCategoria(data);
      return categoria;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get()
  async find(): Promise<ApiResponse<Categoria[]>> {
    try {
      const categorias = await this.categoriaService.findAllCategoria();
      return categorias;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
