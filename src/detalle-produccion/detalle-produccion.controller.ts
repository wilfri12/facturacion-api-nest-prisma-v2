import { Body, Controller, Get, Post } from '@nestjs/common';
import { DetalleProduccionService } from './detalle-produccion.service';
import { ApiResponse } from 'src/interface';
import { DetalleProduccionDTO } from './DTO/detalle-produccion.dto';

@Controller('api/v1/detalle-produccion')
export class DetalleProduccionController {
  constructor(private readonly detalleProduccionService: DetalleProduccionService) {}

  @Post()
  async create(@Body() data: DetalleProduccionDTO): Promise<ApiResponse<DetalleProduccionDTO>>{
    try {
        const detalle = await this.detalleProduccionService.createDetalleProduccion(data);
        return detalle;
    } catch (error) {
      return {success: true, error: error.message}
    }
}

@Get()
async findAll(): Promise<ApiResponse<DetalleProduccionDTO[]>>{
    try {
        const detalles = await this.detalleProduccionService.findAllDetalleProduccion();
        return detalles;
    } catch (error) {
      return {success: true, error: error.message}
    }
}
}
