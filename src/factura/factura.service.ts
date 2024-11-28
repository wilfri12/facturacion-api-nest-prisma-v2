import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { FacturaDto } from './DTO/factura.dto';
import { DetalleFactura, Estado, EstadoLote, EstadoProducto, EstadoTransaccion, Factura, MetodoPago, Prisma, PrismaClient, tipoMovimientoCaja } from '@prisma/client';
import { PrinterService } from 'src/printer/printer.service';
import { facturaReport } from 'reports-pdf/imprimirFactura';
import { FacturaInterface } from 'src/interface/factura.interface';
import { GetLocalDate } from 'src/utility/getLocalDate';
import { reporteFacturas } from 'reports-pdf/reporteFacturas';
import { CreateMovimientosCajaDto } from 'src/caja/dto/create-caja.dto';

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
    data: FacturaDto & { detalles: DetalleFactura[] }
  ): Promise<ApiResponse<Factura>> {
    let codigoFacturaMessage = '';
  
    try {
      // Desestructuración de datos y validaciones iniciales
      const {
        detalles,
        empresaId,
        metodoPago,
        usuarioId,
        clienteId,
        clienteNombre,
        cajaId,
      } = data;
  
      if (!cajaId || !usuarioId || !empresaId) {
        throw new Error(
          'Faltan datos obligatorios para crear la factura. Asegúrese de proporcionar el ID de la caja, el ID del usuario y el ID de la empresa.'
        );
      }
  
      if (!detalles || detalles.length === 0) {
        throw new Error(
          'La factura debe contener al menos un detalle de producto.'
        );
      }
  
      // Conversión de datos
      const empresaIdNumber = parseInt(empresaId.toString());
      const usuarioIdNumber = parseInt(usuarioId.toString());
      const clienteIdNumber = clienteId ? parseInt(clienteId.toString()) : null;
      const createdAt = GetLocalDate();
      const updatedAt = GetLocalDate();
      const estadoFactura =
        metodoPago === MetodoPago.CREDITO ? Estado.PENDIENTE : Estado.PAGADA;
  
      // Crear factura dentro de la transacción
      const factura = await this.prisma.$transaction(async (prisma) => {
        // 1. Verificar caja activa
        const historialCaja = await this.getCajaActiva(
          prisma,
          cajaId,
          usuarioId
        );
  
        // 2. Generar secuencia para factura
        const secuenciaFactura = await this.generarSecuenciaFactura(prisma);
  
        // 3. Crear factura inicial
        const createdFactura = await prisma.factura.create({
          data: {
            codigo: 'FACT-', // Código inicial, se actualiza luego
            empresaId: empresaIdNumber,
            estado: estadoFactura,
            itebisTotal: 0,
            metodoPago,
            subtotal: 0,
            total: 0,
            usuarioId: usuarioIdNumber,
            clienteId: clienteIdNumber || null,
            clienteNombre,
            cajaId,
            createdAt,
            updatedAt,
          },
        });
  
        // 4. Procesar detalles de la factura
        const { subtotalTotal, totalItebis } = await this.procesarDetalles(
          prisma,
          createdFactura.id,
          detalles,
          empresaIdNumber,
          usuarioIdNumber,
          createdAt,
          updatedAt
        );
  
        // 5. Actualizar totales en la factura
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
                    categoria: { select: { nombre: true } },
                  },
                },
                cantidad: true,
                importe: true,
              },
            },
            Caja: { select: { id: true, nombre: true } },
            usuario: { select: { id: true, nombreUsuario: true } },
            empresa: { select: { id: true, nombre: true } },
          },
        });
  
        // 6. Registrar movimiento en la caja
        await prisma.movimientosCaja.create({
          data: {
            historialCajaId: historialCaja.id,
            usuarioId: usuarioIdNumber,
            monto: subtotalTotal + totalItebis,
            tipo:facturaUpdated.metodoPago === 'CREDITO' ? tipoMovimientoCaja.VENTA_CREDITO  : tipoMovimientoCaja.INGRESO,
            descripcion: facturaUpdated.metodoPago === 'CREDITO'? `Ingreso por venta, factura a crédito: ${facturaUpdated.codigo}.` : `Ingreso por venta, factura: ${facturaUpdated.codigo}.`,
            createdAt,
            updatedAt,
          },
        });
  
        codigoFacturaMessage = facturaUpdated.codigo;
        return facturaUpdated;
      });
  
      // Respuesta exitosa
      return {
        success: true,
        data: factura,
        message: `La factura se ha creado exitosamente. Número de factura: ${codigoFacturaMessage || 'N/A'}.`,
      };
    } catch (error: any) {
      // Manejo de errores
      const errorMessage =
        error.message || 'Ocurrió un error inesperado al intentar crear la factura.';
      console.error('Error al crear la factura:', errorMessage);
  
      return { success: false, message: errorMessage };
    }
  }

  private async getCajaActiva(prisma: Prisma.TransactionClient, cajaId: number, usuarioId: number) {
    const cajaActiva = await prisma.caja.findFirst({
      where: { id: cajaId, usuarioId, estado: 'ABIERTA' },
      include: { historialCajas: { where: { estado: 'ABIERTA' } } },
    });
  
    if (!cajaActiva || !cajaActiva.historialCajas[0]) {
      throw new Error('No tienes una caja activa para registrar esta venta.');
    }
  
    return cajaActiva.historialCajas[0];
  }

  
  private async generarSecuenciaFactura(prisma: Prisma.TransactionClient) {
    const secuencia = await prisma.secuencias.findUnique({ where: { nombre: 'factura' } });
    const secuenciaFactura = (secuencia?.valor || 0) + 1;
  
    await prisma.secuencias.update({
      where: { nombre: 'factura' },
      data: { valor: secuenciaFactura },
    });

    if (!secuencia) {
      throw new Error(
        "No se encontró un registro clave en la base de datos para generar el código del producto. Es necesario que exista una secuencia llamada 'producto' para continuar con la creación."
      );
    }
  
    return secuenciaFactura;
  }

  
  private async procesarDetalles(
    prisma: Prisma.TransactionClient,
    facturaId: number,
    detalles: DetalleFactura[],
    empresaId: number,
    usuarioId: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    let subtotalTotal = 0;
    let totalItebis = 0;
  
    for (const detalle of detalles) {
      const producto = await prisma.producto.findUnique({
        where: { id: detalle.productoId },
      });
      if (!producto) {
        throw new Error(`Producto no encontrado: ${detalle.productoId}`);
      }
  
      if (producto.stock < detalle.cantidad) {
        throw new Error(`Stock insuficiente para el producto: ${producto.nombre}`);
      }
  
      const precioUnitario = producto.precio;
      const cantidad = detalle.cantidad;
      const importe = cantidad * Number(precioUnitario);
      const itebis = (importe * Number(detalle.itebis)) / 100;
  
      subtotalTotal += importe;
      totalItebis += itebis;
  
      // Crear detalle de factura
      await prisma.detalleFactura.create({
        data: {
          facturaId,
          productoId: detalle.productoId,
          empresaId,
          cantidad,
          precioUnitario,
          itebis,
          importe,
          createdAt,
          updatedAt,
        },
      });
  
      // Manejar lotes (FIFO)
      let cantidadRestante = cantidad;
      const lotes = await prisma.loteProducto.findMany({
        where: {
          productoId: detalle.productoId,
          cantidadRestante: { gt: 0 },
          estado: EstadoLote.ACTIVO,
        },
        orderBy: { fechaEntrada: 'asc' },
      });
  
      for (const lote of lotes) {
        if (cantidadRestante <= 0) break;
  
        const cantidadARestar = Math.min(lote.cantidadRestante, cantidadRestante);
        await prisma.loteProducto.update({
          where: { id: lote.id },
          data: {
            cantidadRestante: lote.cantidadRestante - cantidadARestar,
            updatedAt, // Registramos la fecha de actualización
          },
        });
  
        cantidadRestante -= cantidadARestar;
      }
  
      if (cantidadRestante > 0) {
        throw new Error(
          `Stock insuficiente en los lotes del producto: ${producto.nombre}`
        );
      }
  
      // Crear movimiento de inventario
      await prisma.movimientoInventario.create({
        data: {
          productoId: detalle.productoId,
          tipo: 'SALIDA',
          cantidad,
          descripcion: `Venta en factura FACT-${facturaId}`,
          usuarioId,
          empresaId,
          precioVenta: precioUnitario,
          facturaId,
          createdAt,
          updatedAt, // Fecha de creación y actualización del movimiento
        },
      });
  
      // Actualizar producto
      await prisma.producto.update({
        where: { id: producto.id },
        data: {
          stock: producto.stock - cantidad,
          updatedAt, // Registramos la fecha de actualización
        },
      });
    }
  
    return { subtotalTotal, totalItebis };
  }
  
  

  





  async findAllFactura(params: { startDate?: Date, endDate?: Date, estado?: Estado, metodoPago?: MetodoPago, page?: number, pageSize?: number, codigo?: string }): Promise<ApiResponse<{ facturas: Factura[], totalRecords: number, currentPage: number, totalPages: number }>> {
    const { startDate, endDate, estado, page = 1, pageSize = 10, metodoPago, codigo } = params;
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
              estado ? { estado: estado } : {},
              metodoPago ? { metodoPago: metodoPago } : {},
              codigo ? { codigo: { contains: codigo } } : {}
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
              estado ? { estado: estado } : {},
              metodoPago ? { metodoPago: metodoPago } : {},
              codigo ? { codigo: { contains: codigo } } : {}
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

      const errorMessage =
        error.message
          ? error.message
          : 'Ocurrió un error inesperado al intentar obtener las facturas.';

      console.error(error.message || errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
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

      const errorMessage =
        error.message
          ? error.message
          : 'Ocurrió un error inesperado al intentar buscar la factura por su id.';
      return {
        success: false,
        message: errorMessage,
      };
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
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }


  async facturaReportByParams(params: {
    startDate?: Date;
    endDate?: Date;
    estado?: string;
    metodoPago?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      // Desestructuramos los parámetros y establecemos valores predeterminados para la paginación
      const {
        startDate,
        endDate,
        estado,
        metodoPago,
      } = params;

      const startDateTime = startDate ? new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)) : undefined;
      const endDateTime = endDate ? new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)) : undefined;

      // Calcular la diferencia en meses
      const calculateMonthDifference = (start: Date, end: Date) => {
        return (
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth())
        );
      };

      const monthsDifference = calculateMonthDifference(new Date(startDate), new Date(endDate));

      if (monthsDifference > 6) {

        throw "El rango de fechas no puede exceder los 6 meses."
      }
      // Construcción de filtros condicionales
      const filters: any = {};
      if (startDate && endDate) {
        filters.createdAt = {
          gte: startDateTime,
          lte: endDateTime,
        };
      }
      if (estado) {
        filters.estado = estado;
      }
      if (metodoPago) {
        filters.metodoPago = metodoPago;
      }

      // Consulta en Prisma para recuperar las facturas
      const [facturas, total, totalMonto] = await Promise.all([
        this.prisma.factura.findMany({
          where: filters,
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
          orderBy: {
            createdAt: 'desc', // Ordenar por fecha descendente
          },
        }),
        this.prisma.factura.count({ where: filters }), // Total de registros
        this.prisma.factura.aggregate({
          where: filters,
          _sum: {
            total: true, // Total acumulado de todas las facturas
          },
        }).then((res) => res._sum.total || 0),
      ]);

      if (facturas.length === 0) {
        throw new Error('No hay datos con los parámetros ingresados.');

      }
      // Llamar a la función `reporteFacturas` para generar el PDF
      const docDefinition = reporteFacturas(
        facturas,
        startDate ? startDate.toISOString() : undefined,
        endDate ? endDate.toISOString() : undefined
      );
      const pdfDoc = await this.printerService.createPdf(docDefinition);

      return pdfDoc;
    } catch (error: any) {
      console.error('Error al recuperar las facturas:', error);
      throw new Error('No se pudieron recuperar las facturas. Verifique los parámetros.');
    }
  }

}
