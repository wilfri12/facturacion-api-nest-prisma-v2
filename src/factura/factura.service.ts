import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { FacturaDto } from './DTO/factura.dto';
import { DetalleFactura, Estado, EstadoProducto, Factura, MetodoPago } from '@prisma/client';
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

      // Desestructuración de los datos de entrada 
      const {
        detalles,
        empresaId,
        estado,
        metodoPago,
        moneda,
        usuarioId,
        clienteId,
        clienteNombre,
        cajaId,
      } = data;


      if (!data || !detalles || detalles.length === 0) {
        console.error('Datos recibidos (data): ', data);
        console.error('Datos recibidos (detalles): ', detalles);
        throw new Error('No se recibió ningún dato en la factura');
      }




      const empresaIdNumber = parseInt(empresaId.toString());
      const usuarioIdNumber = parseInt(usuarioId.toString());
      const clienteIdNumber = clienteId ? parseInt(clienteId.toString()) : null;
      const cajaIdNumber = cajaId ? cajaId : 1; //Aqui si el id de la caja no se envia, se pone la caja uno por defecto.
      const createdAt = GetLocalDate();
      const updatedAt = GetLocalDate();
      const estadoFactura = metodoPago === MetodoPago.CREDITO ? Estado.PENDIENTE : Estado.PAGADA;


      // Datos base para la creación de la factura
      const facturaData = {
        codigo: 'FACT-', // El código se completará después con el ID de la factura
        empresaId: empresaIdNumber,
        estado: estadoFactura,
        itebisTotal: 0, // Se calculará después
        metodoPago,
        moneda,
        cajaId: cajaIdNumber,
        subtotal: 0, // Se calculará después
        total: 0, // Se calculará después
        usuarioId: usuarioIdNumber,
        clienteId: (clienteIdNumber || null),
        clienteNombre,
        createdAt,
        updatedAt,
      };

      // Creación de la factura y sus detalles dentro de una transacción
      const factura = await this.prisma.$transaction(async (prisma) => {
        const secuencia = await prisma.secuencias.findUnique({ where: { nombre: 'factura' } });

        const secuenciaFactura = (secuencia?.valor || 0) + 1;
        await prisma.secuencias.update({
          where: { nombre: 'factura' },
          data: { valor: secuenciaFactura },
        });


        // Crea la factura inicial
        const createdFactura = await prisma.factura.create({
          data: facturaData,
        });

        if (createdFactura) {
          const detallePromises = detalles.map(async (detalle) => {

            // Obtiene el producto para verificar el stock y obtener información de precios
            const producto = await prisma.producto.findUnique({
              where: { id: detalle.productoId },
            });

            const precioUnitarioNumber = parseFloat(producto.precio.toString());
            const cantidadNumber = parseInt(detalle.cantidad.toString());
            const itebisPorcentaje = parseFloat(detalle.itebis.toString()) / 100;

            if (!producto) {
              throw new Error(`Producto con id ${detalle.productoId} no encontrado`);
            }

            if (producto.stock < cantidadNumber) {
              throw new Error(
                `Inventario insuficiente: Solo quedan ${producto.stock} unidades del producto ${producto.nombre}  disponibles. No se puede completar la venta de ${detalle.cantidad} unidadad/des.`,
              );
            }

            // Calcula el importe del detalle (antes del ITBIS)
            const importe = cantidadNumber * precioUnitarioNumber;

            // Calcula el ITBIS del detalle
            const itebisCalculado = importe * itebisPorcentaje;

            subtotalTotal += importe;
            totalItebis += itebisCalculado;

            const detalleFacturaData = {
              facturaId: createdFactura.id,
              productoId: detalle.productoId,
              empresaId: empresaIdNumber,
              cantidad: cantidadNumber,
              precioUnitario: precioUnitarioNumber,
              itebis: itebisCalculado,
              importe,
              createdAt,
              updatedAt,
            };

            // Crea el detalle de la factura
            await prisma.detalleFactura.create({ data: detalleFacturaData });

            // Maneja la reducción de stock y la gestión de lotes
            let _cantidadRestante = cantidadNumber;

            const lotes = await prisma.loteProducto.findMany({
              where: {
                productoId: detalle.productoId,
                cantidadRestante: { gt: 0 } // Solo obtener lotes con cantidadRestante > 0
              },
              orderBy: { fechaEntrada: 'asc' }, // FIFO: Primero en entrar, primero en salir
            });

            if (lotes.length === 0) {
              throw new Error(`No hay lotes disponibles para el producto ${detalle.productoId}`);
            }

            for (const [index, lote] of lotes.entries()) {
              if (_cantidadRestante <= 0) break;

              // Verificar si la cantidad solicitada es mayor que la cantidadRestante disponible en el lote más antiguo
              if (detalle.cantidad > lote.cantidadRestante) {
                throw new Error(
                  `Solo se pueden comprar hasta ${lote.cantidadRestante} unidades del producto ${producto.nombre} debido a limitaciones de inventario en el lote actual. Por favor, ajuste la cantidad o genere una nueva factura para el lote siguiente, teniendo en cuenta que los precios pueden variar entre lotes.`
                );
              }

              if (lote.cantidadRestante <= _cantidadRestante) {
                // Si el lote se consume completamente
                _cantidadRestante -= lote.cantidadRestante;
                await prisma.loteProducto.update({
                  where: { id: lote.id },
                  data: { cantidadRestante: 0 },
                });

                // Si existe un siguiente lote, actualiza el precio del producto al del siguiente lote
                const siguienteLote = lotes[index + 1];
                if (siguienteLote) {
                  await prisma.producto.update({
                    where: { id: detalle.productoId },
                    data: {
                      precio: siguienteLote.precioVenta,
                      updatedAt: GetLocalDate(),
                    },
                  });
                } else {
                  console.log(`No hay más lotes disponibles después del lote ${lote.id}, el precio no se actualizará.`);
                }

              } else {
                // Si solo se consume parte del lote
                await prisma.loteProducto.update({
                  where: { id: lote.id },
                  data: { cantidadRestante: lote.cantidadRestante - _cantidadRestante },
                });
                _cantidadRestante = 0;
              }
            }

            const historialCajaActivo = await prisma.historialCaja.findFirst({
              where: {
                cajaId: cajaIdNumber,
                estado: 'ABIERTA',
              },
              orderBy: {
                fechaApertura: 'desc', //  obtener el historial más reciente si hay más de uno.
              },
            });
            await this.prisma.movimientosCaja.create({
              data: {
                tipo: 'VENTA',
                descripcion: `Venta de producto en factura FACT-${createdFactura.id}`,
                historialCajaId: historialCajaActivo.id,
                monto: subtotalTotal + totalItebis,
                createdAt,
                updatedAt,
                usuarioId: usuarioIdNumber,
              }
            })
            // Crea el movimiento de inventario asociado a la venta
            await prisma.movimientoInventario.create({
              data: {
                productoId: detalle.productoId,
                tipo: 'SALIDA',
                cantidad: cantidadNumber,
                descripcion: `Venta de producto en factura FACT-${createdFactura.id}`,
                usuarioId: usuarioIdNumber,
                empresaId: empresaIdNumber,
                createdAt,
                updatedAt,
              },
            });
            // Verifica y actualiza el estado del producto basado en el nuevo stock
            let estadoProducto: EstadoProducto = 'OUTOFSTOCK';
            const nuevoStock = producto.stock - cantidadNumber;
            if (nuevoStock > 0) {
              estadoProducto = nuevoStock < 10 ? 'LOWSTOCK' : 'INSTOCK';
            }
            await prisma.producto.update({
              where: { id: detalle.productoId },
              data: {
                stock: nuevoStock,
                updatedAt: GetLocalDate(),
                estado: estadoProducto,
              },
            });
            // Si el lote más antiguo se agotó, actualiza el precio del producto con el próximo lote
            if (lotes.length > 0 && lotes[0].cantidad === 0) {
              const siguienteLote = lotes.find(lote => lote.cantidad > 0);
              if (siguienteLote) {
                await prisma.producto.update({
                  where: { id: detalle.productoId },
                  data: {
                    precio: siguienteLote.precioVenta,
                    updatedAt: GetLocalDate(),
                  },
                });
              }
            }
          });
          // Espera a que se completen todas las operaciones de detalle
          await Promise.all(detallePromises);
          // Actualiza la factura con los totales calculados
          await prisma.factura.update({
            where: { id: createdFactura.id },
            data: {
              subtotal: subtotalTotal,
              total: subtotalTotal + totalItebis,
              itebisTotal: totalItebis,
              codigo: `FACT-${secuenciaFactura}`, // Actualiza el código de la factura con su ID
              estado: metodoPago === MetodoPago.CREDITO ? Estado.PENDIENTE : Estado.PAGADA,
              updatedAt: GetLocalDate(),
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
          })


          return createdFactura;
        }

        throw new Error('No se pudo crear la factura');
      });

      return { success: true, data: factura };
    } catch (error: any) {
      console.error('Error al crear la factura:', error);
      return { success: false, error: `${error}` };
    }
  }

  async findAllFactura(params: { startDate?: Date, endDate?: Date, estado?: Estado, page?: number, pageSize?: number }): Promise<ApiResponse<{ facturas: Factura[], totalRecords: number, currentPage: number, totalPages: number }>> {
    const { startDate, endDate, estado, page = 1, pageSize = 10 } = params;
    console.log('GetLocalDate', GetLocalDate());
    console.log('new Date()', new Date());
    

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
