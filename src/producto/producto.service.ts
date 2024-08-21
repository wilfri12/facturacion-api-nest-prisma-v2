import { Injectable } from '@nestjs/common';
import { Producto } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateProductoDto, UpdateProductoDto } from './DTO/producto.dto';
import { ApiResponse } from 'src/interface';
import { GetLocalDate } from 'src/utility/getLocalDate';

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
            createdAt: GetLocalDate(),
            updatedAt: GetLocalDate(),
        };
        try {
            const producto = await this.pisma.producto.create({ data: productoData });
            return { success: true, data: producto };
        } catch (error: any) {
            throw error;
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
