import { Controller, Get, Query, Param } from '@nestjs/common';
import { ReportesService } from './reportes.service';

@Controller('api/v1/reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('out-of-stock')
  async getOutOfStockProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const result = await this.reportesService.outStockProduct(page, limit);
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

  @Get('low-stock')
  async getLowStockProducts(
    @Query('umbral') umbral: number = 10,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const result = await this.reportesService.lowstockProducts({ umbral, page, limit });
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

  @Get('ventas-dia')
  async getVentasDelDia() {
    try {
      const result = await this.reportesService.totalVentasDelDia();
      return result;
    } catch (error) {
      console.error('Error al obtener las ventas del día:', error);
      return {
        success: false,
        message: 'Error al obtener las ventas del día.',
        error: error.message,
      };
    }
  }

  @Get('ventas-categoria')
  async getResumenVentasPorCategoria(
    @Query('periodo') periodo: 'semana' | 'mes',
  ) {
    try {
      const result = await this.reportesService.resumenVentasPorCategoria(periodo);
      return result;
    } catch (error) {
      console.error('Error al obtener ventas por categoría:', error);
      return {
        success: false,
        message: 'Error al obtener ventas por categoría.',
        error: error.message,
      };
    }
  }

  @Get('facturas-emitidas-vs-pagadas/:year')
  async getFacturasEmitidasVsPagadas(
    @Param('year') year: number,
  ) {
    try {
      const result = await this.reportesService.facturasEmitidasVsPagadasPendientes(year);
      return result;
    } catch (error) {
      console.error('Error al obtener las facturas emitidas y pagadas:', error);
      return {
        success: false,
        message: 'Error al obtener las facturas emitidas y pagadas.',
        error: error.message,
      };
    }
  }

  @Get('total-compras/:year')
  async getTotalComprasRealizadas(
    @Param('year') year: number,
  ) {
    try {
      const result = await this.reportesService.totalComprasRealizadas(year);
      return result;
    } catch (error) {
      console.error('Error al obtener el total de compras realizadas:', error);
      return {
        success: false,
        message: 'Error al obtener el total de compras realizadas.',
        error: error.message,
      };
    }
  }

  @Get('valor-inventario')
  async valorInventario() {
    try {
      const result = await this.reportesService.valorInventario();
      return result;
    } catch (error) {
      console.error('Error al obtener el valor total del inventario:', error);
      return {
        success: false,
        message: 'Error al obtener el valor total del inventario.',
        error: error.message,
      };
    }
  }

  @Get('ultimos-movimientos-inventario')
  async getUltimosMovimientosInventario(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const result = await this.reportesService.ultimosMovimientosInventario(page, limit);
      return result;
    } catch (error) {
      console.error('Error al obtener los movimientos de inventario:', error);
      return {
        success: false,
        message: 'Error al obtener los movimientos de inventario.',
        error: error.message,
      };
    }
  }


  @Get('notificacion-bajo-stock')
  async getNotificacionBajoStock(
    @Query('umbral') umbral: number = 10,
  ) {
    try {
      const result = await this.reportesService.notificacionBajoStock(umbral);
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

 

  @Get('productos-mas-vendidos')
  async getProductosMasVendidos(
    @Query('periodo') periodo: 'semana' | 'mes',
  ) {
    try {
      const result = await this.reportesService.productosMasVendidos(periodo);
      return result;
    } catch (error) {
      console.error('Error al obtener los productos más vendidos:', error);
      return {
        success: false,
        message: 'Error al obtener los productos más vendidos.',
        error: error.message,
      };
    }
  }

  @Get('utilidad-bruta')
  async getUtilidadBruta(
    @Query('periodo') periodo: 'semana' | 'mes',
  ) {
    try {
      const result = await this.reportesService.utilidadBruta(periodo);
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

  @Get('line-data')
  async getLineData(@Query('year') year: string) {
    const yearNumber = parseInt(year, 10);
    return this.reportesService.getLineData(yearNumber);
  }
}
