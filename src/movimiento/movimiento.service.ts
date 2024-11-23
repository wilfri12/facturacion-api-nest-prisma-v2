import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { Movimiento } from './entities/movimiento.entity';
import { TipoMovimiento } from '@prisma/client';
import { PrinterService } from '../printer/printer.service';
import { reporteMovimientoEntradaSalida } from 'reports-pdf/reporteEntraSalida';

@Injectable()
export class MovimientoService {
  constructor(private readonly prisma: PrismaService,
    private readonly printerService: PrinterService
  ) { }


  
  async findAll(params: { page: number, limit: number, startDate?: Date, endDate?: Date, filtroProducto?: string, tipo?: TipoMovimiento }): Promise<ApiResponse<{ movimientos: Movimiento[], totalRecords: number, currentPage: number, totalPages: number }>> {
    try {
      const { page = 1, limit = 10, startDate, endDate, filtroProducto, tipo } = params;

      


      const pageNumber = Math.max(1, parseInt(page.toString()));
      const pageLimitNumber = Math.max(1, parseInt(limit.toString()));

      const startDateTime = startDate ? new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)) : undefined;
      const endDateTime = endDate ? new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)) : undefined;
      console.log(startDateTime);
      console.log(endDateTime);


      const [movimientos, totalRecords] = await Promise.all([

        this.prisma.movimientoInventario.findMany({
          where: {
            AND: [

              startDateTime ? { createdAt: { gte: startDateTime } } : {},
              endDateTime ? { createdAt: { lte: endDateTime } } : {},
              tipo ? { tipo: tipo } : {},
              filtroProducto
                ? {
                  producto: {
                    OR: [
                      { nombre: { contains: filtroProducto } },
                      { codigo: { contains: filtroProducto } },
                    ],
                  },
                }
                : {},
            ],
            delete: false,
          },
          include: {
            producto: {
              select: {
                codigo: true,
                nombre: true,
              }
            },
            usuario: {
              select: {
                nombreUsuario: true
              }
            }
          },
          orderBy: {
            id: 'desc'
          },
          skip: (pageNumber - 1) * Number(pageLimitNumber),
          take: Number(pageLimitNumber),

        }),

        this.prisma.movimientoInventario.count({
          where: {
            AND: [

              startDateTime ? { createdAt: { gte: startDateTime } } : {},
              endDateTime ? { createdAt: { lte: endDateTime } } : {},
              tipo ? { tipo: tipo } : {},
              filtroProducto ? { producto: { nombre: { contains: filtroProducto } } } : {},
              filtroProducto ? { producto: { codigo: { contains: filtroProducto } } } : {}
            ]
          }
        })

      ]);

      const totalPages = Math.ceil(totalRecords / pageLimitNumber);
      return {
        success: true,
        data: {
          movimientos,
          totalRecords,
          currentPage: pageNumber,
          totalPages
        }
      };
    } catch (error: any) {
      throw error;
    }
  }


  async reporteMovimiento(params: {
    startDate?: Date;
    endDate?: Date;
    filtroProducto?: string;
    tipo?: TipoMovimiento;
  }){
    try {
      const { startDate, endDate, filtroProducto, tipo } = params;
  
      const startDateTime = startDate ? new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)) : undefined;
      const endDateTime = endDate ? new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)) : undefined;
  
      console.log("Start Date:", startDateTime);
      console.log("End Date:", endDateTime);
  
      const [movimientos, totalRecords] = await Promise.all([
        this.prisma.movimientoInventario.findMany({
          where: {
            AND: [
              startDateTime ? { createdAt: { gte: startDateTime } } : {},
              endDateTime ? { createdAt: { lte: endDateTime } } : {},
              tipo ? { tipo: tipo } : {},
              filtroProducto
                ? {
                    producto: {
                      OR: [
                        { nombre: { contains: filtroProducto } },
                        { codigo: { contains: filtroProducto } },
                      ],
                    },
                  }
                : {},
            ],
          },
          include: {
            producto: {
              select: {
                codigo: true,
                nombre: true,
              },
            },
            usuario: {
              select: {
                nombreUsuario: true,
              },
            },
            empresa: true,
          },
          orderBy: {
            id: 'desc',
          },
        }),
  
        this.prisma.movimientoInventario.count({
          where: {
            AND: [
              startDateTime ? { createdAt: { gte: startDateTime } } : {},
              endDateTime ? { createdAt: { lte: endDateTime } } : {},
              tipo ? { tipo: tipo } : {},
              filtroProducto
                ? {
                    producto: {
                      OR: [
                        { nombre: { contains: filtroProducto } },
                        { codigo: { contains: filtroProducto } },
                      ],
                    },
                  }
                : {},
            ],
          },
        }),
      ]);
  
      const docDefinition = reporteMovimientoEntradaSalida({
        data: {
          movimientos,
          totalRecords,
        },
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
      });
  
      const pdfDoc = await this.printerService.createPdf(docDefinition);
  
      return pdfDoc;
    } catch (error: any) {
      console.error("Error en reporteMovimiento:", error);
      throw error;
    }
  }
  
}
