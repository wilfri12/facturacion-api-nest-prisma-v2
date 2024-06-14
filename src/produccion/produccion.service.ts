import { Injectable } from '@nestjs/common';
import { Produccion } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { ProduccionDto } from './DTO/produccion.dto';

@Injectable()
export class ProduccionService {
    constructor(private readonly prisma: PrismaService) { }

    async createProduccion(data: ProduccionDto): Promise<ApiResponse<Produccion>> {
        try {
            const produccion = await this.prisma.produccion.create({ data });
            return { success: true, data: produccion };
        } catch (error) {
            throw error;
        }
    }

    async findAllProduccion(): Promise<ApiResponse<Produccion[]>> {
        try {
            const producciones = await this.prisma.produccion.findMany();
            return { success: true, data: producciones };
        } catch (error) {
            throw error;
        }
    }
}
