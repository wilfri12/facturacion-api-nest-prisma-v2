import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubcategoriaService } from './subcategoria.service';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';

@Controller('api/v1/subcategoria')
export class SubcategoriaController {
  constructor(private readonly subcategoriaService: SubcategoriaService) {}

  @Post()
  async create(@Body() data: CreateSubcategoriaDto[]) {
    try {
      const subcategorias = await this.subcategoriaService.create(data);
      return subcategorias;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get()
  findAll() {
    return this.subcategoriaService.findAll();
  }

  @Get(':id')
  findByCategoria(@Param('id') id: string) {
    return this.subcategoriaService.findByCategoria(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubcategoriaDto: UpdateSubcategoriaDto) {
    return this.subcategoriaService.update(+id, updateSubcategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoriaService.remove(+id);
  }
}
