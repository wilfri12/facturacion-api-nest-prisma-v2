import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from '@prisma/client';
import { CategoriaDto } from './DTO/categoria.dto';
import { ApiResponse } from 'src/interface';
import { AuthGuard } from 'src/auth/auth/auth.guard';

@Controller('api/v1/categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: CategoriaDto[]) {
    try {
      const categorias = await this.categoriaService.createCategoria(data);
      return categorias;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @UseGuards(AuthGuard)
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
