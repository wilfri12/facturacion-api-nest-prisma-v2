import { Controller } from '@nestjs/common';
import { OrdenCompraService } from './orden-compra.service';
import { OrdenCompraDto } from './DTO/orden-compra.dto';
import { ApiResponse } from 'src/interface';
import { OrdenCompra } from '@prisma/client';

@Controller('orden-compra')
export class OrdenCompraController {
  constructor(private readonly ordenCompraService: OrdenCompraService) {}

  async createOrdenCompra(data: OrdenCompraDto): Promise<ApiResponse<OrdenCompra>> {
    try {
        const orden = await this.ordenCompraService.createOrdenCompra(data);
        return orden;

    } catch (error) {
        return { success: false, error: error.message }
    }
}

async findAllOrdenCompra(): Promise<ApiResponse<OrdenCompra[]>> {
    try {
        const ordenes = await this.ordenCompraService.findAllOrdenCompra();
        return ordenes;

    } catch (error) {
        return { success: false, error: error.message }
    }
} 
}
