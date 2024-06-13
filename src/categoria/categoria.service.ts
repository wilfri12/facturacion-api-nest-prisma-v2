import { Injectable } from '@nestjs/common';
import { Categoria } from '@prisma/client';
import { CategoriaDto } from './DTO/categoria.dto';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) {}

  async createCategoria(data: CategoriaDto): Promise<ApiResponse<Categoria>> {
    try {
      const categoria = await this.prisma.categoria.create({ data });
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
