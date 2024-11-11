import { Injectable } from '@nestjs/common';
import { Categoria } from '@prisma/client';
import { CategoriaDto } from './DTO/categoria.dto';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { GetLocalDate } from 'src/utility/getLocalDate';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) { }

  async createCategoria(data: CategoriaDto[]) {
    // Supongo que 'data' es un array de categorías
    const categoriasData = data.map(({ empresaId, nombre }) => ({
      empresaId,
      nombre,
      createdAt: GetLocalDate(),
      updatedAt: GetLocalDate(),
    }));

    try {
      // Usamos createMany correctamente con un array de datos
      const categorias = await this.prisma.categoria.createMany({
        data: categoriasData,
      });
      return { success: true, data: categorias };
    } catch (error: any) {
      throw error;
    }
  }


  async findAllCategoria(): Promise<ApiResponse<Categoria[]>> {
    try {
      const categorias = await this.prisma.categoria.findMany({
        include: {
          SubCategoria: true
        }
      });
      return { success: true, data: categorias };
    } catch (error: any) {
      throw error;
    }
  }
}
