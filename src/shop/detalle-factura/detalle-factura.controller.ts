import { Body, Controller, Get, Post } from '@nestjs/common';
import { DetalleFacturaService } from './detalle-factura.service';
import { DetalleFactura } from '@prisma/client';
import { DetalleFacturaDto } from './DTO/detalle-factura.dto';
import { ApiResponse } from 'src/interface';

@Controller('api/v1/detalle-factura')
export class DetalleFacturaController {
  constructor(private readonly detalleFacturaService: DetalleFacturaService) { }

  @Post()
  async create(@Body() data: DetalleFacturaDto): Promise<ApiResponse<DetalleFactura>> {
    try {
      const detalle = await this.detalleFacturaService.createDetalleFactura(data);

      return detalle;

    } catch (error) {
      return {success: false, error: error.message}
    }
  }

  @Get()
  async find(): Promise<ApiResponse<DetalleFactura[]>> {
    try {
      const detalles = this.detalleFacturaService.findAllDetalleFactura();
      return detalles;
    } catch (error) {
      return {success: false, error: error.message}
    }
  }
}
