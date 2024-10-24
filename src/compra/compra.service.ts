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

        console.log(data);
        

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

                        console.log(producto);
                        

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
                            createdAt: 'desc'
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
}
