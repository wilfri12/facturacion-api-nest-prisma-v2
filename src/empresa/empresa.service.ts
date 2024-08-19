import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { EmpresaDto } from './DTO/empresa.dto';
import { Empresa } from '@prisma/client';
import { GetLocalDate } from 'src/utility/getLocalDate';

@Injectable()
export class EmpresaService {
    constructor(private pisma: PrismaService) { }

    async createEmpresa(data: EmpresaDto): Promise<ApiResponse<Empresa>> {
        const { contactoId, descripcion, nombre } = data;

        const empresaData = {
            contactoId,
            descripcion,
            nombre,
            createdAt: GetLocalDate(),
            updatedAt: GetLocalDate(),
        };

        try {
            const empresa = await this.pisma.empresa.create({ data: empresaData });
            return { success: true, data: empresa };
        } catch (error: any) {
            throw error;
        }
    }

    async findAllEmpresa(): Promise<ApiResponse<Empresa[]>> {
        try {
            const empresas = await this.pisma.empresa.findMany({
                include: {
                    categorias: true,
                    usuarios: true,
                    facturas: true,
                    detallesFacturas: true,
                    productos: true,
                },
            });
            return { success: true, data: empresas };
        } catch (error: any) {
            throw error;
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
