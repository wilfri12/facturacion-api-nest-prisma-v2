import { Body, Controller, Get, Post } from '@nestjs/common';
import { DetalleProduccionService } from './detalle-produccion.service';
import { ApiResponse } from 'src/interface';
import { DetalleProduccionDto } from './DTO/detalle-produccion.dto';

@Controller('api/v1/detalle-produccion')
export class DetalleProduccionController {
  constructor(private readonly detalleProduccionService: DetalleProduccionService) {}

  @Post()
  async create(@Body() data: DetalleProduccionDto): Promise<ApiResponse<DetalleProduccionDto>>{
    try {
        const detalle = await this.detalleProduccionService.createDetalleProduccion(data);
        return detalle;
    } catch (error) {
      return {success: true, error: error.message}
    }
}

@Get()
async findAll(): Promise<ApiResponse<DetalleProduccionDto[]>>{
    try {
        const detalles = await this.detalleProduccionService.findAllDetalleProduccion();
        return detalles;
    } catch (error) {
      return {success: true, error: error.message}
    }
}
}
