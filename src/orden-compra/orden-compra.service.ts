import { Injectable } from '@nestjs/common';
import { OrdenCompra } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { OrdenCompraDto } from './DTO/orden-compra.dto';

@Injectable()
export class OrdenCompraService {
    constructor(private readonly prisma: PrismaService) { }

    async createOrdenCompra(data: OrdenCompraDto): Promise<ApiResponse<OrdenCompra>> {
        try {
            const orden = await this.prisma.ordenCompra.create({ data });
            return { success: true, data: orden };

        } catch (error) {
            throw error;
        }
    }

    async findAllOrdenCompra(): Promise<ApiResponse<OrdenCompra[]>> {
        try {
            const ordenes = await this.prisma.ordenCompra.findMany();
            return { success: true, data: ordenes };

        } catch (error) {
            throw error;
        }
    }
}
