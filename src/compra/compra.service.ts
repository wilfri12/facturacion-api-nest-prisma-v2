import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { CompraDto, DetalleCOmpraDto } from './DTO/compra.dto';
import { Compra } from '@prisma/client';
import { GetLocalDate } from 'src/utility/getLocalDate';

@Injectable()
export class CompraService {
    constructor(private readonly prisma: PrismaService) { }

    async createCompra(data: CompraDto & { detalles: DetalleCOmpraDto[] },): Promise<ApiResponse<Compra>> {
        const { empresaId, moneda, proveedorId, usuarioId, detalles } = data;

        const CompraData = {
            empresaId,
            moneda,
            proveedorId,
            usuarioId,
            total: 0,
            createdAt: GetLocalDate(),
            updatedAt: GetLocalDate(),
        };

        try {
            const compra = await this.prisma.$transaction(async (prisma) => {
                const compraCreated = await this.prisma.compra.create({ data: CompraData });

                if (compraCreated) {

                    const detallePromises = detalles.map(async (detalle) => {

                        const producto = await prisma.producto.findUnique({
                            where: { id: detalle.productoId },
                        });

                        if (!producto) {
                            throw new Error(`Producto con id ${detalle.productoId} no encontrado`);
                        }

                        const detalleCompraData = {
                            productoId: detalle.productoId,
                            cantidad: detalle.cantidad,
                            precioUnitario: producto.precio,
                            subtotal: 0,
                            compraId: compraCreated.id,
                            empresaId,
                        }


                        await prisma.detalleCompra.create({data:detalleCompraData })



                    });

                    // Espera a que se completen todas las operaciones de detalle
                    await Promise.all(detallePromises);


                    return compraCreated;
                }

                throw new Error('No se pudo crear la factura');




            });
            return { success: true, data: compra };
        } catch (error) {
            throw error;
        }
    }

    async findAllCompra(): Promise<ApiResponse<Compra[]>> {
        try {
            const ordenes = await this.prisma.compra.findMany();
            return { success: true, data: ordenes };
        } catch (error) {
            throw error;
        }
    }
}
