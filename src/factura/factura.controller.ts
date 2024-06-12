import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { Detalle_factura, Factura } from '@prisma/client';
import { DetalleFacturaService } from 'src/detalle-factura/detalle-factura.service';
import { CreateFacturaDto } from './DTO/create-factura.dto';

@Controller('api/v1/factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Post()
    async create(@Body() createFacturaDto: CreateFacturaDto): Promise<{ success: boolean; factura?: Factura; error?: string }> {
        try {
            console.log('Se recibió esta data en controller:', createFacturaDto);
            
            const result = await this.facturaService.createFatura(createFacturaDto);
            if (result.success) {
                return { success: true, factura: result.factura };
            } else {
                throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            console.error('Error en controller:', error);
            throw new HttpException(error.message || 'Error inesperado', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

  @Get()
  async find(): Promise<Factura[]>
  {
    const facturas = this.facturaService.findAllFactura();
    return facturas;
  }
}
