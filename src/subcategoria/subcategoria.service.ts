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
 

  async create(data: CreateSubcategoriaDto): Promise<ApiResponse<SubCategoria>> {
    const {categoriaId, nombre} = data;

    const subcategoriaData = {
      categoriaId,
      nombre,
      createdAt: GetLocalDate(),
      updatedAt: GetLocalDate(),
    };

    try {
      const subcategoria = await this.prisma.subCategoria.create({
        data: subcategoriaData,
      });
      return { success: true, data: subcategoria };
    } catch (error: any) {
      throw error;
    }
  }

 async findAll() : Promise<ApiResponse<SubCategoria[]>> {
    const SubCategorias =  await this.prisma.subCategoria.findMany({
      include: {
        categoria: {
          select:{
            nombre: true, 
          }
        },
      }
    });

    return { success: true, data: SubCategorias };
  }

  findOne(id: number) {
    return `This action returns a #${id} subcategoria`;
  }

  update(id: number, updateSubcategoriaDto: UpdateSubcategoriaDto) {
    return `This action updates a #${id} subcategoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} subcategoria`;
  }
}
