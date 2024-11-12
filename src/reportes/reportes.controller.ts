import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import {  ReporteVentasComprasDto, VentasDiariasDto } from './dto/report.dto';

@Controller('api/v1/reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) { }


 // 1. Reporte de Ventas y Compras por Período
@Get('ventas-compras')
async getVentasCompras(
  @Query('fechaInicio') fechaInicio: string,
  @Query('fechaFin') fechaFin: string,
):Promise<{
  success: boolean;
  message: string;
  data?: ReporteVentasComprasDto;
}> {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  if (isNaN(inicio.valueOf()) || isNaN(fin.valueOf())) {
    return {
      success: false,
      message: 'Las fechas proporcionadas no son válidas.',
    };
  }

  try {
    const reporte = await this.reportesService.getVentasComprasPeriodo(inicio, fin);
    return reporte;
  } catch (error) {
    console.error('Error en el reporte de ventas y compras:', error);
    return {
      success: false,
      message: 'Error al realizar la consulta.',
    };
  }
}


 // 2. Ventas Diarias/Mensuales
 @Get('ventas-diarias')
 async getVentasDiarias(
   @Query('fechaInicio') fechaInicio: string,
   @Query('fechaFin') fechaFin: string,
 ): Promise<VentasDiariasDto[]> {
   return this.reportesService.getVentasDiarias(new Date(fechaInicio), new Date(fechaFin));
 }


  

}
