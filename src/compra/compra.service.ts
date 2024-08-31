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
        console.log(data);
        
        
        const { empresaId, moneda, proveedorId, usuarioId, detalles } = data;
        let montoTotalCompra = 0;

        const CompraData = {
            empresaId: parseInt(empresaId.toString()),
            moneda,
            proveedorId:parseInt(proveedorId.toString()),
            usuarioId:parseInt(usuarioId.toString()),
            total: 0,
            createdAt: GetLocalDate(),
            updatedAt: GetLocalDate(),
        };

        try {
            const compra = await this.prisma.$transaction(async (prisma) => {
                const compraCreated = await prisma.compra.create({ data: CompraData });

                console.log('compraCreated: ', compraCreated);
                

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
                            cantidad: parseInt(detalle.cantidad.toString()),
                            precioCompra: parseFloat(detalle.precioCompra.toString()),
                            precioVenta: parseFloat(detalle.precioVenta.toString()),
                            subtotal: importe,
                            compraId: compraCreated.id,
                            empresaId: parseInt(empresaId.toString()),
                        };

                        await prisma.detalleCompra.create({ data: detalleCompraData });

                        console.log( 'Se creó el detalle.');
                        

                        // Crear el movimiento de inventario
                        await prisma.movimientoInventario.create({
                            data: {
                                productoId: detalle.productoId,
                                tipo: 'ENTRADA',
                                cantidad: parseInt(detalle.cantidad.toString()),
                                descripcion: `Compra de producto`,
                                usuarioId: parseInt(usuarioId.toString()),
                                empresaId: parseInt(empresaId.toString()),
                                createdAt: GetLocalDate(),
                                updatedAt: GetLocalDate(),
                            },
                        });

                        console.log( 'Se creó el movimiento de inventario.');



                        // Registrar el nuevo lote de producto
                        await prisma.loteProducto.create({
                            data: {
                                productoId: detalle.productoId,
                                cantidad: parseInt(detalle.cantidad.toString()),
                                empresaId: parseInt(empresaId.toString()),
                                precioVenta: detalle.precioVenta,
                                fechaEntrada: GetLocalDate(),
                                updatedAt: GetLocalDate(),
                            },
                        });

                        console.log( 'Se creó el lote.');

                        // Obtener lotes de productos existentes
                        const lotes = await prisma.loteProducto.findMany({
                            where: { productoId: detalle.productoId },
                            orderBy: { fechaEntrada: 'asc' },
                        });

                        console.log( 'Lostes encontrados.:', lotes);


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

                        console.log('nuevoStock <= 0: ', nuevoStock <= 0);
                        console.log('producto.stock > 0: ', producto.stock > 0);
                        
                        

                        // Si el producto tenía stock previo, no actualizar el precio
                        if (producto.stock > 0) {
                            console.log('Lo siguiente que hará es actualizar el producto. ');

                            console.log('Datos relevantes: ');
                            console.log('  detalle.productoId: ',detalle.productoId );
                            console.log('  GetLocalDate: ',GetLocalDate() );
                            console.log('  estadoProducto: ',estadoProducto );
                            
                            
                            await prisma.producto.update({
                                where: { id: detalle.productoId },
                                data: {
                                    stock: nuevoStock,
                                    updatedAt: GetLocalDate(),
                                    estado: estadoProducto,
                                },
                            });

                            console.log('se actualizo el producto. ');
                            
                        } else {
                            // Si no había stock previo, actualizar el precio con el del nuevo lote
                            await prisma.producto.update({
                                where: { id: detalle.productoId },
                                data: {
                                    stock: parseInt(nuevoStock.toString()),
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
            const ordenes = await this.prisma.compra.findMany(
                {orderBy:{
                    createdAt: 'desc'
                }}
            );
            return { success: true, data: ordenes };
        } catch (error) {
            throw error;
        }
    }
}
