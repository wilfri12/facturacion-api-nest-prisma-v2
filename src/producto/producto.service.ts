import { Injectable } from '@nestjs/common';
import { Producto } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateProductoDto, UpdateProductoDto } from './DTO/producto.dto';
import { ApiResponse } from 'src/interface';
import { GetLocalDate } from 'src/utility/getLocalDate';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductoService {
    constructor(private prisma: PrismaService) { }

    async createProducto(
        data: CreateProductoDto,
    ): Promise<ApiResponse<Producto>> {
        const {
            categoriaId,
            empresaId,
            estado,
            nombre,
            precio,
            stock,
            codigo,
            descripcion,
            subCategoriaId,
            ubicacion,
        } = data;

        const productoData = {
            categoriaId: parseInt(categoriaId.toString()),
            empresaId: parseInt(empresaId.toString()),
            estado,
            nombre,
            precio,
            stock,
            codigo,
            descripcion,
            subCategoriaId: parseInt(subCategoriaId.toString()),
            ubicacion,
            createdAt: GetLocalDate(),
            updatedAt: GetLocalDate(),
        };
        try {
            const producto = await this.prisma.producto.create({ data: productoData });
            

            if (producto) {

                await this.prisma.producto.update({
                    where: {
                        id: producto.id,
                    },
                    data: {
                        codigo: codigo  + producto.id,
                    },
                });

            }


            return { success: true, data: producto };


        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // Manejo específico de errores basado en el código de error
                switch (error.code) {
                    case 'P2002': // Violación de restricción única
                        console.log('Error de duplicidad:', error);
                        return { success: false, error: `Error de duplicidad (${error.meta.target})` };
                    case 'P2004': // Campo nulo no permitido
                        console.log('Campo nulo no permitido:', error);
                        return { success: false, error: 'Campo nulo no permitido.' };
                    case 'P2006': // Tipo de datos incorrecto
                        console.log('Tipo de datos incorrecto:', error);
                        return { success: false, error: 'Tipo de datos incorrecto.' };
                    case 'P2027': // Error de conexión a la base de datos
                        console.log('Error de conexión a la base de datos:', error);
                        return { success: false, error: 'Error de conexión a la base de datos.' };
                    default: // Otros errores de Prisma
                        console.log('Error inesperado:', error);
                        return { success: false, error: 'Error inesperado en la base de datos.' };
                }
            }
            // Manejo de errores no relacionados con Prisma
            console.log('Error inesperado:', error);
            return { success: false, error: 'Ocurrió un error inesperado. Por favor, intente nuevamente más tarde.' };
        }
    }

    async findAllProducto(params: { page?: number, pageSize?: number, filtro?: string }): Promise<ApiResponse<{ productos: Producto[], totalRecords: number, currentPage: number, totalPages: number }>> {
        try {
            const { page = 1, pageSize = 10, filtro = '' } = params;


            // Validación: evita páginas negativas o tamaños de página demasiado pequeños
            const pageNumber = Math.max(1, parseInt(page.toString()));
            const pageSizeNumber = Math.max(1, parseInt(pageSize.toString()));
            const [productos, totalRecords] = await Promise.all([
                this.prisma.producto.findMany({
                    where: {
                        OR: [
                            {
                                nombre: {
                                    contains: filtro,
                                },
                            },
                            {
                                codigo: {
                                    contains: filtro,
                                },
                            },
                            {
                                categoria: {
                                    nombre: {
                                        contains: filtro,
                                    },
                                },
                            },
                        ],
                    },
                    include: {
                        empresa: {
                            select: {
                                nombre: true,
                            },
                        },
                        categoria: {
                            select: {
                                nombre: true,
                            },
                        },
                        subCategoria: {
                            select: {
                                nombre: true,
                            },
                        },
                    }, orderBy: {
                        nombre: 'asc'
                    },
                    skip: (pageNumber - 1) * pageSizeNumber,
                    take: pageSizeNumber,
                }),

                this.prisma.producto.count(),

            ]);

            const totalPages = Math.ceil(totalRecords / pageSizeNumber);
            return {
                success: true,
                data: {
                    productos,
                    totalRecords,
                    currentPage: pageNumber,
                    totalPages
                }
            };
        } catch (error: any) {
            throw error;
        }
    }


    async FindByCodigoNombre(nombreOCodigo: string): Promise<ApiResponse<Producto[]>> {
        try {
            const productos = await this.prisma.producto.findMany({
                where: {
                    OR: [
                        {
                            nombre: {
                                contains: nombreOCodigo,
                            },
                        },
                        {
                            codigo: {
                                contains: nombreOCodigo,
                            },
                        },

                    ],
                },
                take: 10, // Limitar a un máximo de 10 productos
                include: {
                    empresa: {
                        select: {
                            nombre: true,
                        },
                    },
                    categoria: {
                        select: {
                            nombre: true,
                        },
                    },
                    subCategoria: {
                        select: {
                            nombre: true,
                        },
                    },
                },

            });
            return { success: true, data: productos };
        } catch (error: any) {
            throw error;
        }
    }



    async updateProductoStock(
        Data: UpdateProductoDto,
        id: number,
    ): Promise<void> {
        const producto = await this.prisma.producto.findUnique({ where: { id } });
        let oldStock: number = parseInt(producto.stock.toString());
        let newStock: number = oldStock + Data.stock;

        const data = { stock: newStock } as UpdateProductoDto;
        await this.prisma.producto.update({ data, where: { id } });
    }


    async findByCodigo(codigo: string): Promise<Producto> {

        try {
            const productos = await this.prisma.producto.findFirst({
                where: { codigo },
                include:{
                    categoria: {
                        select:{
                            id: true,
                            nombre: true,
                        }
                    },

                    subCategoria:{
                        select:{
                            id: true,
                            nombre: true,
                        }
                    },


                    LoteProducto: {
                        select:{
                            id: true,
                            fechaEntrada: true,                         

                        }
                    }
                }
            });
            return productos;
        } catch (error: any) {
            throw error;
        }

    }

}
