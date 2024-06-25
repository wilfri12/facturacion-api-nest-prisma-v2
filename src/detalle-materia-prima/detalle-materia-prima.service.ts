import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { DetalleMateriaPrimaDTO } from './DTO/detalle-materia-prima.dto';
import { DetalleMateriaPrima } from '@prisma/client';

@Injectable()
export class DetalleMateriaPrimaService {
    constructor( private readonly prisma: PrismaService){}

    async createDetalleMateriaPrima(data: DetalleMateriaPrimaDTO): Promise<ApiResponse<DetalleMateriaPrima>> {
        try {

            const detalleMateria = await this.prisma.detalleMateriaPrima.create({data});
            return { success: true, data: detalleMateria };
            
        } catch (error) {
            throw error;
        }
    }
}
