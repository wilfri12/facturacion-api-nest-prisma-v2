import { Body, Controller, Get, Post } from '@nestjs/common';
import { Compra } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { CompraService } from './compra.service';
import { CompraDto, DetalleCompraDto } from './DTO/compra.dto';

@Controller('api/v1/compra')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}
@Post()
  async createCompra(@Body() data: CompraDto & { detalles: DetalleCompraDto[] }): Promise<ApiResponse<Compra>> {
    try {
        const orden = await this.compraService.createCompra(data);
        return orden;

    } catch (error) {
        return { success: false, error: error.message }
    }
}

@Get()
async findAllCompra(): Promise<ApiResponse<Compra[]>> {
    try {
        const ordenes = await this.compraService.findAllCompra();
        return ordenes;

    } catch (error) {
        return { success: false, error: error.message }
    }
} 
}