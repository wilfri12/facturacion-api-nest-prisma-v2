import { Injectable } from '@nestjs/common';
import { DetalleFacturaService } from 'src/detalle-factura/detalle-factura.service';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { FacturaDto } from './DTO/factura.dto';
import { Factura } from '@prisma/client';
import { DetalleFacturaDto } from 'src/detalle-factura/DTO/detalle-factura.dto';
import { GetLocalDate } from 'src/utility/getLocalDate';

@Injectable()
export class FacturaService {
  constructor(
    private prisma: PrismaService,
    private readonly detalleFactura: DetalleFacturaService
  ) { }

  async createFactura(data: FacturaDto & { detalles: DetalleFacturaDto[] }): Promise<ApiResponse<Factura>> {
    try {

      let subtotalTotal = 0;
      let totalItebis = 0;

      const { clienteNombre, empresaId, usuarioId, clienteId, total, detalles, metodoPago, itebisTotal } = data;

      console.log(data);


      const facturaData = {
        clienteNombre,
        empresaId,
        usuarioId,
        clienteId,
        total,
        metodoPago,
        itebisTotal: total * 0.18,
        createdAt: GetLocalDate(),
        updatedAt: GetLocalDate(),
      };

      const factura = await this.prisma.$transaction(async (prisma) => {
        const createdFactura = await this.createFactura2(facturaData);

        if (createdFactura) {
          const detallePromises = detalles.map((detalle) => {
            
            // Calcula el subtotal
            const subtotal = detalle.cantidad * detalle.precioUnitario;
            
            // Calcula el ITBIS
            const itebisAmount = subtotal * detalle.itebis;
            
            // Calcula el total
            const total = subtotal + itebisAmount;

            // Suma al total
            subtotalTotal += subtotal;
            totalItebis += itebisAmount;

            const detalleFacturaData = {
              facturaId: createdFactura.data.id,
              productoId: detalle.productoId,
              empresaId,
              cantidad: detalle.cantidad,
              precioUnitario: detalle.precioUnitario,
              itebis: itebisAmount,
              subtotal: subtotal,
              createdAt: GetLocalDate(),
              cupdatedAt: GetLocalDate(),
            };

            return this.detalleFactura.createDetalleFactura(detalleFacturaData);
          });

          await Promise.all(detallePromises);
        }
        return createdFactura;
      });

      return { success: true, data: null };
    } catch (error: any) {
      throw error;
    }
  }

  async createFactura2(data: FacturaDto): Promise<ApiResponse<Factura>> {
    try {

      const factura = await this.prisma.factura.create({ data });
      return { success: true, data: factura };

    } catch (error) {
      throw error;
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
                }
              }
            }

          },
          empresa: {
            select: {
              id: true,
              nombre: true,
            }
          },

          detallesFacturas: {
            select: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  precioVenta: true,
                  descripcion: true,
                  estado: true,
                  subCategoria: {
                    select: {
                      id: true,
                      nombre: true,
                    }
                  },
                }
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

