import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaDto } from './DTO/factura.dto';
import { DetalleFactura, Estado, Factura, MetodoPago } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth/auth.guard';

@Controller('api/v1/factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) { }

  @Post()
  async create(@Body() data: FacturaDto & { detalles: DetalleFactura[] }): Promise<ApiResponse<Factura>> {
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


  //@UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('estado') estado?: Estado,
    @Query('metodoPago') metodoPago?: MetodoPago,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('codigo') codigo?: string,
  ): Promise<ApiResponse<{ facturas: Factura[], totalRecords: number }>> {
    try {
      // Convertir las fechas de string a Date si están presentes
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      if ((startDate && !endDate) || (!startDate && endDate)) {
        return
      }

      const facturas = await this.facturaService.findAllFactura({
        startDate: start,
        endDate: end,
        estado,
        metodoPago,
        page,
        pageSize,
        codigo
      });

      return facturas;
    } catch (error: any) {
      throw new HttpException({
        success: false,
        message: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get('/:idFactura')
  async findByCodigo2(@Param('idFactura') idFactura: number) {

    try {
      return this.facturaService.findFacturaById(+idFactura);

    } catch (error) {
      return { success: false, error: error.message }
    }
  }



  @Get('report-factura/:id')
  async employmentLetterById(@Res() response: Response, @Param('id') id: string) {
    try {
      const pdfDoc = await this.facturaService.facturaReportById(+id);
       response.setHeader('Content-Type', 'application/pdf');
       pdfDoc.pipe(response);
       pdfDoc.end();  // End the PDF document after piping
      return pdfDoc;
    } catch (error) {
      console.error(error);
      response.status(500).send('Error al generar el reporte PDF');
    }

  }

  @Get('generar/reporte/facturas')
  async generarReporteFacturas(
    @Res() response: Response,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('estado') estado?: string,
    @Query('metodoPago') metodoPago?: string,
  ) {
    try {

      if (startDate === undefined || endDate === undefined) {
        throw "El rango de fecha no es valido";
      }
      // Llamar al servicio para generar el PDF
      const pdfDoc = await this.facturaService.facturaReportByParams({
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        estado,
        metodoPago,
        
      });

      // Configurar los encabezados para enviar el PDF
      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader(
        'Content-Disposition',
        'attachment; filename="Reporte_Facturas.pdf"'
      );

      // Enviar el PDF al cliente
      pdfDoc.pipe(response);
      pdfDoc.end();
    } catch (error) {
      console.error('Error al generar el reporte de facturas:', error);
      response.status(500).send('Error al generar el reporte de facturas');
    }
  }


  @Patch('pagar/:id')
  async pagarFactura(@Param('id') id: string) {
    try {
      // Convierte el ID a número y llama al servicio para pagar la factura
      const response: ApiResponse<Factura> = await this.facturaService.pagarFactura(Number(+id));

      if (response.success) {
        // Retorna la factura actualizada en caso de éxito
        return {
          success: true,
          message: 'Factura marcada como pagada exitosamente',
          data: response.data,
        };
      } else {
        // Lanza una excepción en caso de error
        throw new HttpException(response.error || 'Error al pagar la factura', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      // Captura errores inesperados y responde con estado 500
      throw new HttpException(error.message || 'Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  
}