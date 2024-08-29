import { Injectable } from '@nestjs/common';
import { DetalleFacturaService } from 'src/shop/detalle-factura/detalle-factura.service';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { FacturaDto } from './DTO/factura.dto';
import { EstadoProducto, Factura } from '@prisma/client';
import { DetalleFacturaDto } from 'src/shop/detalle-factura/DTO/detalle-factura.dto';
import { GetLocalDate } from 'src/utility/getLocalDate';

@Injectable()
export class FacturaService {
  constructor(
    private prisma: PrismaService,
    private readonly detalleFactura: DetalleFacturaService,
  ) { }

  /**
 * Crea una nueva factura y sus detalles asociados, manejando el inventario de productos
 * por lotes y actualizando precios según el lote más antiguo disponible.
 * 
 * @param data - Los datos necesarios para crear la factura, incluyendo los detalles.
 * @returns Una respuesta que indica si la factura se creó correctamente o si ocurrió un error.
 */
  async createFactura(
    data: FacturaDto & { detalles: DetalleFacturaDto[] },
  ): Promise<ApiResponse<Factura>> {
    try {
      let subtotalTotal = 0;
      let totalItebis = 0;

      // Desestructuración de los datos de entrada 
      const {
        codigo,
        detalles,
        empresaId,
        estado,
        metodoPago,
        moneda,
        usuarioId,
        clienteId,
        clienteNombre,
        cajaId
      } = data;


      // Datos base para la creación de la factura
      const facturaData = {
        codigo: 'FACT-', // El código se completará después con el ID de la factura
        empresaId: parseInt(empresaId.toString()),
        estado,
        itebisTotal: 0, // Se calculará después
        metodoPago,
        moneda,
        cajaId,
        subtotal: 0, // Se calculará después
        total: 0, // Se calculará después
        usuarioId: parseInt(usuarioId.toString()),
        clienteId: parseInt(clienteId.toString() || null),
        clienteNombre,
        createdAt: GetLocalDate(),
        updatedAt: GetLocalDate(),
      };


      // Creación de la factura y sus detalles dentro de una transacción
      const factura = await this.prisma.$transaction(async (prisma) => {
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

            if (!producto) {
              throw new Error(`Producto con id ${detalle.productoId} no encontrado`);
            }

            if (producto.stock < detalle.cantidad) {
              throw new Error(
                `Inventario insuficiente: Solo quedan ${producto.stock} unidades del producto ${producto.nombre} (talla ${producto.talla}) disponibles. No se puede completar la venta de ${detalle.cantidad} unidades.`,
              );
            }


            const precioUnitario = parseFloat(producto.precio.toString());
            const cantidad = parseFloat(detalle.cantidad.toString());
            const itebisPorcentaje = parseFloat(detalle.itebis.toString()) / 100;

            // Calcula el importe del detalle (antes del ITBIS)
            const importe = cantidad * precioUnitario;

            // Calcula el ITBIS del detalle
            const itebis = importe * itebisPorcentaje;

            subtotalTotal += importe;
            totalItebis += itebis;

            const detalleFacturaData = {
              facturaId: createdFactura.id,
              productoId: detalle.productoId,
              empresaId: parseInt(empresaId.toString()),
              cantidad:parseInt(detalle.cantidad.toString()) ,
              precioUnitario,
              itebis,
              importe,
              createdAt: GetLocalDate(),
              updatedAt: GetLocalDate(),
            };

            console.log("detalleFacturaData: ", detalleFacturaData);



            // Crea el detalle de la factura
            await prisma.detalleFactura.create({ data: detalleFacturaData });

            // Maneja la reducción de stock y la gestión de lotes
            let cantidadRestante = detalle.cantidad;

            console.log(`Cantidad solicitada: ${cantidadRestante}`);

            const lotes = await prisma.loteProducto.findMany({
              where: {
                productoId: detalle.productoId,
                cantidad: { gt: 0 } // Solo obtener lotes con cantidad > 0
              },
              orderBy: { fechaEntrada: 'asc' }, // FIFO: Primero en entrar, primero en salir
            });

            if (lotes.length === 0) {
              throw new Error(`No hay lotes disponibles para el producto ${detalle.productoId}`);
            }

            console.log(`Lotes disponibles para el producto ${detalle.productoId}:`, lotes);

            for (const [index, lote] of lotes.entries()) {
              if (cantidadRestante <= 0) break;

              // Verificar si la cantidad solicitada es mayor que la cantidad disponible en el lote más antiguo
              if (detalle.cantidad > lote.cantidad) {
                throw new Error(
                  `Solo se pueden comprar hasta ${lote.cantidad} unidades del producto ${producto.nombre} debido a limitaciones de inventario en el lote actual. Por favor, ajuste la cantidad o genere una nueva factura para el lote siguiente, teniendo en cuenta que los precios pueden variar entre lotes.`
                );
              }

              console.log(`Trabajando con el lote ${lote.id} que tiene ${lote.cantidad} unidades y un precio de ${lote.precioVenta}`);

              if (lote.cantidad <= cantidadRestante) {
                // Si el lote se consume completamente
                console.log(`El lote ${lote.id} será consumido completamente.`);
                cantidadRestante -= lote.cantidad;
                console.log(`Cantidad restante después de consumir el lote ${lote.id}: ${cantidadRestante}`);

                await prisma.loteProducto.update({
                  where: { id: lote.id },
                  data: { cantidad: 0 },
                });

                // Si existe un siguiente lote, actualiza el precio del producto al del siguiente lote
                const siguienteLote = lotes[index + 1];
                if (siguienteLote) {
                  console.log(`Actualizando el precio del producto al precio del siguiente lote ${siguienteLote.id} que es ${siguienteLote.precioVenta}`);
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
                console.log(`El lote ${lote.id} no será consumido completamente. Cantidad restante antes de consumir: ${cantidadRestante}`);
                await prisma.loteProducto.update({
                  where: { id: lote.id },
                  data: { cantidad: lote.cantidad - cantidadRestante },
                });
                console.log(`Cantidad restante después de actualizar el lote ${lote.id}: 0 (Lote reducido a ${lote.cantidad - cantidadRestante} unidades)`);

                cantidadRestante = 0;
              }
            }

            console.log(`Proceso de reducción de stock y gestión de lotes completado para el producto ${detalle.productoId}`);

            const historialCajaActivo = await prisma.historialCaja.findFirst({
              where: {
                cajaId,
                estado: 'ABIERTA',
              },
              orderBy: {
                fechaApertura: 'desc', //  obtener el historial más reciente si hay más de uno.
              },
            });

            await this.prisma.movimientosCaja.create({
              data:{
                tipo: 'VENTA',
                descripcion: `Venta de producto en factura FACT-${createdFactura.id}`,
                historialCajaId: historialCajaActivo.id,
                monto: subtotalTotal + totalItebis,
                createdAt: GetLocalDate(),
                updatedAt: GetLocalDate(),
                usuarioId: parseInt(usuarioId.toString()),
              }
            })

            // Crea el movimiento de inventario asociado a la venta
            await prisma.movimientoInventario.create({
              data: {
                productoId: detalle.productoId,
                tipo: 'SALIDA',
                cantidad: parseInt(detalle.cantidad.toString()),
                descripcion: `Venta de producto en factura FACT-${createdFactura.id}`,
                usuarioId: parseInt(usuarioId.toString()),
                empresaId: parseInt(empresaId.toString()),
                createdAt: GetLocalDate(),
                updatedAt: GetLocalDate(),
              },
            });

            // Verifica y actualiza el estado del producto basado en el nuevo stock
            let estadoProducto: EstadoProducto = 'OUTOFSTOCK';
            const nuevoStock = producto.stock - detalle.cantidad;

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
              codigo: `FACT-${createdFactura.id}`, // Actualiza el código de la factura con su ID
              updatedAt: GetLocalDate(),
            },
          });

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



  async findAllFactura(): Promise<ApiResponse<Factura[]>> {
    try {
      const facturas = await this.prisma.factura.findMany({
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
            },
          },
          empresa: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
        orderBy:{
          createdAt: 'desc'
        }
      } );

      return { success: true, data: facturas };
    } catch (error: any) {
      throw error;
    }
  }
}
