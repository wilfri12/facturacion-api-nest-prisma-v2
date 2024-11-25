import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { GetLocalDate } from 'src/utility/getLocalDate';
import { Producto } from '@prisma/client';

interface ProductoVendido {
  nombre: string;
  cantidadVendida: number;
  ingresosGenerados: number;
  costoTotal: number;
}

interface Categoria {
  nombre: string;
  ventasTotales: number;
  cantidadVendida: number;
}

interface Tendencia {
  mes: string;
  ventas: number;
  compras: number;
  gananciaBruta: number;
}

interface ProductoBajoStock {
  nombre: string;
  stockRestante: number;
}

interface KPIs {
  ventasTotales: number;
  costoTotal: number;
  gananciaBruta: number;
  margenBruto: number;
  ticketPromedio: number;
  facturasEmitidas: number;
}

export interface DashboardData {
  KPIs: KPIs;
  productosVendidos: ProductoVendido[];
  productoMasVendido: ProductoVendido | null;
  categorias: Categoria[];
  productosBajoStock: ProductoBajoStock[];
  tendencias: Tendencia[];
}


@Injectable()
export class ReportesService {
  constructor(private prisma: PrismaService) { }

  // Servicio que compara ventas diarias de hoy y ayer
  async compararVentasDiarias(): Promise<ApiResponse<{ totalVentasHoy: number; cantidadVentasHoy: number; totalAyer: number; cantidadAyer: number; variacion: string }>> {
    const hoy = GetLocalDate();
    hoy.setHours(0, 0, 0, 0);
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);

    const ventasHoy = await this.prisma.factura.aggregate({
      _sum: { total: true },
      _count: { id: true },
      where: { createdAt: { gte: hoy }, delete: false, },
    });

    const ventasAyer = await this.prisma.factura.aggregate({
      _sum: { total: true },
      _count: { id: true },
      where: { createdAt: { gte: ayer, lt: hoy }, delete: false, },
    });

    const variacion = this.calcularVariacion(Number(ventasHoy._sum.total), Number(ventasAyer._sum.total));

    return {
      success: true,
      data: {
        totalVentasHoy: Number(ventasHoy._sum.total) || 0,
        cantidadVentasHoy: ventasHoy._count.id || 0,
        totalAyer: Number(ventasAyer._sum.total) || 0,
        cantidadAyer: ventasAyer._count.id || 0,
        variacion: `${Number(variacion.toFixed(2))}%`
      }
    };
  }

  // Servicio que calcula utilidad bruta en un periodo
  async calcularDatosDashboard(periodoInicio: Date, periodoFin: Date): Promise<{ success: boolean; data: DashboardData }> {
    
    const startDateTime = periodoInicio ? new Date(new Date(periodoInicio).setUTCHours(0, 0, 0, 0)) : undefined;
    const endDateTime = periodoFin ? new Date(new Date(periodoFin).setUTCHours(23, 59, 59, 999)) : undefined;
    
    // Obtener facturas
    const facturas = await this.prisma.factura.findMany({
      where: {
        AND: [
          startDateTime ? { createdAt: { gte: startDateTime } } : {},
          endDateTime ? { createdAt: { lte: endDateTime } } : {},
        ],
        delete: false,
      },
      include: {
        detallesFacturas: {
          include: {
            producto: { include: { categoria: true } },
          },
        },
      },
    });
  
    // Ventas totales calculadas desde facturas
    const ventasTotales = facturas.reduce((acc, factura) => acc + Number(factura.total), 0);
  
    let costoTotal = 0;
    const productosVendidos: Record<number, ProductoVendido> = {};
    const categorias: Record<string, Categoria> = {};
    const tendencias: Record<string, { ventas: number; compras: number; gananciaBruta: number }> = {};
  
    // Obtener detalles de facturas relacionados con movimientos de inventario
    const movimientos = await this.prisma.movimientoInventario.findMany({
      where: {
        AND: [
          { tipo: 'SALIDA' }, // Solo movimientos de salida
          { createdAt: { gte: startDateTime, lte: endDateTime } },
        ],
        delete: false,
      },
      include: {
        producto: { include: { categoria: true } },
      },
    });
  
    // Procesar movimientos
    for (const movimiento of movimientos) {
  
      const lote = await this.prisma.loteProducto.findFirst({
        where: { productoId: movimiento.productoId, estado: 'ACTIVO', delete: false, },
        orderBy: { fechaEntrada: 'asc' },
      });
  
      if (!lote) {
        continue;
      }
  
      const costoUnitario = Number(lote.precioCompra);
  
      // Actualizar costos y métricas de productos vendidos
      costoTotal += costoUnitario * movimiento.cantidad;
  
      if (!productosVendidos[movimiento.productoId]) {
        productosVendidos[movimiento.productoId] = {
          nombre: movimiento.producto.nombre,
          cantidadVendida: 0,
          ingresosGenerados: 0,
          costoTotal: 0,
        };
      }
  
      productosVendidos[movimiento.productoId].cantidadVendida += movimiento.cantidad;
      productosVendidos[movimiento.productoId].ingresosGenerados += movimiento.cantidad * Number(movimiento.producto.precio);
      productosVendidos[movimiento.productoId].costoTotal += costoUnitario * movimiento.cantidad;
  
      const categoriaNombre = movimiento.producto.categoria?.nombre || "Sin Categoría";
      if (!categorias[categoriaNombre]) {
        categorias[categoriaNombre] = {
          nombre: categoriaNombre,
          ventasTotales: 0,
          cantidadVendida: 0,
        };
      }
  
      categorias[categoriaNombre].ventasTotales += movimiento.cantidad * Number(movimiento.producto.precio);
      categorias[categoriaNombre].cantidadVendida += movimiento.cantidad;
  
      // Tendencias
      const mes = new Date(movimiento.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!tendencias[mes]) {
        tendencias[mes] = { ventas: 0, compras: 0, gananciaBruta: 0 };
      }
      tendencias[mes].ventas += movimiento.cantidad * Number(movimiento.producto.precio);
    }
  
    // Ajustar tendencias con compras
    const movimientosEntradas = await this.prisma.movimientoInventario.findMany({
      where: {
        AND: [
          { tipo: 'ENTRADA' }, // Solo movimientos de entrada
          { createdAt: { gte: startDateTime, lte: endDateTime } },
        ],
        delete: false,
      },
    });
  
    for (const entrada of movimientosEntradas) {
      const mes = new Date(entrada.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!tendencias[mes]) {
        tendencias[mes] = { ventas: 0, compras: 0, gananciaBruta: 0 };
      }
      const costoUnitario = Number(entrada.precioCompra);
      tendencias[mes].compras += entrada.cantidad * costoUnitario;
    }
  
    // Calcular ganancia bruta en tendencias
    Object.keys(tendencias).forEach(mes => {
      tendencias[mes].gananciaBruta = tendencias[mes].ventas - tendencias[mes].compras;
    });
  
    // KPIs
    const gananciaBruta = ventasTotales - costoTotal;
  
    const margenBruto: number = ventasTotales ? Number(((gananciaBruta / ventasTotales) * 100).toFixed(2)) : 0;
    const ticketPromedio: number = facturas ? Number((ventasTotales / facturas.length).toFixed(2)) : 0;
  
    const productosBajoStock = await this.prisma.loteProducto.findMany({
      where: { cantidadRestante: { lte: 10 }, delete: false, },
      include: { producto: true },
    });
  
    return {
      success: true,
      data: {
        KPIs: {
          ventasTotales,
          costoTotal,
          gananciaBruta,
          margenBruto,
          ticketPromedio,
          facturasEmitidas: facturas.length,
        },
        productosVendidos: Object.values(productosVendidos),
        productoMasVendido: Object.values(productosVendidos).sort((a, b) => b.cantidadVendida - a.cantidadVendida)[0] || null,
        categorias: Object.values(categorias),
        productosBajoStock: productosBajoStock.map(p => ({
          nombre: p.producto.nombre,
          stockRestante: Math.max(p.cantidadRestante, 0),
        })),
        tendencias: Object.entries(tendencias).map(([mes, datos]) => ({
          mes,
          ...datos,
        })),
      },
    };
  }

  // Función auxiliar para calcular variación porcentual
  private calcularVariacion(totalHoy: number, totalAyer: number): number {
    if (totalAyer === 0) return totalHoy > 0 ? 100 : 0;
    return ((totalHoy - totalAyer) / totalAyer) * 100;
  }

 
}
