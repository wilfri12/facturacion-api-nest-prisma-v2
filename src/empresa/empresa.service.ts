import { Injectable } from '@nestjs/common';
import { Empresa } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmpresaService {
    constructor(
        private pisma: PrismaService 
    ){}

    async createEmpresa(data: any): Promise<any>{
        try {
            return await this.pisma.empresa.create({data})
            
        } catch (error: any) {
            return {success: false, error: error.message}
        }
        
    }

    async findAllEmpresa(): Promise<Empresa[]>
    {
        try {

            
            
            
            const empresas = await this.pisma.empresa.findMany({
                include:{
                    categorias: true,
                    usuarios: true,
                    facturas: true,
                    detalles_facturas: true,
                    productos: true,
                    
                }
            });
            return empresas;
        } catch (error: any) {
            throw new Error(`${error.message}`)
        }
    }


    
}

//generar codigos de 10 caracteres
/*function generateCode(length: any) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const customCode = generateCode(10);*/
