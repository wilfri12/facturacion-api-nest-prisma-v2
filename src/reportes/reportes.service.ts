import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { GetLocalDate } from 'src/utility/getLocalDate';
import { Producto } from '@prisma/client';

@Injectable()
export class ReportesService {
  constructor(private prisma: PrismaService) {}

  // Servicio que compara ventas diarias de hoy y ayer
  async compararVentasDiarias(): Promise<ApiResponse<{ totalVentasHoy: number; cantidadVentasHoy: number; totalAyer: number; cantidadAyer: number; variacion: string }>> {
    const hoy = GetLocalDate();
    hoy.setHours(0, 0, 0, 0);
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);

    const ventasHoy = await this.prisma.factura.aggregate({
      _sum: { total: true },
      _count: { id: true },
      where: { createdAt: { gte: hoy } },
    });

    const ventasAyer = await this.prisma.factura.aggregate({
      _sum: { total: true },
      _count: { id: true },
      where: { createdAt: { gte: ayer, lt: hoy } },
    });

    const variacion = this.calcularVariacion(ventasHoy._sum.total.toNumber(), ventasAyer._sum.total.toNumber());

    return {
      success: true,
      data: {
        totalVentasHoy: ventasHoy._sum.total?.toNumber() || 0,
        cantidadVentasHoy: ventasHoy._count.id || 0,
        totalAyer: ventasAyer._sum.total?.toNumber() || 0,
        cantidadAyer: ventasAyer._count.id || 0,
        variacion: `${variacion}%`
      }
    };
  }

  // Servicio que obtiene productos sin stock obtenerProductosSinStock
  async obtenerProductosSinStock(page: number = 1, limit: number = 10) {
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
      throw new Error(`Error al obtener productos sin stock: ${error.message}`);
    }
  }

  // Servicio que obtiene productos con bajo stock 
  async obtenerProductosBajoStock(params: { umbral: number, page: number, limit: number }) {
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
      throw new Error(`Error al obtener productos con bajo stock: ${error.message}`);
    }
  }

  // Servicio que obtiene resumen de ventas por categoría
  async resumenVentasPorCategoria(periodo: 'dia' | 'semana' | 'mes', umbral: number = 0): Promise<ApiResponse<{ categoria: string; totalVentas: number; cantidadVentas: number }[]>> {
  const fechaInicio = this.calcularFechaInicio(periodo);
  
  // Agrupamos por producto en los detalles de factura y sumamos el importe
  const ventas = await this.prisma.detalleFactura.groupBy({
    by: ['productoId'],
    _sum: { importe: true },
    _count: { id: true },
    where: {
      factura: { createdAt: { gte: fechaInicio } }
    }
  });

  // Mapeamos las ventas para obtener la categoría asociada a cada producto
  const ventasPorCategoria = await Promise.all(
    ventas.map(async (venta) => {
      const producto = await this.prisma.producto.findUnique({
        where: { id: venta.productoId },
        select: { categoria: { select: { nombre: true } } }
      });

      return {
        categoria: producto?.categoria.nombre || 'Sin categoría',
        totalVentas: venta._sum.importe?.toNumber() || 0,
        cantidadVentas: venta._count.id || 0
      };
    })
  );

  // Filtramos según el umbral y preparamos la respuesta
  return {
    success: true,
    data: ventasPorCategoria.filter(v => v.totalVentas >= umbral)
  };
}


  // Servicio que calcula el valor total del inventario
  async calcularValorInventarioTotal() {
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
      throw new Error(`Error al obtener el valor de inventario por categoría: ${error.message}`);
    }
  }

  // Servicio que calcula utilidad bruta en un periodo
  async calcularUtilidadBruta(periodo: 'semana' | 'mes'): Promise<ApiResponse<{ totalVentas: number; totalCosto: number; utilidadBruta: number }>> {
    const fechaInicio = this.calcularFechaInicio(periodo);
    const ventas = await this.prisma.factura.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: fechaInicio } }
    });
    const costo = await this.prisma.producto.aggregate({
      _sum: { precio: true, stock: true }
    });
    const totalCosto = costo._sum.precio?.toNumber() * (costo._sum.stock || 0) || 0;
    const utilidadBruta = (ventas._sum.total?.toNumber() || 0) - totalCosto;

    return {
      success: true,
      data: {
        totalVentas: ventas._sum.total?.toNumber() || 0,
        totalCosto,
        utilidadBruta
      }
    };
  }

  // Servicio que obtiene productos más vendidos
async obtenerProductosMasVendidos(periodo: 'semana' | 'mes', limite: number = 10): Promise<ApiResponse<{ producto: string; categoria: string; totalVentas: number }[]>> {
  const fechaInicio = this.calcularFechaInicio(periodo);
  
  // Agrupamos los detalles de factura por producto y sumamos las cantidades
  const productosVendidos = await this.prisma.detalleFactura.groupBy({
    by: ['productoId'],
    _sum: { cantidad: true },
    where: {
      factura: { createdAt: { gte: fechaInicio } }
    },
    orderBy: {
      _sum: { cantidad: 'desc' }
    },
    take: Number(limite)
  });

  // Mapeamos los resultados para obtener los nombres de productos y categorías
  const productosConDetalles = await Promise.all(
    productosVendidos.map(async (producto) => {
      const detallesProducto = await this.prisma.producto.findUnique({
        where: { id: producto.productoId },
        select: {
          nombre: true,
          categoria: {
            select: { nombre: true }
          }
        }
      });
      return {
        producto: detallesProducto?.nombre || 'Producto desconocido',
        categoria: detallesProducto?.categoria.nombre || 'Sin categoría',
        totalVentas: producto._sum.cantidad || 0
      };
    })
  );

  return {
    success: true,
    data: productosConDetalles
  };
}


  // Servicio que obtiene resumen de facturas por estado
  async resumenFacturasPorEstado(year: number): Promise<ApiResponse<{ facturasEmitidas: number; totalEmitido: number; facturasPagadas: number; totalPagado: number; facturasPendientes: number; totalPendiente: number }>> {
    const inicioAño = new Date(`${Number(year)}-01-01`);
    const finAño = new Date(`${Number(year) + 1}-01-01`);

    const facturasEmitidas = await this.prisma.factura.aggregate({
      _count: { id: true },
      _sum: { total: true },
      where: { createdAt: { gte: inicioAño, lt: finAño } }
    });
    const facturasPagadas = await this.prisma.factura.aggregate({
      _count: { id: true },
      _sum: { total: true },
      where: { estado: 'PAGADA', createdAt: { gte: inicioAño, lt: finAño } }
    });

    const facturasPendientes = (facturasEmitidas._count.id || 0) - (facturasPagadas._count.id || 0);
    const totalPendiente = (facturasEmitidas._sum.total?.toNumber() || 0) - (facturasPagadas._sum.total?.toNumber() || 0);

    return {
      success: true,
      data: {
        facturasEmitidas: facturasEmitidas._count.id || 0,
        totalEmitido: facturasEmitidas._sum.total?.toNumber() || 0,
        facturasPagadas: facturasPagadas._count.id || 0,
        totalPagado: facturasPagadas._sum.total?.toNumber() || 0,
        facturasPendientes,
        totalPendiente
      }
    };
  }

 // Servicio que obtiene datos de ventas y compras mensuales para el year especificado
async obtenerDatosVentasComprasMensuales(year: number): Promise<ApiResponse<{ etiquetas: string[]; datosVentas: number[]; datosCompras: number[] }>> {
  const etiquetas = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const datosVentas = Array(12).fill(0);
  const datosCompras = Array(12).fill(0);

  // Obtener ventas agrupadas por mes
  const ventas = await this.prisma.factura.groupBy({
    by: ['createdAt'],
    _sum: { total: true },
    where: {
      createdAt: {
        gte: new Date(`${Number(year)}-01-01`),
        lt: new Date(`${Number(year) + 1}-01-01`)
      }
    }
  });

  // Distribuir ventas en el array de datosVentas basado en el mes
  ventas.forEach(venta => {
    const mes = new Date(venta.createdAt).getMonth();
    datosVentas[mes] += venta._sum.total?.toNumber() || 0;
  });

  // Obtener compras agrupadas por mes
  const compras = await this.prisma.compra.groupBy({
    by: ['createdAt'],
    _sum: { total: true },
    where: {
      createdAt: {
        gte: new Date(`${Number(year)}-01-01`),
        lt: new Date(`${Number(year) + 1}-01-01`)
      }
    }
  });

  // Distribuir compras en el array de datosCompras basado en el mes
  compras.forEach(compra => {
    const mes = new Date(compra.createdAt).getMonth();
    datosCompras[mes] += compra._sum.total?.toNumber() || 0;
  });

  return {
    success: true,
    data: { etiquetas, datosVentas, datosCompras }
  };
}

  // Función auxiliar para calcular variación porcentual
  private calcularVariacion(totalHoy: number, totalAyer: number): number {
    if (totalAyer === 0) return totalHoy > 0 ? 100 : 0;
    return ((totalHoy - totalAyer) / totalAyer) * 100;
  }

  // Función auxiliar para calcular la fecha de inicio en función del período
  private calcularFechaInicio(periodo: 'dia' | 'semana' | 'mes'): Date {
    const fechaActual = new Date();
    if (periodo === 'dia') return new Date(fechaActual.setDate(fechaActual.getDate() - 1));
    if (periodo === 'semana') return new Date(fechaActual.setDate(fechaActual.getDate() - 7));
    if (periodo === 'mes') return new Date(fechaActual.setMonth(fechaActual.getMonth() - 1));
    return fechaActual;
  }
}
