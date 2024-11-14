import { Controller, Get, Query, Param } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ApiResponse } from 'src/interface';

@Controller('api/v1/reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // Endpoint para comparar ventas diarias
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

  // Endpoint para obtener resumen de ventas por categoría
  @Get('resumen-ventas-categoria')
  async resumenVentasPorCategoria(
    @Query('periodo') periodo: 'dia' | 'semana' | 'mes',
    @Query('umbral') umbral: number = 0
  ) {
    try {
      const result = await this.reportesService.resumenVentasPorCategoria(periodo, umbral);
      return result;
    } catch (error) {
      console.error('Error al obtener resumen de ventas por categoría:', error);
      return {
        success: false,
        message: 'Error al obtener resumen de ventas por categoría.',
        error: error.message,
      };
    }
  }

  // Endpoint para calcular el valor total del inventario
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
  @Get('utilidad-bruta')
  async getUtilidadBruta(
    @Query('periodo') periodo: 'semana' | 'mes',
  ) {
    try {
      const result = await this.reportesService.calcularUtilidadBruta(periodo);
      return result;
    } catch (error) {
      console.error('Error al calcular la utilidad bruta:', error);
      return {
        success: false,
        message: 'Error al calcular la utilidad bruta.',
        error: error.message,
      };
    }
  }

  // Endpoint para obtener productos más vendidos
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
