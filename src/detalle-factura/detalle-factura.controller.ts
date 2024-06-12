import { Body, Controller, Get, Post } from '@nestjs/common';
import { DetalleFacturaService } from './detalle-factura.service';
import { Detalle_factura } from '@prisma/client';

@Controller('api/v1/detalle-factura')
export class DetalleFacturaController {
  constructor(private readonly detalleFacturaService: DetalleFacturaService) {}

  @Post()
  async create(@Body() data: any): Promise<any> {
    try {
      
      const detallesFactura = await this.detalleFacturaService.createDetalleFactura(data);

      return { success: true, detallesFactura }; 

    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Get()
  async find(): Promise<Detalle_factura[]>
  {
    const detallesFacturas = this.detalleFacturaService.findAllDetalleFactura();
    return detallesFacturas;
  }
}
