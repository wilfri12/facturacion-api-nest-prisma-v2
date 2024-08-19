import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse } from '../interface';
import { DetalleOrdenCompraService } from './detalle-compra.service';
import { DetalleCompra } from '@prisma/client';
import { DetalleOrdenCompraDto } from './DTO/detalle-compra.dto';

@Controller('api/v1/detalle-orden-compra')
export class DetalleOrdenCompraController {
  constructor(private readonly detalleOrdenCompraService: DetalleOrdenCompraService) { }

  @Post()
  async create(@Body() data: DetalleOrdenCompraDto): Promise<ApiResponse<DetalleCompra>> {
    try {
      const detalle = await this.detalleOrdenCompraService.createDetalleOrdenCompra(data);
      return detalle;
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Get()
  async find(): Promise<ApiResponse<DetalleCompra[]>> {
    try {
      const detalles = this.detalleOrdenCompraService.findAllDetalleOrdenCompra();
      return detalles;
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
