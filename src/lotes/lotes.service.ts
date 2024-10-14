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

  async findAll(params: { startDate?: Date, endDate?: Date, page?: number, pageSize?: number })
    : Promise<ApiResponse<{ loteProducto: LoteProducto[], totalRecords: number, currentPage: number, totalPages: number }>> {
    try {
      const { startDate, endDate, page = 1, pageSize = 10 } = params;

      // Validación: evita páginas negativas o tamaños de página demasiado pequeños
      const pageNumber = Math.max(1, parseInt(page.toString()));
      const pageSizeNumber = Math.max(1, parseInt(pageSize.toString()));

      const startDateTime = startDate ? new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)) : undefined;
      const endDateTime = endDate ? new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)) : undefined;

      const [lotes, totalRecords] = await Promise.all([
        this.prisma.loteProducto.findMany({
          where: {
            AND: [
                startDateTime ? { fechaEntrada: { gte: startDateTime } } : {},
                endDateTime ? { fechaEntrada: { lte: endDateTime } } : {},
            ]
        },
          include: {
            producto: {
              select: {
                codigo: true,
                nombre: true,
              }
            }
          }, orderBy: {
            fechaEntrada: 'desc',
          }, skip: (pageNumber - 1) * pageSizeNumber,
          take: pageSizeNumber,
        }),

        this.prisma.loteProducto.count({
          where: {
              AND: [
                  startDateTime ? { fechaEntrada: { gte: startDateTime } } : {},
                  endDateTime ? { fechaEntrada: { lte: endDateTime } } : {},
              ]
          }
      })

      ]);
      const totalPages = Math.ceil(totalRecords / pageSizeNumber);
      return {
        success: true,
        data: {
          loteProducto: lotes,
          totalRecords,
          currentPage: pageNumber,
          totalPages
        }
      };
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
