import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { EmpresaDto } from './DTO/empresa.dto';
import { Empresa } from '@prisma/client';

@Injectable()
export class EmpresaService {
    constructor(
        private pisma: PrismaService
    ) { }

    async createEmpresa(data: EmpresaDto): Promise<ApiResponse<Empresa>> {
        try {
            const empresa = await this.pisma.empresa.create({ data })
            return { success: false, data: empresa }
        } catch (error: any) {
            return { success: false, error: error.message }
        }
    }

    async findAllEmpresa(): Promise<ApiResponse<Empresa[]>> {
        try {
            const empresas = await this.pisma.empresa.findMany({
                include: {
                    categorias: true,
                    usuarios: true,
                    facturas: true,
                    detalles_facturas: true,
                    productos: true,
                }
            });
            return { success: false, data: empresas }
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
