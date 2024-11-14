import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetLocalDate } from 'src/utility/getLocalDate';
import { subWeeks, subMonths, startOfDay, endOfDay, subDays, endOfMonth, startOfMonth, startOfWeek } from 'date-fns';

@Injectable()
export class ReportesService {
  private readonly logger = new Logger(ReportesService.name);

  constructor(private readonly prisma: PrismaService) { }

  // Helper function to log errors
  private logError(message: string, error: Error) {
    this.logger.error(message, error.stack);
  }

  // Helper function to calculate date range
  private getDateRange(periodo: 'semana' | 'mes' | 'dia') {
    const hoy = GetLocalDate();
    let start: Date;
    let end: Date;

    switch (periodo) {
      case 'semana':
        start = startOfWeek(hoy);
        end = endOfDay(hoy);
        break;
      case 'mes':
        start = startOfMonth(hoy);
        end = endOfDay(hoy);
        break;
      case 'dia':
      default:
        start = startOfDay(hoy);
        end = endOfDay(hoy);
        break;
    }

    return { start, end };
  }

  // Helper function to calculate percentage variation
  private calcularVariacion(actual: number, anterior: number): string {
    if (anterior === 0) return actual > 0 ? '100%' : '0%';
    const variacion = ((actual - anterior) / anterior) * 100;
    return `${variacion.toFixed(2)}%`;
  }

  // Function to get products out of stock
  async outStockProduct(page: number = 1, limit: number = 10) {
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.max(1, limit);

    try {
      const [productos, totalRecords] = await Promise.all([
        this.prisma.producto.findMany({
          where: { stock: 0 },
          select: {
            codigo: true,
            nombre: true,
            stock: true,
            categoria: { select: { nombre: true } },
            subCategoria: { select: { nombre: true } },
          },
          skip: (validatedPage - 1) * validatedLimit,
          take: validatedLimit,
        }),
        this.prisma.producto.count({ where: { stock: 0 } })
      ]);

      const totalPages = Math.max(1, Math.ceil(totalRecords / validatedLimit));
      const hasNext = validatedPage < totalPages;

      return {
        success: true,
        data: {
          productos,
          totalRecords,
          limit: validatedLimit,
          currentPage: validatedPage,
          totalPages,
          hasNext,
        },
        message: 'Consulta satisfactoria',
      };
    } catch (error) {
      this.logError(`Error al obtener productos sin stock: ${error.message}`, error);
      throw new Error(`Error al obtener productos sin stock: ${error.message}`);
    }
  }

  // Function to get low stock products
  async lowstockProducts(params: { umbral: number, page: number, limit: number }) {
    const { umbral = 10, page = 1, limit = 10 } = params;
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.max(1, limit);
    const validatedUmbral = Math.max(1, umbral);

    try {
      const [productos, totalRecords] = await Promise.all([
        this.prisma.producto.findMany({
          where: { stock: { lt: validatedUmbral, gt: 0 } },
          select: {
            codigo: true,
            nombre: true,
            stock: true,
            categoria: { select: { nombre: true } },
            subCategoria: { select: { nombre: true } },
          },
          skip: (validatedPage - 1) * validatedLimit,
          take: validatedLimit,
        }),
        this.prisma.producto.count({ where: { stock: { lt: validatedUmbral, gt: 0 } } }),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalRecords / validatedLimit));
      const hasNext = validatedPage < totalPages;

      return {
        success: true,
        data: {
          productos,
          totalRecords,
          limit: validatedLimit,
          currentPage: validatedPage,
          totalPages,
          hasNext,
        },
        message: 'Consulta satisfactoria',
      };
    } catch (error) {
      this.logError(`Error al obtener productos con bajo stock: ${error.message}`, error);
      throw new Error(`Error al obtener productos con bajo stock: ${error.message}`);
    }
  }

  // Function to get total sales of the day
  async totalVentasDelDia() {
    const { start, end } = this.getDateRange('dia');
    const hoy = start;
    const ayer = subDays(hoy, 1);

    try {
      const [totalHoy, totalAyer] = await Promise.all([
        this.getTotalVentasPorFecha(hoy, end),
        this.getTotalVentasPorFecha(ayer, start),
      ]);

      const variacion = this.calcularVariacion(totalHoy, totalAyer);

      return {
        success: true,
        data: {
          totalVentasHoy: totalHoy,
          totalAyer: totalAyer,
          variacion: variacion,
        },
      };
    } catch (error) {
      this.logError(`Error al obtener las ventas del día: ${error.message}`, error);
      throw new Error(`Error al obtener las ventas del día: ${error.message}`);
    }
  }

  // Helper function to calculate total sales for a specific date range
  private async getTotalVentasPorFecha(fechaInicio: Date, fechaFin: Date): Promise<number> {
    const result = await this.prisma.factura.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: fechaInicio, lt: fechaFin } },
    });
    return result._sum.total?.toNumber() || 0;
  }

  // Function to get sales summary by category for a period
  async resumenVentasPorCategoria(periodo: 'semana' | 'mes') {
    const { start, end } = this.getDateRange(periodo);
    const inicioPeriodoAnterior = periodo === 'semana' ? subWeeks(start, 1) : subMonths(start, 1);
    const finPeriodoAnterior = end;

    try {
      const [detallesActual, detallesAnterior] = await Promise.all([
        this.getDetallesVentasPorPeriodo(start, end),
        this.getDetallesVentasPorPeriodo(inicioPeriodoAnterior, finPeriodoAnterior),
      ]);

      const ventasActuales = this.sumarVentasPorCategoria(detallesActual);
      const ventasAnteriores = this.sumarVentasPorCategoria(detallesAnterior);

      const resumen = Object.keys(ventasActuales).map(categoria => {
        const ventasActualesValor = ventasActuales[categoria];
        const ventasAnterioresValor = ventasAnteriores[categoria] || 0;

        const variacion = this.calcularVariacion(ventasActualesValor, ventasAnterioresValor);
        return { categoria, totalVentas: ventasActualesValor, variacionPorcentual: variacion };
      });

      return {
        success: true, data: resumen, periodo: periodo, // El tipo de periodo (semana o mes)
        fechas: {
          inicio: start,
          fin: end
        },
      };
    } catch (error) {
      this.logError(`Error al obtener ventas por categoría: ${error.message}`, error);
      throw new Error(`Error al obtener ventas por categoría: ${error.message}`);
    }
  }

  // Helper function to get sales details for a specific period
  private async getDetallesVentasPorPeriodo(inicio: Date, fin: Date) {
    return this.prisma.detalleFactura.findMany({
      where: { factura: { createdAt: { gte: inicio, lte: fin }, estado: 'PAGADA' } },
      include: { producto: { include: { categoria: true } } },
    });
  }

  // Helper function to sum sales by category
  private sumarVentasPorCategoria(detalles: any[]): Record<string, number> {
    return detalles.reduce((acc, detalle) => {
      const categoria = detalle.producto.categoria?.nombre || 'Sin categoría';
      acc[categoria] = (acc[categoria] || 0) + detalle.importe.toNumber();
      return acc;
    }, {} as Record<string, number>);
  }

  // Function to get the number of issued and paid invoices by month for a given year
  async facturasEmitidasVsPagadasPendientes(year: number) {
    try {
      const facturasEmitidas = await this.prisma.factura.aggregate({
        _count: true,
        where: {
          createdAt: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
        },
      });

      const facturasPagadas = await this.prisma.factura.aggregate({
        _count: true,
        where: {
          createdAt: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
          estado: 'PAGADA',
        },
      });


      const facturasPendientes = await this.prisma.factura.aggregate({
        _count: true,
        where: {
          createdAt: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
          estado: 'PENDIENTE',
        },
      });

      return {
        success: true,
        data: {
          facturasEmitidas: facturasEmitidas._count,
          facturasPagadas: facturasPagadas._count,
          facturasPendientes: facturasPendientes._count,
        },
        message: 'Consulta satisfactoria',
      };
    } catch (error) {
      this.logError(`Error al obtener las facturas emitidas y pagadas: ${error.message}`, error);
      throw new Error(`Error al obtener las facturas emitidas y pagadas: ${error.message}`);
    }
  }

  // Function to get the total purchases made during a specific period (e.g., year)
  async totalComprasRealizadas(year: number) {
    try {
      const totalCompras = await this.prisma.compra.aggregate({
        _sum: {
          total: true,
        },
        where: {
          createdAt: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
        },
      });

      return {
        success: true,
        data: { totalCompras: totalCompras._sum.total || 0 },
        message: 'Consulta satisfactoria',
      };
    } catch (error) {
      this.logError(`Error al obtener el total de compras realizadas: ${error.message}`, error);
      throw new Error(`Error al obtener el total de compras realizadas: ${error.message}`);
    }
  }


  // Function to get the last inventory movements
  async ultimosMovimientosInventario(page: number = 1, limit: number = 10) {
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.max(1, limit);

    try {
      const [movimientos, totalRecords] = await Promise.all([
        this.prisma.movimientoInventario.findMany({
          skip: (validatedPage - 1) * validatedLimit,
          take: validatedLimit,
          orderBy: { createdAt: 'desc' },
          include: {
            producto: { select: { nombre: true } },
          },
        }),
        this.prisma.movimientoInventario.count(),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalRecords / validatedLimit));
      const hasNext = validatedPage < totalPages;

      return {
        success: true,
        data: {
          movimientos,
          totalRecords,
          limit: validatedLimit,
          currentPage: validatedPage,
          totalPages,
          hasNext,
        },
        message: 'Consulta satisfactoria',
      };
    } catch (error) {
      this.logError(`Error al obtener los movimientos de inventario: ${error.message}`, error);
      throw new Error(`Error al obtener los movimientos de inventario: ${error.message}`);
    }
  }

  // Function to get the inventory value by category
  async valorInventario() {
    try {

      const productosInventory = await this.prisma.producto.findMany({
        where: { stock: { gt: 0 } },
        select: {
          precio: true,
          stock: true,
        },
      });

      const valorTotal = productosInventory.reduce((acc, producto) => acc + producto.precio.toNumber() * producto.stock, 0);

      const productos = await this.prisma.producto.findMany({
        where: { stock: { gt: 0 } },
        select: {
          precio: true,
          stock: true,
          categoria: { select: { nombre: true } },
        },
      });

      const valorPorCategoria = productos.reduce((acc, producto) => {
        const categoria = producto.categoria.nombre;
        const valor = producto.precio.toNumber() * producto.stock;
        acc[categoria] = (acc[categoria] || 0) + valor;
        return acc;
      }, {} as Record<string, number>);

      return {
        success: true,
        data: {
          valorTotal,
          valorPorCategoria,
        },
        message: 'Consulta satisfactoria',
      };
    } catch (error) {
      this.logError(`Error al obtener el valor de inventario por categoría: ${error.message}`, error);
      throw new Error(`Error al obtener el valor de inventario por categoría: ${error.message}`);
    }
  }

  // Function to get products with low stock
  async notificacionBajoStock(umbral: number = 10) {
    try {
      const productosBajoStock = await this.prisma.producto.findMany({
        where: { stock: { lt: umbral, gt: 0 } },
        select: {
          nombre: true,
          stock: true,
          categoria: { select: { nombre: true } },
        },
      });

      return {
        success: true,
        data: productosBajoStock,
        message: 'Consulta satisfactoria',
      };
    } catch (error) {
      this.logError(`Error al obtener productos con bajo stock: ${error.message}`, error);
      throw new Error(`Error al obtener productos con bajo stock: ${error.message}`);
    }
  }


  // Function to get the top selling products
  async productosMasVendidos(periodo: 'semana' | 'mes') {
    const { start, end } = this.getDateRange(periodo);

    try {
      const ventas = await this.prisma.detalleFactura.findMany({
        where: {
          factura: {
            createdAt: {
              gte: start,
              lte: end,
            },
            estado: 'PAGADA',
          },
        },
        include: { producto: true },
      });

      const productosVendidos = ventas.reduce((acc, detalle) => {
        const producto = detalle.producto.nombre;
        acc[producto] = (acc[producto] || 0) + detalle.importe.toNumber();
        return acc;
      }, {} as Record<string, number>);

      const productosOrdenados = Object.entries(productosVendidos)
        .sort(([, a], [, b]) => b - a)
        .map(([producto, totalVentas]) => ({ producto, totalVentas }));

      return {
        success: true,
        data: {
          productosOrdenados,
          periodo: periodo, // El tipo de periodo (semana o mes)
          fechas: {
            inicio: start,
            fin: end
          },
        },
        message: 'Consulta satisfactoria',
      };
    } catch (error) {
      this.logError(`Error al obtener los productos más vendidos: ${error.message}`, error);
      throw new Error(`Error al obtener los productos más vendidos: ${error.message}`);
    }
  }

  // Function to calculate gross profit for a given period
  async utilidadBruta(periodo: 'semana' | 'mes') {
    const { start, end } = this.getDateRange(periodo);

    try {
      // Retrieve sales details for the specified period
      const ventas = await this.prisma.detalleFactura.findMany({
        where: {
          factura: {
            createdAt: {
              gte: start,
              lte: end,
            },
            estado: 'PAGADA',
          },
        },
        include: {
          producto: true, // Include product data to access price information
        },
      });

      // Retrieve purchase prices for each product sold
      const detalleCompras = await this.prisma.detalleCompra.findMany({
        where: {
          productoId: { in: ventas.map((detalle) => detalle.productoId) },
        },
        select: {
          productoId: true,
          precioCompra: true,
        },
      });

      // Map purchase prices to products for easy lookup
      const preciosCompra = detalleCompras.reduce((acc, detalle) => {
        acc[detalle.productoId] = detalle.precioCompra.toNumber();
        return acc;
      }, {} as Record<number, number>);

      // Calculate total sales and gross profit
      let totalVentas = 0;
      let totalCosto = 0;
      const utilidadBruta = ventas.reduce((acc, detalle) => {
        const precioCompra = preciosCompra[detalle.productoId] || 0;
        const precioVenta = detalle.importe.toNumber();
        const gananciaBruta = precioVenta - precioCompra;

        // Acumula la utilidad bruta y los totales
        acc += gananciaBruta * detalle.cantidad; // Consider quantity sold in the profit calculation
        totalVentas += precioVenta * detalle.cantidad; // Total de ventas
        totalCosto += precioCompra * detalle.cantidad; // Total del costo de los productos

        return acc;
      }, 0);

      return {
        success: true,
        data: {
          totalVentas,
          totalCosto,
          utilidadBruta,
          periodo: periodo, // El tipo de periodo (semana o mes)
          fechas: {
            inicio: start,
            fin: end
          },
        },
        message: 'Consulta satisfactoria',
      };
    } catch (error) {
      this.logError(`Error al calcular la utilidad bruta: ${error.message}`, error);
      throw new Error(`Error al calcular la utilidad bruta: ${error.message}`);
    }
  }



  async getLineData(year: number) {
    try {
      // Array de meses en español
      const labels = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];

      const ventasMensuales = await Promise.all(
        Array.from({ length: 12 }, async (_, month) => {
          const start = startOfMonth(new Date(year, month));
          const end = endOfMonth(new Date(year, month));
          const ventas = await this.prisma.factura.aggregate({
            _sum: { total: true },
            where: { createdAt: { gte: start, lte: end }, estado: 'PAGADA' },
          });
          return ventas._sum.total?.toNumber() || 0;
        })
      );

      const comprasMensuales = await Promise.all(
        Array.from({ length: 12 }, async (_, month) => {
          const start = startOfMonth(new Date(year, month));
          const end = endOfMonth(new Date(year, month));
          const compras = await this.prisma.compra.aggregate({
            _sum: { total: true },
            where: { createdAt: { gte: start, lte: end } },
          });
          return compras._sum.total?.toNumber() || 0;
        })
      );

      const lineData = {
        labels,
        datasets: [
          {
            label: 'Ventas (RD$)',
            data: ventasMensuales,
            borderColor: '#28a745', // Verde para ventas
            fill: false,
            tension: 0.4,
          },
          {
            label: 'Compras (RD$)',
            data: comprasMensuales,
            borderColor: '#f97316', // Naranja para compras
            fill: false,
            tension: 0.4,
          },
        ],
      };

      return {
        success: true,
        data: lineData,
        message: 'Consulta satisfactoria',
      };
    } catch (error) {
      this.logger.error(`Error al obtener datos de ventas y compras: ${error.message}`, error.stack);
      throw new Error(`Error al obtener datos de ventas y compras: ${error.message}`);
    }
  }



}
