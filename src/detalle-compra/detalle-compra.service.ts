import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { DetalleOrdenCompraDto } from './DTO/detalle-compra.dto';
import { DetalleCompra } from '@prisma/client';

@Injectable()
export class DetalleOrdenCompraService {
    constructor(
        private pisma: PrismaService
    ) { }

    

    async findAllDetalleOrdenCompra(): Promise<ApiResponse<DetalleCompra[]>> {
        try {
            const detalleOrdens = await this.pisma.detalleCompra.findMany();
            return { success: false, data: detalleOrdens }
        } catch (error: any) {
            throw error;
        }
    }
}
