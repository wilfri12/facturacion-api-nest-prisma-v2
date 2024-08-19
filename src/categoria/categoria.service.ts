import { Injectable } from '@nestjs/common';
import { Categoria } from '@prisma/client';
import { CategoriaDto } from './DTO/categoria.dto';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { GetLocalDate } from 'src/utility/getLocalDate';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) { }

  async createCategoria(data: CategoriaDto): Promise<ApiResponse<Categoria>> {
    const { empresaId, nombre } = data;
    const categoriaData = {
      empresaId,
      nombre,
      createdAt: GetLocalDate(),
      updatedAt: GetLocalDate(),
    };

    try {
      const categoria = await this.prisma.categoria.create({ data: categoriaData });
      return { success: true, data: categoria };
    } catch (error: any) {
      throw error;
    }
  }

  async findAllCategoria(): Promise<ApiResponse<Categoria[]>> {
    try {
      const categorias = await this.prisma.categoria.findMany();
      return { success: true, data: categorias };
    } catch (error: any) {
      throw error;
    }
  }
}
