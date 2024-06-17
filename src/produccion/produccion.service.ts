import { Injectable } from '@nestjs/common';
import { Produccion } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { ProduccionDto } from './DTO/produccion.dto';
import { DetalleProduccionDto } from 'src/detalle-produccion/DTO/detalle-produccion.dto';
import { DetalleProduccionService } from 'src/detalle-produccion/detalle-produccion.service';
import { ProductoService } from 'src/producto/producto.service';
import { UpdateProductoDto } from 'src/producto/DTO/producto.dto';

@Injectable()
export class ProduccionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly DetalleProduccionService: DetalleProduccionService,
        private readonly productoService: ProductoService

    ) { }

    async createProduccion(data: ProduccionDto & { detalle: DetalleProduccionDto[] }): Promise<ApiResponse<Produccion>> {

        try {
            const { empresaId, cantidadProducida, costoTotal, detalle } = data;
            const produccionData = {
                empresaId,
                cantidadProducida,
                costoTotal
            } as ProduccionDto;
            const produccion = await this.prisma.$transaction(async (prisma) => {

                const createdProduccion = await this.prisma.produccion.create({ data: produccionData });

                if (createdProduccion) {

                    const detallePromises = detalle.map((detalle) => {
                        const detalleData = {
                            materiaPrimaId: detalle.materiaPrimaId,
                            empresaId,
                            productoId: detalle.productoId,
                            cantidadProducto: detalle.cantidadProducto,
                            cantidadMateria: detalle.cantidadMateria,
                            produccionId: createdProduccion.id,
                        } as DetalleProduccionDto;

                        const productoStock = {
                            stock: detalle.cantidadProducto
                        } as UpdateProductoDto;

                        this.productoService.updateProductoStock(productoStock, detalle.productoId)

                        return this.DetalleProduccionService.createDetalleProduccion(detalleData);
                    });
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
                                        select:{
                                            nombre: true,
                                        }
                                    },
                                }
                            },
                            cantidadProducto: true,
                            materiaPrima: {

                                select: {
                                    id: true,
                                    nombre: true,
                                    descripcion: true,
                                    proveedor: {
                                        select: {
                                            id: true,
                                            nombre: true,
                                            contacto: {
                                                select: {
                                                    direccion: true,
                                                    email: true,
                                                    telefono: true,
                                                    whatsapp: true
                                                }
                                            }
                                        }
                                    }

                                },
                            },
                            cantidadMateria: true,
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
