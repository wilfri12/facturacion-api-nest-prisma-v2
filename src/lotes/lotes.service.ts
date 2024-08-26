import { Injectable } from '@nestjs/common';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { LoteProducto } from '@prisma/client';

@Injectable()
export class LotesService {

  constructor(private readonly prisma: PrismaService) { }
  create(createLoteDto: CreateLoteDto) {
    return 'This action adds a new lote';
  }

  async findAll(): Promise<ApiResponse<LoteProducto[]>> {
    try {
      const lotes = await this.prisma.loteProducto.findMany({
        include:{
          producto:{
            select:{
              codigo: true,
              codigoBarras: true,
              nombre: true,
            }
          }
        }
      });
      return { success: true, data: lotes };
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} lote`;
  }

  update(id: number, updateLoteDto: UpdateLoteDto) {
    return `This action updates a #${id} lote`;
  }

  remove(id: number) {
    return `This action removes a #${id} lote`;
  }
}
