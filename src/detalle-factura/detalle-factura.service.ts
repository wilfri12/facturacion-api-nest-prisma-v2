import { Injectable } from '@nestjs/common';
import { DetalleFactura } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { DetalleFacturaDto } from './DTO/detalle-factura.dto';
import { ApiResponse } from 'src/interface';

@Injectable()
export class DetalleFacturaService {
    constructor(
        private pisma: PrismaService
    ) { }

    async createDetalleFactura(data: DetalleFacturaDto): Promise<ApiResponse<DetalleFactura>> {
        try {
            const detalle = await this.pisma.detalleFactura.create({ data })
            return { success: false, data: detalle }
        } catch (error: any) {
            return { success: false, error: error.message }
        }

    }

    async findAllDetalleFactura(): Promise<ApiResponse<DetalleFactura[]>> {
        try {
            const detalles = await this.pisma.detalleFactura.findMany();
            return { success: false, data: detalles }
        } catch (error: any) {
            return { success: false, error: error.message }
        }
    }
}
