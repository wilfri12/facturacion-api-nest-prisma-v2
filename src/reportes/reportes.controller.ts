import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { DashboardData, ReportesService } from './reportes.service';
import { ApiResponse } from 'src/interface';
import { AuthGuard } from 'src/auth/auth/auth.guard';

@Controller('api/v1/dashboard')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // Endpoint para comparar ventas diarias
  @UseGuards(AuthGuard)
  @Get('ventas-diarias')
  async compararVentasDiarias() {
    try {
      const result = await this.reportesService.compararVentasDiarias();
      return result;
    } catch (error) {
      console.error('Error al comparar ventas diarias:', error);
      return {
        success: false,
        message: 'Error al comparar ventas diarias.',
        error: error.message,
      };
    }
  }

  // Endpoint para obtener productos sin stock
  @UseGuards(AuthGuard)
  @Get('productos-sin-stock')
  async obtenerProductosSinStock(
    @Query('pagina') pagina: number = 1,
    @Query('limite') limite: number = 10
  ) {
    try {
      const result = await this.reportesService.obtenerProductosSinStock(pagina, limite);
      return result;
    } catch (error) {
      console.error('Error al obtener productos sin stock:', error);
      return {
        success: false,
        message: 'Error al obtener productos sin stock.',
        error: error.message,
      };
    }
  }

  // Endpoint para obtener productos con bajo stock
  @UseGuards(AuthGuard)
  @Get('productos-bajo-stock')
  async obtenerProductosBajoStock(
    @Query('umbral') umbral: number = 10,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    try {
      const result = await this.reportesService.obtenerProductosBajoStock({ umbral, page, limit,  });
      return result;
    } catch (error) {
      console.error('Error al obtener productos con bajo stock:', error);
      return {
        success: false,
        message: 'Error al obtener productos con bajo stock.',
        error: error.message,
      };
    }
  }


  // Endpoint para calcular el valor total del inventario
  @UseGuards(AuthGuard)
  @Get('valor-inventario-total')
  async calcularValorInventarioTotal() {
    try {
      const result = await this.reportesService.calcularValorInventarioTotal();
      return result;
    } catch (error) {
      console.error('Error al calcular el valor total del inventario:', error);
      return {
        success: false,
        message: 'Error al calcular el valor total del inventario.',
        error: error.message,
      };
    }
  }

  // Endpoint para calcular la utilidad bruta en un periodo
  @UseGuards(AuthGuard)
  @Get('calculos')
async calcularDatosDashboard(
  @Query('inicio') inicio: string,
  @Query('fin') fin: string,
): Promise<{ success: boolean; data?: DashboardData; message?: string; error?: string }> {
  // Validar que los parámetros de fecha estén presentes
  if (!inicio || !fin) {
    return {
      success: false,
      message: 'Los parámetros "inicio" y "fin" son obligatorios.',
    };
  }

  try {
    const periodoInicio = new Date(inicio);
    const periodoFin = new Date(fin);

    // Validar que las fechas sean válidas
    if (isNaN(periodoInicio.getTime()) || isNaN(periodoFin.getTime())) {
      return {
        success: false,
        message: 'Los parámetros de fecha no son válidos.',
      };
    }

    // Asegurarse de que la fecha de inicio no sea mayor a la de fin
    if (periodoInicio > periodoFin) {
      return {
        success: false,
        message: 'La fecha de inicio no puede ser mayor que la fecha de fin.',
      };
    }

    // Llamar al servicio para calcular los datos del dashboard
    const result = await this.reportesService.calcularDatosDashboard(
      periodoInicio,
      periodoFin,
    );

    return result;
  } catch (error) {
    console.error('Error al calcular los datos del dashboard:', error);
    return {
      success: false,
      message: 'Ocurrió un error al calcular los datos del dashboard.',
      error: error.message,
    };
  }
}

  

  // Endpoint para obtener productos más vendidos
  @UseGuards(AuthGuard)
  @Get('productos-mas-vendidos')
  async obtenerProductosMasVendidos(
    @Query('periodo') periodo: 'semana' | 'mes',
    @Query('limite') limite: number = 10
  ) {
    try {
      const result = await this.reportesService.obtenerProductosMasVendidos(periodo, limite);
      return result;
    } catch (error) {
      console.error('Error al obtener productos más vendidos:', error);
      return {
        success: false,
        message: 'Error al obtener productos más vendidos.',
        error: error.message,
      };
    }
  }

  // Endpoint para obtener resumen de facturas por estado
  @UseGuards(AuthGuard)
  @Get('resumen-facturas-estado')
  async resumenFacturasPorEstado(
    @Query('year') year: number
  ) {
    try {
      const result = await this.reportesService.resumenFacturasPorEstado(year);
      return result;
    } catch (error) {
      console.error('Error al obtener resumen de facturas por estado:', error);
      return {
        success: false,
        message: 'Error al obtener resumen de facturas por estado.',
        error: error.message,
      };
    }
  }

  // Endpoint para obtener datos de ventas y compras mensuales para el año especificado
  @UseGuards(AuthGuard)
  @Get('ventas-compras-mensuales')
  async obtenerDatosVentasComprasMensuales(
    @Query('year') year: number
  ) {
    try {
      const result = await this.reportesService.obtenerDatosVentasComprasMensuales(year);
      return result;
    } catch (error) {
      console.error('Error al obtener datos de ventas y compras mensuales:', error);
      return {
        success: false,
        message: 'Error al obtener datos de ventas y compras mensuales.',
        error: error.message,
      };
    }
  }
}
