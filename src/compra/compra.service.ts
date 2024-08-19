import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { OrdenCompraDto } from './DTO/compra.dto';
import { Compra } from '@prisma/client';

@Injectable()
export class OrdenCompraService {
    constructor(private readonly prisma: PrismaService) { }

    async createOrdenCompra(data: OrdenCompraDto): Promise<ApiResponse<Compra>> {
        try {
            const orden = await this.prisma.compra.create({ data });
            return { success: true, data: orden };

        } catch (error) {
            throw error;
        }
    }

    async findAllOrdenCompra(): Promise<ApiResponse<Compra[]>> {
        try {
            const ordenes = await this.prisma.compra.findMany();
            return { success: true, data: ordenes };

        } catch (error) {
            throw error;
        }
    }
}
