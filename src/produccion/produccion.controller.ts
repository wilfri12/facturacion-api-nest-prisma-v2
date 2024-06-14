import { Controller } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import { ProduccionDto } from './DTO/produccion.dto';
import { ApiResponse } from 'src/interface';
import { Produccion } from '@prisma/client';

@Controller('api/v1/produccion')
export class ProduccionController {
  constructor(private readonly produccionService: ProduccionService) { }

  async createProduccion(data: ProduccionDto): Promise<ApiResponse<Produccion>> {
    try {
      const produccion = await this.produccionService.createProduccion(data);
      return produccion;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async findAllProduccion(): Promise<ApiResponse<Produccion[]>> {
    try {
      const producciones = await this.produccionService.findAllProduccion();
      return producciones;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
