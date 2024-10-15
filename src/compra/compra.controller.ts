import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Compra } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { CompraService } from './compra.service';
import { CompraDto, DetalleCompraDto } from './DTO/compra.dto';

@Controller('api/v1/compra')
export class CompraController {
    constructor(private readonly compraService: CompraService) { }
    @Post()
    async createCompra(@Body() data: CompraDto & { detalles: DetalleCompraDto[] }): Promise<ApiResponse<Compra>> {
        try {
            const compra = await this.compraService.createCompra(data);
            
            return compra;

        } catch (error) {
            console.log(error);
            return { success: false, error: error.message }
        }
    }

    @Get()
    async findAllCompra(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number
    ): Promise<ApiResponse<{ compras: Compra[], totalRecords: number }>> {
        try {
            // Convertir las fechas de string a Date si están presentes
            const start = startDate ? new Date(startDate) : undefined;
            const end = endDate ? new Date(endDate) : undefined;

            if ((startDate && !endDate) || (!startDate && endDate)) {
                return
            }

            const compras = await this.compraService.findAllCompra(
                {startDate: start,
                endDate: end,
                page,
                pageSize}
            );
            return compras;

        } catch (error) {
            return { success: false, error: error.message }
        }
    }
}
