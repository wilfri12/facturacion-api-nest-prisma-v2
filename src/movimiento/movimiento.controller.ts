import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { MovimientoService } from './movimiento.service';
import { TipoMovimiento } from '@prisma/client';

@Controller('api/v1/movimiento')
export class MovimientoController {
  constructor(private readonly movimientoService: MovimientoService) {}

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('filtroProducto') filtroProducto?: string,
    @Query('tipo') tipo?: TipoMovimiento,
  ) {
    try {
      // Convertir las fechas de string a Date si están presentes
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      if ((startDate && !endDate) || (!startDate && endDate)) {
        return
      }

      const facturas = await this.movimientoService.findAll({
        startDate: start,
        endDate: end,
        filtroProducto,
        tipo,
        page,
        limit: limit
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
