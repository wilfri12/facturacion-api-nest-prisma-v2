import { Injectable } from '@nestjs/common';
import { Produccion } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { ProduccionDto } from './DTO/produccion.dto';
import { DetalleProduccionDto } from 'src/detalle-produccion/DTO/detalle-produccion.dto';
import { DetalleProduccionService } from 'src/detalle-produccion/detalle-produccion.service';

@Injectable()
export class ProduccionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly DetalleProduccionService: DetalleProduccionService

    ) { }

    async createProduccion(data: ProduccionDto & { detalle: DetalleProduccionDto[] }): Promise<ApiResponse<Produccion>> {

        try {
            const { empresaId, cantidadProducida, costoTotal, detalle } = data;
            const produccionData = {
                empresaId,
                cantidadProducida,
                costoTotal
            } as ProduccionDto;
            const produccion = await this.prisma.$transaction(async (prisma) => {

                const createdProduccion = await this.prisma.produccion.create({ data: produccionData });

                if (createdProduccion) {

                    const detallePromises = detalle.map((detalle) => {
                        const detalleData = {
                            materiaPrimaId: detalle.materiaPrimaId,
                            empresaId,
                            productoId: detalle.productoId,
                            cantidadProducto: detalle.cantidadProducto,
                            cantidadMateria: detalle.cantidadMateria
                        } as DetalleProduccionDto;
                        
                        return this.DetalleProduccionService.createDetalleProduccion(detalleData);
                    });
                    await Promise.all(detallePromises);

                }
                return createdProduccion;
            });
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
