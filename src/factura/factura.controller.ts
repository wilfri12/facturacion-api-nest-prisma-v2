import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaDto } from './DTO/factura.dto';
import { Estado, Factura } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { DetalleFacturaDto } from 'src/shop/detalle-factura/DTO/detalle-factura.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth/auth.guard';

@Controller('api/v1/factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) { }

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


  //@UseGuards(AuthGuard)
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
      console.log('start: ', start);
      console.log('end: ', end);

      console.log('startDate: ', startDate);
      console.log('endDate: ', endDate);

      if ((startDate && !endDate) || (!startDate && endDate)) {
        return
      }

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

    /* @Get('report-factura/:id')
     async employmentLetterById(@Res() response: Response, @Param('id') id: string){
       try {
         const pdfDoc = await this.facturaService.facturareportByIds(+id);
         // response.setHeader('Content-Type', 'application/pdf');
         // pdfDoc.pipe(response);
         // pdfDoc.end();  // End the PDF document after piping
         return pdfDoc;
       } catch (error) {
         console.error(error);
         response.status(500).send('Error al generar el reporte PDF');
       }
     }*/
  }
}