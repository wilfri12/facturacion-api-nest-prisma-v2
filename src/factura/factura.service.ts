import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { FacturaDto } from './DTO/factura.dto';
import { DetalleFactura, Estado, EstadoLote, EstadoProducto, EstadoTransaccion, Factura, MetodoPago } from '@prisma/client';
import { PrinterService } from 'src/printer/printer.service';
import { facturaReport } from 'report/factura.report';
import { FacturaInterface } from 'src/interface/factura.interface';
import { GetLocalDate } from 'src/utility/getLocalDate';

@Injectable()
export class FacturaService {
  constructor(
    private prisma: PrismaService,
    private readonly printerService: PrinterService
  ) { }

  /**
 * Crea una nueva factura y sus detalles asociados, manejando el inventario de productos
 * por lotes y actualizando precios según el lote más antiguo disponible.
 * 
 * @param data - Los datos necesarios para crear la factura, incluyendo los detalles.
 * @returns Una respuesta que indica si la factura se creó correctamente o si ocurrió un error.
 */
  async createFactura(
    data: FacturaDto & { detalles: DetalleFactura[] },
  ): Promise<ApiResponse<Factura>> {
    try {
      let subtotalTotal = 0;
      let totalItebis = 0;

      const {
        detalles,
        empresaId,
        metodoPago,
        moneda,
        usuarioId,
        clienteId,
        clienteNombre,
        cajaId,
      } = data;

      if (!data || !detalles || detalles.length === 0) {
        throw new Error('No se recibió ningún dato en la factura');
      }

      const empresaIdNumber = parseInt(empresaId.toString());
      const usuarioIdNumber = parseInt(usuarioId.toString());
      const clienteIdNumber = clienteId ? parseInt(clienteId.toString()) : null;
      const cajaIdNumber = cajaId ? cajaId : 1;
      const createdAt = GetLocalDate();
      const updatedAt = GetLocalDate();
      const estadoFactura = metodoPago === MetodoPago.CREDITO ? Estado.PENDIENTE : Estado.PAGADA;

      const facturaData = {
        codigo: 'FACT-', // El código se completará después con el ID de la factura
        empresaId: empresaIdNumber,
        estado: estadoFactura,
        itebisTotal: 0,
        metodoPago,
        moneda,
        cajaId: cajaIdNumber,
        subtotal: 0,
        total: 0,
        usuarioId: usuarioIdNumber,
        clienteId: clienteIdNumber || null,
        clienteNombre,
        createdAt,
        updatedAt,
      };

      const factura = await this.prisma.$transaction(async (prisma) => {
        const secuencia = await prisma.secuencias.findUnique({ where: { nombre: 'factura' } });
        const secuenciaFactura = (secuencia?.valor || 0) + 1;
        await prisma.secuencias.update({
          where: { nombre: 'factura' },
          data: { valor: secuenciaFactura },
        });

        const createdFactura = await prisma.factura.create({
          data: facturaData,
        });

        const productoIds = detalles.map((detalle) => detalle.productoId);
        const productos = await prisma.producto.findMany({
          where: { id: { in: productoIds } },
        });

        const detalleFacturaData = [];
        const movimientoInventarioData = [];
        const productoUpdates = [];
        const loteUpdates = [];

        for (const detalle of detalles) {
          const producto = productos.find((p) => p.id === detalle.productoId);
          if (!producto) throw new Error(`Producto ID ${detalle.productoId} no encontrado`);

          const precioUnitario = parseFloat(producto.precio.toString());
          const cantidad = parseInt(detalle.cantidad.toString());
          const itebisPorcentaje = parseFloat(detalle.itebis.toString()) / 100;

          if (producto.stock < cantidad) {
            console.log('cantidad', cantidad);
            console.log('producto.stock', producto.stock);
            console.log('producto.stock < cantidad', producto.stock < cantidad);

            throw new Error(`Inventario insuficiente para el producto ${producto.nombre}`);
          }

          const importe = cantidad * precioUnitario;
          const itebisCalculado = importe * itebisPorcentaje;

          subtotalTotal += importe;
          totalItebis += itebisCalculado;

          detalleFacturaData.push({
            facturaId: createdFactura.id,
            productoId: detalle.productoId,
            empresaId: empresaIdNumber,
            cantidad,
            precioUnitario,
            itebis: itebisCalculado,
            importe,
            createdAt,
            updatedAt,
          });

          movimientoInventarioData.push({
            productoId: detalle.productoId,
            tipo: 'SALIDA',
            cantidad,
            descripcion: `Venta en factura FACT-${createdFactura.id}`,
            usuarioId: usuarioIdNumber,
            empresaId: empresaIdNumber,
            createdAt,
            updatedAt,
          });

          // Obtener lotes del producto ordenados por fecha de vencimiento (FIFO)
          const lotes = await prisma.loteProducto.findMany({
            where: { productoId: detalle.productoId, cantidadRestante: { gt: 0 }, estado: EstadoLote.ACTIVO },
            orderBy: { fechaEntrada: 'asc' },
          });

          let _cantidadRestante = cantidad;

          // Restar cantidades de los lotes
          for (const lote of lotes) {
            if (_cantidadRestante <= 0) break;

            const cantidadARestar = Math.min(lote.cantidadRestante, _cantidadRestante);
            loteUpdates.push({
              where: { id: lote.id },
              data: { cantidadRestante: lote.cantidadRestante - cantidadARestar, updatedAt },
            });

            _cantidadRestante -= cantidadARestar;
          }

          const nuevoStock = producto.stock - cantidad;
          const estadoProducto = nuevoStock <= 0 ? 'OUTOFSTOCK' : nuevoStock <= 10 ? 'LOWSTOCK' : 'INSTOCK';

          productoUpdates.push({
            where: { id: detalle.productoId },
            data: {
              stock: nuevoStock,
              estado: estadoProducto,
              updatedAt,
            },
          });
        }

        await prisma.detalleFactura.createMany({ data: detalleFacturaData });
        await prisma.movimientoInventario.createMany({ data: movimientoInventarioData });

        for (const update of productoUpdates) {
          await prisma.producto.update(update);
        }

        for (const loteUpdate of loteUpdates) {
          await prisma.loteProducto.update(loteUpdate);
        }

        

        const transaccionFacturaCreated = await prisma.transaccionVenta.create({
          data: {
            facturaId: createdFactura.id,
            usuarioId: usuarioIdNumber,
            empresaId: empresaIdNumber,
            createdAt,
            updatedAt,
          },
        });

        await prisma.transaccion.create({
          data: {
            tipo: 'VENTA',
            monto: subtotalTotal + totalItebis,
            empresaId,
            fecha: createdAt,
            facturaId: createdFactura.id
          }
        });

        await prisma.detalleFactura.updateMany({
          where: { facturaId: createdFactura.id },
          data: { transaccionVentaId: transaccionFacturaCreated.id },
        });


        const facturaUpdated = await prisma.factura.update({
          where: { id: createdFactura.id },
          data: {
            subtotal: subtotalTotal,
            total: subtotalTotal + totalItebis,
            itebisTotal: totalItebis,
            codigo: `FACT-${secuenciaFactura}`,
            estado: estadoFactura,
            updatedAt,
          },
          include: {
            detallesFacturas: {
              select: {
                id: true,
                producto: {
                  select: {
                    id: true,
                    nombre: true,
                    precio: true,
                    descripcion: true,
                    codigo: true,
                    categoria: {
                      select: {
                        nombre: true,
                      }
                    }
                  }
                },
                cantidad: true,
                importe: true,
              }
            },
            Caja: {
              select: {
                id: true,
                nombre: true,
              }
            },
            usuario: {
              select: {
                id: true,
                nombreUsuario: true,
              },
            },
            empresa: {
              select: {
                id: true,
                nombre: true,
              },
            },
          }
        });

        console.log(facturaUpdated);
        

        return facturaUpdated;
      });

      return { success: true, data: factura };
    } catch (error: any) {
      console.error('Error al crear la factura:', error);
      return { success: false, error: `${error}` };
    }
  }




  async findAllFactura(params: { startDate?: Date, endDate?: Date, estado?: Estado, page?: number, pageSize?: number }): Promise<ApiResponse<{ facturas: Factura[], totalRecords: number, currentPage: number, totalPages: number }>> {
    const { startDate, endDate, estado, page = 1, pageSize = 10 } = params;

    // Validación: evita páginas negativas o tamaños de página demasiado pequeños
    const pageNumber = Math.max(1, parseInt(page.toString()));
    const pageSizeNumber = Math.max(1, parseInt(pageSize.toString()));

    try {
      const startDateTime = startDate ? new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)) : undefined;
      const endDateTime = endDate ? new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)) : undefined;
      // Obtener el total de registros que coinciden con los filtros
      const [facturas, totalRecords] = await Promise.all([
        this.prisma.factura.findMany({
          where: {
            AND: [
              startDateTime ? { createdAt: { gte: startDateTime } } : {},
              endDateTime ? { createdAt: { lte: endDateTime } } : {},
              estado ? { estado: estado } : {}
            ]
          },
          include: {
            detallesFacturas: {
              select: {
                id: true,
                producto: {
                  select: {
                    id: true,
                    nombre: true,
                    precio: true,
                    descripcion: true,
                    codigo: true,
                    categoria: {
                      select: {
                        nombre: true,
                      }
                    }
                  }
                },
                cantidad: true,
                importe: true,
              }
            },
            Caja: {
              select: {
                id: true,
                nombre: true,
              }
            },
            usuario: {
              select: {
                id: true,
                nombreUsuario: true,
              },
            },
            empresa: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
          orderBy: {
            id: 'desc'
          },
          skip: (pageNumber - 1) * pageSizeNumber,
          take: pageSizeNumber,
        }),
        this.prisma.factura.count({
          where: {
            AND: [
              startDateTime ? { createdAt: { gte: startDateTime } } : {},
              endDateTime ? { createdAt: { lte: endDateTime } } : {},
              estado ? { estado: estado } : {}
            ]
          }
        })
      ]);

      const totalPages = Math.ceil(totalRecords / pageSizeNumber);
      return {
        success: true,
        data: {
          facturas,
          totalRecords,
          currentPage: pageNumber,
          totalPages
        }
      };
    } catch (error: any) {
      throw error;
    }
  }



  async findFacturaById(idFactura: number): Promise<ApiResponse<Factura>> {
    try {
      const factura = await this.prisma.factura.findUnique({
        where: {
          id: idFactura
        },
        include: {
          detallesFacturas: {
            select: {
              id: true,
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  precio: true,
                  descripcion: true,
                  codigo: true,
                  categoria: {
                    select: {
                      nombre: true,
                    }
                  }
                }
              },
              cantidad: true,
              importe: true,
            }
          },
          Caja: {
            select: {
              id: true,
              nombre: true,
            }
          },
          usuario: {
            select: {
              id: true,
              nombreUsuario: true,
            },
          },
          empresa: {
            select: {
              id: true,
              nombre: true,
            },
          },
        }

      })
      return { success: true, data: factura }
    } catch (error: any) {
      throw error;
    }
  }

  async facturaReportById(idFactura: number) {
    try {
      const factura = await this.prisma.factura.findUnique({
        where: { id: idFactura },
        include: {
          detallesFacturas: {
            select: {
              id: true,
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  precio: true,
                  descripcion: true,
                  codigo: true,
                  categoria: {
                    select: {
                      nombre: true,
                    },
                  },
                },
              },
              cantidad: true,
              importe: true,
            },
          },
          Caja: {
            select: {
              id: true,
              nombre: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombreUsuario: true,
            },
          },
          empresa: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });
      if (!factura) {
        throw new Error(`Factura with ID ${idFactura} not found`);
      }

      const docDefinition = facturaReport(factura); // Ensure 'factura' is passed here
      const pdfDoc = await this.printerService.createPdf(docDefinition);
      return pdfDoc;
    } catch (error: any) {
      console.error('Error generating factura report:', error);
      throw error; // Rethrow or handle accordingly
    }
  }


  async pagarFactura(id: number): Promise<ApiResponse<Factura>> {
    try {
      // Busca la factura por ID
      const factura = await this.prisma.factura.findUnique({
        where: { id }
      });

      // Verifica si la factura existe
      if (!factura) {
        throw new Error('Factura no encontrada');
      }

      // Actualiza el estado de la factura a PAGADA y guarda la fecha de actualización
      const facturaActualizada = await this.prisma.factura.update({
        data: {
          estado: Estado.PAGADA,
          updatedAt: GetLocalDate()
        },
        where: { id }
      });

      // Retorna la respuesta de éxito junto con la factura actualizada
      return { success: true, data: facturaActualizada };

    } catch (error) {
      console.error("Error al pagar la factura:", error);

      // Retorna una respuesta de error con el mensaje de error específico
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }



}
