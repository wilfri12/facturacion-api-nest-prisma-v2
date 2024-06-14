import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaDto } from './DTO/factura.dto';
import { Factura } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { DetalleFacturaDto } from 'src/detalle-factura/DTO/detalle-factura.dto';

@Controller('api/v1/factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) { }

  @Post()
  async create(@Body() data: FacturaDto & { detalle: DetalleFacturaDto[] }): Promise<ApiResponse<Factura>> {
    try {
      const factura = await this.facturaService.createFactura(data);

      return factura;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get()
  async find(): Promise<ApiResponse<Factura[]>> {
    try {
      const facturas = this.facturaService.findAllFactura();
      return facturas;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
