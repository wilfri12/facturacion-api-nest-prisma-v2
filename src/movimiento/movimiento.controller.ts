import { Controller, Get, Query, HttpException, HttpStatus, Res, BadRequestException, UseGuards } from '@nestjs/common';
import { MovimientoService } from './movimiento.service';
import { TipoMovimiento } from '@prisma/client';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth/auth.guard';


@Controller('api/v1/movimiento')
export class MovimientoController {
  constructor(private readonly movimientoService: MovimientoService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get('generar_reporte')
  async generarReporteMovimientos(
    @Res() response: Response,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('filtroProducto') filtroProducto?: string,
    @Query('tipo') tipo?: TipoMovimiento,
  ) {
    try {
      // Validación básica de fechas
      if (!startDate || !endDate) {
        throw new BadRequestException('El rango de fecha no es válido');
      }

      // Validar tipo de movimiento
      const tipoValido = tipo && ['ENTRADA', 'SALIDA'].includes(tipo as string) ? tipo as TipoMovimiento : undefined;

      // Llamar al servicio para generar el PDF
      const pdfDoc = await this.movimientoService.reporteMovimiento({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        filtroProducto: filtroProducto ?? undefined,
        tipo: tipoValido,
      });

      // Configurar los encabezados para enviar el PDF
      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader(
        'Content-Disposition',
        'attachment; filename="Reporte_movimientos_entrada_salida.pdf"',
      );

      // Enviar el PDF al cliente
      pdfDoc.pipe(response);
      pdfDoc.end();
    } catch (error) {
      console.error('Error al generar el reporte de movimiento:', error);
      response.status(500).json({
        success: false,
        message: 'Error al generar el reporte de movimiento',
        error: error.message || error,
      });
    }
  }

}
