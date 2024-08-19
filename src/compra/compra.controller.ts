import { Controller } from '@nestjs/common';
import { Compra } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { OrdenCompraService } from './compra.service';
import { OrdenCompraDto } from './DTO/compra.dto';

@Controller('orden-compra')
export class OrdenCompraController {
  constructor(private readonly ordenCompraService: OrdenCompraService) {}

  async createOrdenCompra(data: OrdenCompraDto): Promise<ApiResponse<Compra>> {
    try {
        const orden = await this.ordenCompraService.createOrdenCompra(data);
        return orden;

    } catch (error) {
        return { success: false, error: error.message }
    }
}

async findAllOrdenCompra(): Promise<ApiResponse<Compra[]>> {
    try {
        const ordenes = await this.ordenCompraService.findAllOrdenCompra();
        return ordenes;

    } catch (error) {
        return { success: false, error: error.message }
    }
} 
}
