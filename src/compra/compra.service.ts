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

        const { empresaId, moneda,  usuarioId, detalles } = data;
        let montoTotalCompra = 0;

        // Convert necessary fields to the correct type once at the start
        const parsedEmpresaId = parseInt(empresaId.toString());
        const parsedUsuarioId = parseInt(usuarioId.toString());
        const createdAt = GetLocalDate();
        const updatedAt = GetLocalDate();

        const CompraData = {
            empresaId: parsedEmpresaId,
            moneda,
            usuarioId: parsedUsuarioId,
            total: 0,
            createdAt,
            updatedAt,
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
                            throw new Error(`Estás intentando registrar una compra que no contiene productos en su detalle`);
                        }

                        const precioCompra = parseFloat(detalle.precioCompra.toString());
                        const parsedCantidad = parseInt(detalle.cantidad.toString());
                        const parsedPrecioVenta = parseFloat(detalle.precioVenta.toString())

                        const importe = parsedCantidad * precioCompra;
                        montoTotalCompra += importe;

                        const detalleCompraData = {
                            productoId: detalle.productoId,
                            cantidad: parsedCantidad,
                            precioCompra,
                            precioVenta: parsedPrecioVenta,
                            subtotal: importe,
                            compraId: compraCreated.id,
                            empresaId: parsedEmpresaId,
                        };

                        await prisma.detalleCompra.create({ data: detalleCompraData });

                        // Crear el movimiento de inventario
                        await prisma.movimientoInventario.create({
                            data: {
                                productoId: detalle.productoId,
                                tipo: 'ENTRADA',
                                cantidad: parsedCantidad,
                                descripcion: `Compra de producto`,
                                usuarioId: parsedUsuarioId,
                                empresaId: parsedEmpresaId,
                                createdAt,
                                updatedAt,
                            },
                        });

                        // Registrar el nuevo lote de producto
                        await prisma.loteProducto.create({
                            data: {
                                productoId: detalle.productoId,
                                cantidad: parsedCantidad,
                                cantidadRestante: parsedCantidad,
                                empresaId: parsedEmpresaId,
                                precioVenta: parsedPrecioVenta,
                                fechaEntrada: createdAt,
                                updatedAt,
                            },
                        });

                        // Obtener lotes de productos existentes
                        const lotes = await prisma.loteProducto.findMany({
                            where: { productoId: detalle.productoId },
                            orderBy: { fechaEntrada: 'asc' },
                        });

                        let nuevoStock = producto.stock + parsedCantidad;
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
                                    updatedAt,
                                    estado: estadoProducto,
                                },
                            });

                        } else {
                            // Si no había stock previo, actualizar el precio con el del nuevo lote
                            await prisma.producto.update({
                                where: { id: detalle.productoId },
                                data: {
                                    stock: nuevoStock,
                                    updatedAt,
                                    estado: estadoProducto,
                                    precio: detalle.precioVenta, // Actualiza el precio solo si no había stock
                                },
                            });
                        }
                    });

                    // Espera a que se completen todas las operaciones de detalle
                    await Promise.all(detallePromises);

                    if (montoTotalCompra < 1) {
                        throw new Error(`No es posible registrar una compra con un monto total de $${montoTotalCompra}`);
                    }
                    // Actualiza la compra con los totales calculados
                    await prisma.compra.update({
                        where: { id: compraCreated.id },
                        data: {
                            total: montoTotalCompra,
                            updatedAt,
                        },
                    });

                    await prisma.transaccion.create({
                        data: {
                          tipo: 'COMPRA',
                          monto: montoTotalCompra,
                          empresaId,
                          fecha: createdAt,
                          compraId: compraCreated.id
                        }
                      })

                    return compraCreated;
                }
                

                    throw new Error('No se pudo registrar la compra');
                

            });

            return { success: true, data: compra };
        } catch (error) {
            throw error;
        }
    }

    async findAllCompra(params: { startDate?: Date, endDate?: Date, page?: number, pageSize?: number })
        : Promise<ApiResponse<{ compras: Compra[], totalRecords: number, currentPage: number, totalPages: number }>> {

        const { startDate, endDate, page = 1, pageSize = 10 } = params;

        // Validación: evita páginas negativas o tamaños de página demasiado pequeños
        const pageNumber = Math.max(1, parseInt(page.toString()));
        const pageSizeNumber = Math.max(1, parseInt(pageSize.toString()));

        try {
            const startDateTime = startDate ? new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)) : undefined;
            const endDateTime = endDate ? new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)) : undefined;

            const [compras, totalRecords] = await Promise.all([
                this.prisma.compra.findMany(
                    {
                        where: {
                            AND: [
                                startDateTime ? { createdAt: { gte: startDateTime } } : {},
                                endDateTime ? { createdAt: { lte: endDateTime } } : {},
                            ]
                        },
                        include: {
                            
                            usuario: {
                                select: {
                                    nombreUsuario: true,
                                }
                            },

                            detallesCompras: {
                                select: {
                                    id: true,
                                    producto: {
                                        select: {
                                            codigo: true,
                                            nombre: true,
                                            precio: true,
                                            categoria: true,
                                            subCategoria: true,
                                        }
                                    },
                                    cantidad: true,
                                    precioCompra: true,
                                    subtotal: true,

                                }
                            }

                        }, orderBy: {
                            id: 'desc'
                        },
                        skip: (pageNumber - 1) * pageSizeNumber,
                        take: pageSizeNumber,
                    }),
                this.prisma.compra.count({
                    where: {
                        AND: [
                            startDateTime ? { createdAt: { gte: startDateTime } } : {},
                            endDateTime ? { createdAt: { lte: endDateTime } } : {},
                        ]
                    }
                })
            ]);
            const totalPages = Math.ceil(totalRecords / pageSizeNumber);
            return {
                success: true,
                data: {
                    compras,
                    totalRecords,
                    currentPage: pageNumber,
                    totalPages
                }
            };
        } catch (error) {
            throw error;
        }

    }


    async softDeleteCompra(compraId: number): Promise<{success?: boolean, error?: string, messaje?: string}> {
        try {
            await this.prisma.$transaction(async (prisma) => {
                console.log(`Iniciando proceso de eliminado suave para la compra con ID: ${compraId}`);
    
                // 1. Buscar la compra para obtener información adicional (como usuarioId y empresaId)
                const compra = await prisma.compra.findUnique({ where: { id: compraId } });
                if (!compra) {
                    console.log(`Compra con ID ${compraId} no encontrada`);
                    throw new Error("Compra no encontrada");
                }
    
                // 2. Marcar la compra y sus detalles como eliminados
                console.log(`Marcando la compra con ID ${compraId} y sus detalles como eliminados`);
                await prisma.compra.update({
                    where: { id: compraId },
                    data: { delete: true, updatedAt: GetLocalDate() },
                });
    
                await prisma.detalleCompra.updateMany({
                    where: { compraId },
                    data: { delete: true, updatedAt: GetLocalDate() },
                });
    
                // 3. Obtener los detalles de la compra para revertir los efectos en inventario y lotes
                console.log(`Obteniendo detalles de la compra para revertir efectos en inventario y lotes`);
                const detalles = await prisma.detalleCompra.findMany({
                    where: { compraId },
                    include: { producto: true },
                });
    
                for (const detalle of detalles) {
                    const { productoId, cantidad } = detalle;
                    console.log(`Procesando detalle de compra: ProductoID ${productoId}, Cantidad ${cantidad}`);
    
                    // 4. Ajustar el stock del producto
                    const producto = detalle.producto;
                    const nuevoStock = producto.stock - cantidad;
                    console.log(`Nuevo stock para ProductoID ${productoId}: ${nuevoStock}`);
    
                    // 5. Determinar el estado actualizado del producto
                    let estadoProducto: EstadoProducto = 'OUTOFSTOCK';
                    if (nuevoStock > 0 && nuevoStock <= 10) {
                        estadoProducto = 'LOWSTOCK';
                    } else if (nuevoStock > 10) {
                        estadoProducto = 'INSTOCK';
                    }
                    console.log(`Nuevo estado para ProductoID ${productoId}: ${estadoProducto}`);
    
                    await prisma.producto.update({
                        where: { id: productoId },
                        data: {
                            stock: nuevoStock,
                            estado: estadoProducto,
                            updatedAt: GetLocalDate(),
                        },
                    });
    
                    // 6. Ajustar o eliminar los lotes creados por esta compra
                    console.log(`Ajustando o eliminando lotes para ProductoID ${productoId}`);
                    const lotes = await prisma.loteProducto.findMany({
                        where: { productoId },
                        orderBy: { fechaEntrada: 'desc' },
                    });
    
                    let cantidadARevertir = cantidad;
                    for (const lote of lotes) {
                        if (cantidadARevertir <= 0) break;
    
                        if (lote.fechaEntrada.getTime() === detalle.createdAt.getTime()) {
                            const ajuste = Math.min(lote.cantidadRestante, cantidadARevertir);
                            console.log(`Ajustando loteID ${lote.id}: Cantidad a revertir ${ajuste}`);
    
                            if (ajuste === lote.cantidadRestante) {
                                console.log(`Marcando loteID ${lote.id} como eliminado`);
                                await prisma.loteProducto.update({
                                    where: { id: lote.id },
                                    data: { delete: true, updatedAt: GetLocalDate() },
                                });
                            } else {
                                console.log(`Reduciendo cantidad restante en loteID ${lote.id} en ${ajuste}`);
                                await prisma.loteProducto.update({
                                    where: { id: lote.id },
                                    data: {
                                        cantidadRestante: lote.cantidadRestante - ajuste,
                                        updatedAt: GetLocalDate(),
                                    },
                                });
                            }
    
                            cantidadARevertir -= ajuste;
                        }
                    }
    
                    // 7. Registrar movimiento de ajuste en inventario para documentar el cambio
                    console.log(`Registrando movimiento de ajuste en inventario para ProductoID ${productoId}`);
                    await prisma.movimientoInventario.create({
                        data: {
                            productoId,
                            tipo: 'AJUSTE',
                            cantidad: -cantidad,
                            descripcion: 'Ajuste por eliminación de compra',
                            usuarioId: compra.usuarioId,
                            empresaId: compra.empresaId,
                            createdAt: GetLocalDate(),
                            updatedAt: GetLocalDate(),
                        },
                    });
                }
    
                // 8. Anular la transacción financiera asociada
                console.log(`Anulando la transacción financiera asociada a la compra con ID ${compraId}`);
                await prisma.transaccion.updateMany({
                    where: { compraId },
                    data: { delete: true },
                });
    
                console.log(`Proceso de eliminado suave completado para la compra con ID ${compraId}`);
            });
    
            return { success: true };
        } catch (error) {
            console.error("Error al realizar el eliminado suave de la compra:", error);
            throw new Error("No se pudo completar el proceso de eliminación de la compra");
        }
    }
    
    
}
