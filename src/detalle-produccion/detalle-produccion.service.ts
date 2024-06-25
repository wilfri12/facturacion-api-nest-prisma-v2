import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { DetalleProduccion } from '@prisma/client';
import { DetalleProduccionDTO } from './DTO/detalle-produccion.dto';

@Injectable()
export class DetalleProduccionService {
    constructor( private readonly prisma: PrismaService){}

    async createDetalleProduccion(data: DetalleProduccionDTO): Promise<ApiResponse<DetalleProduccion>>{
        try {
            const detalle = await this.prisma.detalleProduccion.create({data});
            return {success: true, data: detalle}
        } catch (error) {
            throw error;
        }
    }

    async findAllDetalleProduccion(): Promise<ApiResponse<DetalleProduccion[]>>{
        try {
            const detalles = await this.prisma.detalleProduccion.findMany();
            return {success: true, data: detalles}
        } catch (error) {
            throw error;
        }
    }
}
