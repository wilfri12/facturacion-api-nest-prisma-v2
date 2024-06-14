import { Injectable } from '@nestjs/common';
import { Producto } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ProductoDto } from './DTO/producto.dto';
import { ApiResponse } from 'src/interface';

@Injectable()
export class ProductoService {
    constructor(
        private pisma: PrismaService
    ) { }

    async createProducto(data: ProductoDto): Promise<ApiResponse<Producto>> {
        try {
            const producto = await this.pisma.producto.create({ data })
            return { success: true, data: producto }
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
                        }
                    },
                    categoria: {
                        select: {
                            nombre: true,
                        }
                    }
                }
            });
            return { success: true, data: productos };
        } catch (error: any) {
            throw error;
        }
    }
}
