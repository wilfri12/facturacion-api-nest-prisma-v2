import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaDto } from './DTO/factura.dto';
import { Estado, Factura } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { DetalleFacturaDto } from 'src/shop/detalle-factura/DTO/detalle-factura.dto';

@Controller('api/v1/factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Post()
  async create(@Body() data: FacturaDto & { detalles: DetalleFacturaDto[] }): Promise<ApiResponse<Factura>> {
    try {
      const factura = await this.facturaService.createFactura(data);
      return factura;
    } catch (error) {
      throw new HttpException({
        success: false,
        message: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async find(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('estado') estado?: Estado,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number
  ): Promise<ApiResponse<{ facturas: Factura[], totalRecords: number }>> {
    try {
      // Convertir las fechas de string a Date si están presentes
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      const facturas = await this.facturaService.findAllFactura({
        startDate: start,
        endDate: end,
        estado,
        page,
        pageSize
      });

      return facturas;
    } catch (error: any) {
      throw new HttpException({
        success: false,
        message: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
