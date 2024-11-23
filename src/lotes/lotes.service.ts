import { Injectable } from '@nestjs/common';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { EstadoLote, EstadoProducto, LoteProducto } from '@prisma/client';
import { GetLocalDate } from 'src/utility/getLocalDate';

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
            ],
            
             delete:false,
        },
          include: {
            producto: {
              select: {
                codigo: true,
                nombre: true,
              }
            }
          }, orderBy: {
            id: 'desc',
          }, skip: (pageNumber - 1) * pageSizeNumber,
          take: pageSizeNumber,
        }),

        this.prisma.loteProducto.count({
          where: {
              AND: [
                  startDateTime ? { fechaEntrada: { gte: startDateTime } } : {},
                  endDateTime ? { fechaEntrada: { lte: endDateTime } } : {},
              ],
              delete:false,
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


  async activarLote(id: number): Promise<{ success?: boolean; message?: string; error?: string }> {
    try {
        const transaction = await this.prisma.$transaction(async (prisma) => {
            // Intentamos encontrar el lote pendiente con el producto asociado
            const lote = await prisma.loteProducto.findUnique({
                where: { id, estado: EstadoLote.PENDIENTE,  delete: false, },
                include: { producto: true },
            });

            if (!lote) {
                return { success: false, message: `Lote con ID: ${id} no encontrado, ya está activado o ha sido eliminado.` };
            }

            if (lote.cantidad <= 0) {
                return { success: false, message: `La cantidad del lote no es válida.`};
            }

            const producto = lote.producto;
            if (!producto) {
                return { success: false, message: 'Producto asociado al lote no encontrado.' };
            }

            // Validamos si el producto tiene stock existente con un precio distinto al del lote
            if (producto.stock > 0 && Math.abs(Number(producto.precio) - Number(lote.precioVenta)) > 0.01) {
              return {
                  success: false,
                  message: `No es posible activar el lote. El producto con código ${producto.codigo} aún tiene stock disponible (${producto.stock}), y el precio de venta del nuevo lote (${lote.precioVenta}) es diferente al precio actual del producto (${producto.precio}). Para activar este lote, el stock del producto debe estar en 0, o los precios deben coincidir.`,
              };
          }
          

            // Activamos el lote y actualizamos su estado y fecha de actualización
            await prisma.loteProducto.update({
                where: { id,  delete: false, },
                data: { estado: EstadoLote.ACTIVO, updatedAt: GetLocalDate() },
            });

            // Calculamos el nuevo stock del producto
            const nuevoStock = producto.stock + lote.cantidad;

            // Definimos el estado del producto según el nuevo stock
            let productoEstado: EstadoProducto = EstadoProducto.INSTOCK;
            if (nuevoStock <= 0) {
                productoEstado = EstadoProducto.OUTOFSTOCK;
            } else if (nuevoStock < 10) {
                productoEstado = EstadoProducto.LOWSTOCK;
            }

            // Actualizamos el producto con el nuevo stock, precio y estado
            await prisma.producto.update({
                where: { id: lote.productoId },
                data: {
                    stock: nuevoStock,
                    precio: lote.precioVenta,
                    updatedAt: GetLocalDate(),
                    estado: productoEstado,
                },
            });

            await prisma.compra.update({
              where: { id: lote.compraId },
              data: {
                canDelete: false,
                  updatedAt: GetLocalDate(),
              },
          });

            return { success: true, message: 'Lote activado correctamente, stock y precio actualizados.' };
        });

        return transaction;
    } catch (error) {
        console.error('Error al activar el lote:', error);
        return { success: false, error: `Ocurrió un error al activar el lote: ${error.message || error}` };
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
