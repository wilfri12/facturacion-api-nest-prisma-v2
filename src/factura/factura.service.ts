import { Injectable } from '@nestjs/common';
import { DetalleFacturaService } from 'src/detalle-factura/detalle-factura.service';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { FacturaDto } from './DTO/factura.dto';
import { Factura } from '@prisma/client';
import { DetalleFacturaDto } from 'src/detalle-factura/DTO/detalle-factura.dto';

@Injectable()
export class FacturaService {
  constructor(
    private prisma: PrismaService,
    private readonly detalleFactura: DetalleFacturaService
  ) { }

  async createFactura(data: FacturaDto & { detalle: DetalleFacturaDto[] }): Promise<ApiResponse<Factura>> {
    try {
      const { clienteNombre, empresaId, usuarioId, clienteId, total, detalle } = data;

      const facturaData = {
        clienteNombre,
        empresaId,
        usuarioId,
        clienteId,
        total,
      };

      const factura = await this.prisma.$transaction(async (prisma) => {
        const createdFactura = await prisma.factura.create({ data: facturaData });

        if (createdFactura) {
          const detallePromises = detalle.map((detalle) => {
            const detalleFacturaData = {
              facturaId: createdFactura.id,
              productoId: detalle.productoId,
              empresaId,
              cantidad: detalle.cantidad,
              precioUnitario: detalle.precioUnitario,
              subtotal: detalle.subtotal,
            };

            return this.detalleFactura.createDetalleFactura(detalleFacturaData);
          });

          await Promise.all(detallePromises);
        }

        return createdFactura;
      });

      return { success: true, data: factura };
    } catch (error: any) {
      throw error;
    }
  }


  async findAllFactura(): Promise<ApiResponse<Factura[]>> {
    try {
      const facturas = await this.prisma.factura.findMany({
        include: {
          empresa: true,
          detalles: {
            select: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  precio: true,
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

