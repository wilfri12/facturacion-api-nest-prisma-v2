import { Injectable } from '@nestjs/common';
import { Produccion } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { DetalleProduccionService } from 'src/detalle-produccion/detalle-produccion.service';
import { ProductoService } from 'src/producto/producto.service';
import { UpdateProductoDto } from 'src/producto/DTO/producto.dto';
import { DetalleProduccionConMateriaPrimaDTO, DetalleProduccionDTO } from 'src/detalle-produccion/DTO/detalle-produccion.dto';
import { ProduccionDTO } from './DTO/produccion.dto';
import { MateriaPrimaService } from 'src/materia-prima/materia-prima.service';
import { UpdateMateriaPrimaDto } from 'src/materia-prima/DTO/materia-prima.dto';

interface ProduccionConDetalleDTO extends ProduccionDTO {
    detalle: DetalleProduccionConMateriaPrimaDTO[];
}

@Injectable()
export class ProduccionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly DetalleProduccionService: DetalleProduccionService,
        private readonly productoService: ProductoService, 
        private readonly materiaPrimaService: MateriaPrimaService, 

    ) { }

    async createProduccion(data: ProduccionConDetalleDTO): Promise<ApiResponse<Produccion>> {
        try {
            const { empresaId, cantidadProducida, costoTotal, detalle } = data;
            const produccionData: ProduccionDTO = {
                empresaId,
                cantidadProducida,
                costoTotal,
            };

            const produccion = await this.prisma.$transaction(async (prisma) => {
                const createdProduccion = await this.CreateProduccion(produccionData);

                if (createdProduccion.data && createdProduccion.success) {
                    const detallePromises = detalle.map(async (detalle) => {
                        const detalleProduccionData = {
                            empresaId,
                            productoId: detalle.productoId,
                            cantidadProducto: detalle.cantidadProducto,
                            produccionId: createdProduccion.data.id,
                        } as DetalleProduccionDTO;

                        const productoStock = {
                            stock: detalle.cantidadProducto,
                        } as UpdateProductoDto;
                        await this.productoService.updateProductoStock(productoStock, detalle.productoId);

                        const createdDetalleProduccion = await this.DetalleProduccionService.createDetalleProduccion(detalleProduccionData);

                        if (createdDetalleProduccion) {


                            const detalleMateriaPrimaPromises = detalle.detalleMateriaPrima.map(async (materiaPrima) => {
                               const MateriaPrimaStock ={
                                stock: materiaPrima.cantidadMateria,
                               } as UpdateMateriaPrimaDto;

                              await  this.materiaPrimaService.updateMateriaPrimaStock(MateriaPrimaStock, materiaPrima.materiaPrimaId );
                               
                                const detalleMateriaPrimaData = {
                                    detalleProduccionId: createdDetalleProduccion.data.id,
                                    materiaPrimaId: materiaPrima.materiaPrimaId,
                                    cantidadMateria: materiaPrima.cantidadMateria,
                                };

                                return prisma.detalleMateriaPrima.create({ data: detalleMateriaPrimaData });
                            });

                            await Promise.all(detalleMateriaPrimaPromises);
                        }
                    });

                    await Promise.all(detallePromises);
                }

                return createdProduccion;
            });

            return produccion;
        } catch (error) {
            throw error;
        }
    }

    async CreateProduccion(data: ProduccionDTO): Promise<ApiResponse<Produccion>> {
        try {

            const ProduccionCreatd = await this.prisma.produccion.create({ data });
            return { success: true, data: ProduccionCreatd }

        } catch (error) {
            throw error
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
                        include: {
                            producto: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    precio: true,
                                    descripcion: true,
                                    stock: true,
                                    estado: true,
                                    categoria: {
                                        select: {
                                            id: true,
                                            nombre: true,
                                        }
                                    },
                                }
                            },
                            detalleMateriaPrima: {
                                include: {
                                    materiaPrima: {
                                        select: {
                                            id: true,
                                            nombre: true,
                                            descripcion: true,
                                            stock: true,
                                            proveedor: {
                                                select: {
                                                    id: true,
                                                    nombre: true,
                                                    contacto: {
                                                        select: {
                                                            id: true,
                                                            email: true,
                                                            telefono: true,
                                                            whatsapp: true,
                                                            direccion: true,
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                }
                            },
                        }
                    },
                }
            });
    
            return { success: true, data: producciones };
        } catch (error) {
            console.error('Error al buscar producciones:', error);
            throw error; 
        }
    }
    
}



