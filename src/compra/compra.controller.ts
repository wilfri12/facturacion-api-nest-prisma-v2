import { Controller } from '@nestjs/common';
import { Compra } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { CompraService } from './compra.service';
import { CompraDto, DetalleCOmpraDto } from './DTO/compra.dto';

@Controller('orden-compra')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  async createCompra(data: CompraDto & { detalles: DetalleCOmpraDto[] }): Promise<ApiResponse<Compra>> {
    try {
        const orden = await this.compraService.createCompra(data);
        return orden;

    } catch (error) {
        return { success: false, error: error.message }
    }
}

async findAllCompra(): Promise<ApiResponse<Compra[]>> {
    try {
        const ordenes = await this.compraService.findAllCompra();
        return ordenes;

    } catch (error) {
        return { success: false, error: error.message }
    }
} 
}
