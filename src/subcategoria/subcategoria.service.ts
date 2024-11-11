import { Injectable } from '@nestjs/common';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';
import { ApiResponse } from 'src/interface';
import { SubCategoria } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { GetLocalDate } from 'src/utility/getLocalDate';

@Injectable()
export class SubcategoriaService {
  constructor(private readonly prisma: PrismaService){}
 

  async create(data: CreateSubcategoriaDto[]) {
    // Supongo que 'data' es un array de categorías
    const subcategoriasData = data.map(({ categoriaId, nombre }) => ({
      categoriaId,
      nombre,
      createdAt: GetLocalDate(),
      updatedAt: GetLocalDate(),
    }));

    try {
      // Usamos createMany correctamente con un array de datos
      const subcategorias = await this.prisma.subCategoria.createMany({
        data: subcategoriasData,
      });
      return { success: true, data: subcategorias };
    } catch (error: any) {
      throw error;
    }
  }

 async findAll() : Promise<ApiResponse<SubCategoria[]>> {
    const SubCategorias =  await this.prisma.subCategoria.findMany(
      {
        include:{
          categoria: true
        }
      }
    );

    return { success: true, data: SubCategorias };
  }

  async findByCategoria(categoriaId: number) {
    try {
      
        const subCategoria = await this.prisma.subCategoria.findMany({
            where: { categoriaId: categoriaId }
        });
        return { success: true, subCategoria };
    } catch (error) {
        console.error('Error al buscar subcategorías:', error);
        return { success: false, error: 'Error al buscar subcategorías.' };
    }
}

  update(id: number, updateSubcategoriaDto: UpdateSubcategoriaDto) {
    return `This action updates a #${id} subcategoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} subcategoria`;
  }
}
