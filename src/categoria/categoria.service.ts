import { Injectable } from '@nestjs/common';
import { Categoria } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoriaService {
    constructor(
        private pisma: PrismaService 
    ){}

    async createCategoria(data: any): Promise<any>{
        try {
            return await this.pisma.categoria.create({data})
            
        } catch (error: any) {
            return {success: false, error: error.message}
        }
        
    }

    async findAllCategoria(): Promise<Categoria[]>
    {
        try {
            const categorias = await this.pisma.categoria.findMany();
            return categorias;
        } catch (error: any) {
            throw new Error(`${error.message}`)
        }
    }
}
