import { Injectable } from '@nestjs/common';
import { Producto } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateProductoDto, UpdateProductoDto } from './DTO/producto.dto';
import { ApiResponse } from 'src/interface';
import { GetLocalDate } from 'src/utility/getLocalDate';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductoService {
    constructor(private pisma: PrismaService) { }

    async createProducto(
        data: CreateProductoDto,
    ): Promise<ApiResponse<Producto>> {
        const {
            categoriaId,
            empresaId,
            estado,
            genero,
            nombre,
            precio,
            stock,
            codigo,
            codigoBarras,
            color,
            descripcion,
            edadRecomendada,
            marca,
            peso,
            subCategoriaId,
            talla,
            ubicacion,
            volumen,
        } = data;

        const productoData = {
            categoriaId: parseInt(categoriaId.toString()),
            empresaId: parseInt(empresaId.toString()),
            estado,
            genero,
            nombre,
            precio,
            stock,
            codigo,
            codigoBarras,
            color,
            descripcion,
            edadRecomendada,
            marca,
            peso,
            subCategoriaId: parseInt(subCategoriaId.toString()),
            talla,
            ubicacion,
            volumen,
            createdAt: GetLocalDate(),
            updatedAt: GetLocalDate(),
        };
        try {
            const producto = await this.pisma.producto.create({ data: productoData });
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

    async findAllProducto(): Promise<ApiResponse<Producto[]>> {
        try {
            const productos = await this.pisma.producto.findMany({
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
        const producto = await this.pisma.producto.findUnique({ where: { id } });
        let oldStock: number = parseInt(producto.stock.toString());
        let newStock: number = oldStock + Data.stock;

        const data = { stock: newStock } as UpdateProductoDto;
        await this.pisma.producto.update({ data, where: { id } });
    }
}
