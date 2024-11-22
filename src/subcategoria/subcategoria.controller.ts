import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SubcategoriaService } from './subcategoria.service';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';
import { AuthGuard } from 'src/auth/auth/auth.guard';

@Controller('api/v1/subcategoria')
export class SubcategoriaController {
  constructor(private readonly subcategoriaService: SubcategoriaService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: CreateSubcategoriaDto[]) {
    try {
      const subcategorias = await this.subcategoriaService.create(data);
      return subcategorias;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.subcategoriaService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findByCategoria(@Param('id') id: string) {
    return this.subcategoriaService.findByCategoria(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubcategoriaDto: UpdateSubcategoriaDto) {
    return this.subcategoriaService.update(+id, updateSubcategoriaDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoriaService.remove(+id);
  }
}
