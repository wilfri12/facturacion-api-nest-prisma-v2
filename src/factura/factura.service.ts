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

  async createFactura(
    data: FacturaDto & { detalles: DetalleFacturaDto[] },
  ): Promise<ApiResponse<Factura>> {
    try {
      let subtotalTotal = 0;
      let totalItebis = 0;

      const {
        codigo,
        detalles,
        empresaId,
        estado,
        itebisTotal,
        metodoPago,
        moneda,
        subtotal,
        total,
        usuarioId,
        clienteId,
        clienteNombre,
      } = data;

      console.log('Datos recibidos: ', data);

      const facturaData = {
        codigo: 'FACT-',
        empresaId,
        estado,
        itebisTotal: 0,
        metodoPago,
        moneda,
        subtotal: 0,
        total: 0,
        usuarioId,
        clienteId,
        clienteNombre,
        createdAt: GetLocalDate(),
        updatedAt: GetLocalDate(),
      };

      console.log('Datos enviados a facturaData: ', facturaData);

      const factura = await this.prisma.$transaction(async (prisma) => {
        const createdFactura = await prisma.factura.create({
          data: facturaData,
        });

        if (createdFactura) {
          const detallePromises = detalles.map(async (detalle) => {
            const producto = await prisma.producto.findUnique({
              where: { id: detalle.productoId },
            });

            if (!producto ) {
              throw new Error(`Producto con id ${detalle.productoId} no encontrado`);
            }

            if (producto.stock < detalle.cantidad) {
              throw new Error(
                `Inventario insuficiente: Solo quedan ${producto.stock} unidades del producto ${producto.nombre} (talla ${producto.talla}) disponibles. No se puede completar la venta de ${detalle.cantidad} unidades.`
              );
            }
            

            console.log('Producto: ', producto);

            const precioUnitario = parseFloat(producto.precio.toString());
            const cantidad = parseFloat(detalle.cantidad.toString());
            const itebisPorcentaje = parseFloat(detalle.itebis.toString()) / 100;


            // Calcula el importe antes del descuento e ITBIS
            const importe = cantidad * precioUnitario;

            // Calcula el descuento

            // Calcula el ITBIS
            const itebis = importe * itebisPorcentaje;

            subtotalTotal += importe;
            totalItebis += itebis;

            const detalleFacturaData = {
              facturaId: createdFactura.id,
              productoId: detalle.productoId,
              empresaId,
              cantidad: detalle.cantidad,
              precioUnitario,
              itebis,
              importe,
              createdAt: GetLocalDate(),
              updatedAt: GetLocalDate(),
            };

            console.log('Datos enviados a detalleFacturaData: ', detalleFacturaData);

            // Crea el detalle de la factura
            await prisma.detalleFactura.create({ data: detalleFacturaData });

            // Crea el movimiento de inventario
            await prisma.movimientoInventario.create({
              data: {
                productoId: detalle.productoId,
                tipo: 'SALIDA',
                cantidad: detalle.cantidad,
                descripcion: `Venta de producto en factura FACT-${createdFactura.id}`,
                usuarioId,
                empresaId,
                createdAt: GetLocalDate(),
                updatedAt: GetLocalDate(),
              }
            });

            // Actualiza el stock del producto
            let estadoProducto: EstadoProducto = 'OUTOFSTOCK';

            if (producto.stock - detalle.cantidad > 0) {
              estadoProducto = producto.stock - detalle.cantidad < 10 ? 'LOWSTOCK' : 'INSTOCK';
            }

            await prisma.producto.update({
              where: { id: detalle.productoId },
              data: {
                stock: { decrement: detalle.cantidad },
                updatedAt: GetLocalDate(),
                estado: estadoProducto
              }
            });
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
              codigo: `FACT-00${createdFactura.id}`,
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
      //throw error;
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
              contacto: {
                select: {
                  telefono: true,
                  whatsapp: true,
                  email: true,
                  instagram: true,
                  direccion: true,
                },
              },
            },
          },
          empresa: {
            select: {
              id: true,
              nombre: true,
            },
          },

          detallesFacturas: {
            select: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  precio: true,
                  descripcion: true,
                  estado: true,
                  subCategoria: {
                    select: {
                      id: true,
                      nombre: true,
                    },
                  },
                },
              },
              cantidad: true,
            },
          },
        },
      });

      return { success: true, data: facturas };
    } catch (error: any) {
      throw error;
    }
  }
}
