import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DetalleOrdenCompraDto } from './DTO/detalle-orden-compra.dto';
import { ApiResponse } from 'src/interface';
import { DetalleOrdenCompra } from '@prisma/client';

@Injectable()
export class DetalleOrdenCompraService {
    constructor(
        private pisma: PrismaService
    ) { }

    async createDetalleOrdenCompra(data: DetalleOrdenCompraDto): Promise<ApiResponse<DetalleOrdenCompra>> {
        try {
            const detalleOrden = await this.pisma.detalleOrdenCompra.create({ data })
            return { success: false, data: detalleOrden }
        } catch (error: any) {
            throw error;
        }

    }

    async findAllDetalleOrdenCompra(): Promise<ApiResponse<DetalleOrdenCompra[]>> {
        try {
            const detalleOrdens = await this.pisma.detalleOrdenCompra.findMany();
            return { success: false, data: detalleOrdens }
        } catch (error: any) {
            throw error;
        }
    }
}
