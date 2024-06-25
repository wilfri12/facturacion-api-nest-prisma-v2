import { Injectable } from '@nestjs/common';
import { Produccion } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { DetalleProduccionService } from 'src/detalle-produccion/detalle-produccion.service';
import { ProductoService } from 'src/producto/producto.service';
import { UpdateProductoDto } from 'src/producto/DTO/producto.dto';
import { DetalleProduccionDTO } from 'src/detalle-produccion/DTO/detalle-produccion.dto';
import { ProduccionDTO } from './DTO/produccion.dto';

@Injectable()
export class ProduccionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly DetalleProduccionService: DetalleProduccionService,
        private readonly productoService: ProductoService

    ) { }

    async createProduccion(data: ProduccionDTO & { detalle: DetalleProduccionDTO[] }): Promise<ApiResponse<Produccion>> {
        try {
            const { empresaId, cantidadProducida, costoTotal, detalle } = data;
            const produccionData: ProduccionDTO = {
                empresaId,
                cantidadProducida,
                costoTotal,
            };
    
            const produccion = await this.prisma.$transaction(async (prisma) => {
                const createdProduccion = await prisma.produccion.create({ data: produccionData });
    
                if (createdProduccion) {
                    const detallePromises = detalle.map(async (detalle) => {
                        const detalleProduccionData = {
                            empresaId,
                            productoId: detalle.productoId,
                            cantidadProducto: detalle.cantidadProducto,
                        } as DetalleProduccionDTO;
    
                        // Update producto stock
                        const productoStock = {
                            stock: detalle.cantidadProducto,
                        } as UpdateProductoDto;
                        await this.productoService.updateProductoStock(productoStock, detalle.productoId);
    
                        // Create detalleProduccion
                        const createdDetalleProduccion = await this.DetalleProduccionService.createDetalleProduccion(detalleProduccionData);
    
                        if (createdDetalleProduccion) {
                            const detalleMateriaPrimaPromises = detalle.detalleMateriaPrima.map(async (materiaPrima) => {
                                const detalleMateriaPrimaData = {
                                    detalleProduccionId: createdDetalleProduccion.data.id,
                                    materiaPrimaId: materiaPrima.materiaPrimaId,
                                    cantidadMateria: materiaPrima.cantidadMateria,
                                };
    
                                // Create detalleMateriaPrima
                                return prisma.detalleMateriaPrima.create({ data: detalleMateriaPrimaData });
                            });
    
                            // Wait for all detalleMateriaPrima to be created
                            await Promise.all(detalleMateriaPrimaPromises);
                        }
                    });
    
                    // Wait for all detalle to be processed
                    await Promise.all(detallePromises);
                }
    
                return createdProduccion;
            });
    
            return { success: true, data: produccion };
        } catch (error) {
            throw error;
        }
    }
    

    async findAllProduccion(): Promise<ApiResponse<Produccion[]>> {
        try {
            const producciones = await this.prisma.produccion.findMany({
                include: {
                    empresa: {
                        select: {
                            id: true,
                            nombre: true,
                        }
                    },
                    detalleProduccion: {
                        select: {
                            id: true,
                            producto: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    descripcion: true,
                                    categoria: {
                                        select: {
                                            nombre: true,
                                        }
                                    },
                                }
                            },
                            cantidadProducto: true,

                        }

                    }


                }
            });
            return { success: true, data: producciones };
        } catch (error) {
            throw error;
        }
    }
}




/*
     // Función para crear producción
    async createProduccion(data: ProduccionDTO & { detalle: DetalleProduccionDTO[] }): Promise<ApiResponse<ProduccionDTO>> {
        try {
            const { empresaId, cantidadProducida, costoTotal, detalle, detalleMateriaPrima } = data;

            // Crear objeto de datos para la producción
            const produccionData = {
                empresaId,
                cantidadProducida,
                costoTotal,
            };

            // Iniciar transacción con Prisma
            const produccion = await prisma.$transaction(async (prisma) => {
                // Crear la producción principal
                const createdProduccion = await prisma.produccion.create({ data: produccionData });

                if (createdProduccion) {
                    // Array para almacenar promesas de creación de detalles de producción
                    const detallePromises = detalle.map(async (detalle) => {
                        // Crear objeto de datos para el detalle de producción
                        const detalleProduccionData = {
                            empresaId,
                            productoId: detalle.productoId,
                            cantidadProducto: detalle.cantidadProducto,
                            produccionId: createdProduccion.id, // Asociar al ID de la producción creada
                        };

                        // Crear detalle de producción
                        const createdDetalleProduccion = await DetalleProduccionService.({ data: detalleProduccionData });

                        // Procesar detalle de materias primas si el detalle de producción se creó correctamente
                        if (createdDetalleProduccion) {
                            // Iterar sobre las materias primas del detalle actual
                            const detalleMateriaPrimaPromises = detalle.detalleMateriaPrima.map(async (materiaPrima) => {
                                // Crear objeto de datos para el detalle de materia prima
                                const detalleMateriaPrimaData = {
                                    detalleProduccionId: createdDetalleProduccion.id,
                                    materiaPrimaId: materiaPrima.materiaPrimaId,
                                    cantidadMateria: materiaPrima.cantidadMateria,
                                };

                                // Crear detalle de materia prima
                                return prisma.detalleMateriaPrima.create({ data: detalleMateriaPrimaData });
                            });

                            // Esperar a que se completen todas las promesas de detalle de materia prima
                            await Promise.all(detalleMateriaPrimaPromises);
                        }
                    });

                    // Esperar a que se completen todas las promesas de detalle de producción
                    await Promise.all(detallePromises);
                }

                return createdProduccion;
            });

            // Devolver respuesta exitosa con los datos de la producción creada
            return { success: true, data: produccion };
        } catch (error) {
            // Manejar errores
            throw error;
        }
    }
 */
