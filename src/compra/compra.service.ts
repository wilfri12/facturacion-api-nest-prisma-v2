import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { CompraDto, DetalleCompraDto } from './DTO/compra.dto';
import { Compra, EstadoProducto } from '@prisma/client';
import { GetLocalDate } from 'src/utility/getLocalDate';

@Injectable()
export class CompraService {
    constructor(private readonly prisma: PrismaService) { }

    async createCompra(data: CompraDto & { detalles: DetalleCompraDto[] }): Promise<ApiResponse<Compra>> {
        const { empresaId, moneda, proveedorId, usuarioId, detalles } = data;
        let montoTotalCompra = 0;

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
                const compraCreated = await prisma.compra.create({ data: CompraData });

                if (compraCreated) {
                    const detallePromises = detalles.map(async (detalle) => {
                        const producto = await prisma.producto.findUnique({
                            where: { id: detalle.productoId },
                        });

                        if (!producto) {
                            throw new Error(`Producto con id ${detalle.productoId} no encontrado`);
                        }



                        const precioCompra = parseFloat(detalle.precioCompra.toString());
                        const cantidad = parseFloat(detalle.cantidad.toString());
                        const importe = cantidad * precioCompra;
                        montoTotalCompra += importe;

                        const detalleCompraData = {
                            productoId: detalle.productoId,
                            cantidad: detalle.cantidad,
                            precioCompra: detalle.precioCompra,
                            precioVenta: detalle.precioVenta,
                            subtotal: importe,
                            compraId: compraCreated.id,
                            empresaId,
                        };

                        await prisma.detalleCompra.create({ data: detalleCompraData });

                        // Crear el movimiento de inventario
                        await prisma.movimientoInventario.create({
                            data: {
                                productoId: detalle.productoId,
                                tipo: 'ENTRADA',
                                cantidad: detalle.cantidad,
                                descripcion: `Compra de producto`,
                                usuarioId,
                                empresaId,
                                createdAt: GetLocalDate(),
                                updatedAt: GetLocalDate(),
                            },
                        });


                        // Registrar el nuevo lote de producto
                        await prisma.loteProducto.create({
                            data: {
                                productoId: detalle.productoId,
                                cantidad: detalle.cantidad,
                                empresaId,
                                precioVenta: detalle.precioVenta,
                                fechaEntrada: GetLocalDate(),
                                updatedAt: GetLocalDate(),
                            },
                        });

                        // Obtener lotes de productos existentes
                        const lotes = await prisma.loteProducto.findMany({
                            where: { productoId: detalle.productoId },
                            orderBy: { fechaEntrada: 'asc' },
                        });

                        let nuevoStock = producto.stock + detalle.cantidad;
                        let estadoProducto: EstadoProducto = 'INSTOCK';

                        // Determina el estado del producto basado en el stock actualizado
                        if (nuevoStock <= 0) {
                            estadoProducto = 'OUTOFSTOCK';
                        } else if (nuevoStock > 0 && nuevoStock <= 10) {
                            estadoProducto = 'LOWSTOCK';
                        } else {
                            estadoProducto = 'INSTOCK';
                        }

                        // Si el producto tenía stock previo, no actualizar el precio
                        if (producto.stock > 0) {
                            await prisma.producto.update({
                                where: { id: detalle.productoId },
                                data: {
                                    stock: nuevoStock,
                                    updatedAt: GetLocalDate(),
                                    estado: estadoProducto,
                                },
                            });
                        } else {
                            // Si no había stock previo, actualizar el precio con el del nuevo lote
                            await prisma.producto.update({
                                where: { id: detalle.productoId },
                                data: {
                                    stock: nuevoStock,
                                    updatedAt: GetLocalDate(),
                                    estado: estadoProducto,
                                    precio: detalle.precioVenta, // Actualiza el precio solo si no había stock
                                },
                            });
                        }
                    });

                    // Espera a que se completen todas las operaciones de detalle
                    await Promise.all(detallePromises);

                    // Actualiza la compra con los totales calculados
                    await prisma.compra.update({
                        where: { id: compraCreated.id },
                        data: {
                            total: montoTotalCompra,
                            updatedAt: GetLocalDate(),
                        },
                    });

                    return compraCreated;
                }

                throw new Error('No se pudo registrar la compra');
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
