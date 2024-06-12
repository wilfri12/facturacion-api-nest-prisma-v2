import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { Categoria } from '@prisma/client';

@Controller('api/v1/categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}


  @Post()
  async create(@Body() data: any): Promise<any> {
    try {
      
      const categoria = await this.categoriaService.createCategoria(data);

      return { success: true, categoria }; 

    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Get()
  async find(): Promise<Categoria[]>
  {
    const categorias = this.categoriaService.findAllCategoria();
    return categorias;
  }
}
