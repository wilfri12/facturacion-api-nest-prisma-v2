import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import { ProduccionDTO  } from './DTO/produccion.dto';
import { ApiResponse } from 'src/interface';
import { Produccion } from '@prisma/client';
import { DetalleProduccionDTO } from 'src/detalle-produccion/DTO/detalle-produccion.dto';

@Controller('api/v1/produccion')
export class ProduccionController {
  constructor(private readonly produccionService: ProduccionService) { }
  
  @Post()
  async createProduccion(@Body() data: ProduccionDTO & { detalle: DetalleProduccionDTO[] }): Promise<ApiResponse<Produccion>> {
    try {
      const produccion = await this.produccionService.createProduccion(data);
      return produccion;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
@Get()
  async findAllProduccion(): Promise<ApiResponse<Produccion[]>> {
    try {
      const producciones = await this.produccionService.findAllProduccion();
      return producciones;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
