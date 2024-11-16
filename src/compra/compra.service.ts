import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { CompraDto, DetalleCompraDto } from './DTO/compra.dto';
import { Compra, EstadoProducto, TransaccionCompra, TransaccionVenta } from '@prisma/client';
import { GetLocalDate } from 'src/utility/getLocalDate';

@Injectable()
export class CompraService {
    constructor(private readonly prisma: PrismaService) { }

    async createCompra(data: CompraDto & { detalles: DetalleCompraDto[] }): Promise<ApiResponse<Compra>> {
        const { empresaId, moneda, usuarioId, detalles } = data;
        let montoTotalCompra = 0;
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
                // Step 1: Create the compra entry
                const compraCreated = await prisma.compra.create({ data: CompraData });
    
                // Step 2: Fetch all `producto` records needed in a single query
                const productoIds = detalles.map((detalle) => detalle.productoId);
                const productos = await prisma.producto.findMany({
                    where: { id: { in: productoIds } },
                });
    
                // Step 3: Prepare data for batch operations
                const detalleCompraData = [];
                const movimientoInventarioData = [];
                const loteProductoData = [];
    
                for (const detalle of detalles) {
                    const producto = productos.find((p) => p.id === detalle.productoId);
                    if (!producto) throw new Error(`Producto ID ${detalle.productoId} no encontrado`);
    
                    const precioCompra = parseFloat(detalle.precioCompra.toString());
                    const parsedCantidad = parseInt(detalle.cantidad.toString());
                    const parsedPrecioVenta = parseFloat(detalle.precioVenta.toString());
    
                    const importe = parsedCantidad * precioCompra;
                    montoTotalCompra += importe;
    
                    // Prepare detalleCompra data
                    detalleCompraData.push({
                        productoId: detalle.productoId,
                        cantidad: parsedCantidad,
                        precioCompra,
                        precioVenta: parsedPrecioVenta,
                        subtotal: importe,
                        compraId: compraCreated.id,
                        empresaId: parsedEmpresaId,
                        createdAt,
                        updatedAt
                    });
    
                    // Prepare movimientoInventario data
                    movimientoInventarioData.push({
                        productoId: detalle.productoId,
                        tipo: 'ENTRADA',
                        cantidad: parsedCantidad,
                        descripcion: `Compra de producto`,
                        usuarioId: parsedUsuarioId,
                        empresaId: parsedEmpresaId,
                        createdAt,
                        updatedAt,
                    });
    
                    // Prepare loteProducto data
                    loteProductoData.push({
                        productoId: detalle.productoId,
                        cantidad: parsedCantidad,
                        cantidadRestante: parsedCantidad,
                        empresaId: parsedEmpresaId,
                        precioVenta: parsedPrecioVenta,
                        fechaEntrada: createdAt,
                        updatedAt,
                        compraId: compraCreated.id
                    });
    
                    
                }
    
                if (montoTotalCompra < 1) {
                    throw new Error(`No es posible registrar una compra con un monto total de $${montoTotalCompra}`);
                }
    
                // Step 4: Perform batch inserts
                await prisma.detalleCompra.createMany({ data: detalleCompraData });
                await prisma.movimientoInventario.createMany({ data: movimientoInventarioData });
                await prisma.loteProducto.createMany({ data: loteProductoData });
                
    
                // Step 6: Update the compra with the total
                await prisma.compra.update({
                    where: { id: compraCreated.id },
                    data: { total: montoTotalCompra, updatedAt },
                });
    
                // Step 7: Register the main and specific transactions
                await prisma.transaccion.create({
                    data: {
                        tipo: 'COMPRA',
                        monto: montoTotalCompra,
                        empresaId: parsedEmpresaId,
                        fecha: createdAt,
                        compraId: compraCreated.id,
                    },
                });
    
                const transaccionCompraCreated = await prisma.transaccionCompra.create({
                    data: {
                        compraId: compraCreated.id,
                        usuarioId: parsedUsuarioId,
                        empresaId: parsedEmpresaId,
                        estado: 'ACTIVA',
                        createdAt,
                        updatedAt,
                    },
                });
    
                // Step 8: Update detalleCompra and loteProducto with transaccionCompraId
                await prisma.detalleCompra.updateMany({
                    where: { compraId: compraCreated.id },
                    data: { transaccionCompraId: transaccionCompraCreated.id },
                });
                await prisma.loteProducto.updateMany({
                    where: { compraId: compraCreated.id },
                    data: { transaccionCompraId: transaccionCompraCreated.id },
                });
    
                return compraCreated;
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
            let startDateTime = startDate ? new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)) : undefined;
            let endDateTime = endDate ? new Date(new Date(endDate).setUTCHours(23, 59, 59, 999)) : undefined;

            if (startDate && endDate === undefined) {
              endDateTime =  new Date(new Date(endDateTime.getMonth() + 1).setUTCHours(23, 59, 59, 999))
            }

            if (endDate && startDate === undefined) {
              startDateTime =  new Date(new Date(startDateTime.getMonth() - 1).setUTCHours(23, 59, 59, 999))
            }
            const [compras, totalRecords] = await Promise.all([
                this.prisma.compra.findMany(
                    {
                        where: {
                            AND: [
                                startDateTime ? { createdAt: { gte: startDateTime } } : {},
                                endDateTime ? { createdAt: { lte: endDateTime } } : {},
                            ],
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
                            },
                            Transaccion: true,
                            TransaccionCompra: true,
                            LoteProducto: true

                        

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


    async deleteTransaccionCompra(transaccionCompraId: number): Promise<{success?: boolean, message?: string, error?: string}> {
        try {
          await this.prisma.$transaction(async (prisma) => {
            console.log(`Iniciando proceso de "soft delete" para la transacción de compra con ID: ${transaccionCompraId}`);
            
            // 1. Obtener la transacción y los datos relacionados
            console.log(`Consultando transacción y sus datos relacionados para ID: ${transaccionCompraId}`);
            const transaccion = await prisma.transaccionCompra.findUnique({
              where: { id: transaccionCompraId },
              include: {
                compra: true,
                detallesCompra: {
                  include: { producto: true }
                },
                lotes: true,
                usuario: true,
                empresa: true,
              },
            });
      
            if (!transaccion) {
              console.log(`Transacción con ID ${transaccionCompraId} no encontrada`);
              throw new Error("Transacción no encontrada");
            }
      
            if (transaccion.estado !== "ACTIVA") {
              console.log(`La transacción con ID ${transaccionCompraId} ya no está activa`);
              throw new Error("La transacción no está activa");
            }
            
            console.log(`Transacción encontrada. Estado actual: ${transaccion.estado}`);
      
            // 2. Marcar la transacción, compra y sus detalles como eliminados
            console.log(`Marcando la transacción de compra, la compra y sus detalles como eliminados`);
            await prisma.transaccionCompra.update({
              where: { id: transaccionCompraId },
              data: {
                estado: "ANULADA",
                motivoAnulacion: "Anulación de compra",
                fechaAnulacion: GetLocalDate(),
                updatedAt: GetLocalDate(),
              },
            });
            console.log(`Transacción con ID ${transaccionCompraId} marcada como ANULADA`);
      
            await prisma.compra.update({
              where: { id: transaccion.compraId },
              data: { delete: true, updatedAt: GetLocalDate() },
            });
            console.log(`Compra con ID ${transaccion.compraId} marcada como eliminada`);
      
            await prisma.detalleCompra.updateMany({
              where: { compraId: transaccion.compraId },
              data: { delete: true, updatedAt: GetLocalDate() },
            });
            console.log(`Detalles de compra para la compra ID ${transaccion.compraId} marcados como eliminados`);
      
            // 3. Ajustar inventario y marcar lotes como eliminados
            console.log(`Ajustando el inventario y marcando lotes como eliminados`);
            for (const detalle of transaccion.detallesCompra) {
              const { productoId, cantidad } = detalle;
              console.log(`Procesando ajuste de inventario para ProductoID: ${productoId}, Cantidad: ${cantidad}`);
              
              // Ajuste en el inventario (movimiento negativo)
              await prisma.movimientoInventario.create({
                data: {
                  productoId,
                  tipo: 'AJUSTE',
                  cantidad: -cantidad,
                  descripcion: 'Ajuste por anulación de compra',
                  usuarioId: transaccion.usuarioId,
                  empresaId: transaccion.empresaId,
                  createdAt: GetLocalDate(),
                  updatedAt: GetLocalDate(),
                },
              });
              console.log(`Movimiento de ajuste creado para ProductoID: ${productoId}`);
      
             
      
              // Ajustar o eliminar los lotes de la compra
              let cantidadARevertir = cantidad;
              for (const lote of transaccion.lotes) {
                if (lote.productoId === productoId && cantidadARevertir > 0) {
                  const ajuste = Math.min(lote.cantidadRestante, cantidadARevertir);
                  console.log(`Ajustando lote ID ${lote.id} para ProductoID ${productoId}. Cantidad a revertir: ${ajuste}`);
                  
                  if (ajuste === lote.cantidadRestante) {
                    await prisma.loteProducto.update({
                      where: { id: lote.id },
                      data: { delete: true, updatedAt: GetLocalDate() },
                    });
                    console.log(`Lote ID ${lote.id} marcado como eliminado`);
                  } else {
                    await prisma.loteProducto.update({
                      where: { id: lote.id },
                      data: {
                        cantidadRestante: lote.cantidadRestante - ajuste,
                        updatedAt: GetLocalDate(),
                      },
                    });
                    console.log(`Lote ID ${lote.id} cantidad restante ajustada a: ${lote.cantidadRestante - ajuste}`);
                  }
                  cantidadARevertir -= ajuste;
                }
              }
            }
            
            console.log(`Proceso de "soft delete" completado para la transacción de compra con ID ${transaccionCompraId}`);
          });
          
          return { success: true, message: 'Transacción anulada exitosamente y ajustes realizados.' };
        } catch (error) {
          console.error('Error al anular la transacción de compra:', error);
          return { success: false, error: `${error}` };
        }
      }
      
      


}
