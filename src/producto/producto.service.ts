import { Injectable } from '@nestjs/common';
import { Categoria, Producto } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductoService {
    constructor(
        private pisma: PrismaService 
    ){}

    async createProducto(data: any): Promise<any>{
        try {
            return await this.pisma.producto.create({data})
            
        } catch (error: any) {
            return {success: false, error: error.message}
        }
        
    }

    async findAllProducto(): Promise<Producto[]>
    {
        try {
            const productos = await this.pisma.producto.findMany({include:{
                empresa: {
                    select: {
                        nombre: true,
                    }
                },
                categoria: {
                    select:{
                        nombre: true,
                    }
                }
            }});
            return productos;
        } catch (error: any) {
            throw new Error(`${error.message}`)
        }
    }
}
