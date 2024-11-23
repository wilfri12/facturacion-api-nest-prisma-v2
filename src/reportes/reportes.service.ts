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
    console.log('Se ejecuto el service de comprar ventas diarias:', new Date(GetLocalDate().getTime()));
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

  // // Servicio que obtiene productos sin stock obtenerProductosSinStock
  // async obtenerProductosSinStock(page: number = 1, limit: number = 10) {
  //   const validatedPage = Math.max(1, page);
  //   const validatedLimit = Math.max(1, limit);

  //   try {
  //     const [productos, totalRecords] = await Promise.all([
  //       this.prisma.producto.findMany({
  //         where: { stock: 0 },
  //         select: {
  //           codigo: true,
  //           nombre: true,
  //           stock: true,
  //           categoria: { select: { nombre: true } },
  //           subCategoria: { select: { nombre: true } },
  //         },
  //         skip: (validatedPage - 1) * validatedLimit,
  //         take: validatedLimit,
  //       }),
  //       this.prisma.producto.count({ where: { stock: 0 } })
  //     ]);

  //     const totalPages = Math.max(1, Math.ceil(totalRecords / validatedLimit));
  //     const hasNext = validatedPage < totalPages;

  //     return {
  //       success: true,
  //       data: {
  //         productos,
  //         totalRecords,
  //         limit: validatedLimit,
  //         currentPage: validatedPage,
  //         totalPages,
  //         hasNext,
  //       },
  //       message: 'Consulta satisfactoria',
  //     };
  //   } catch (error) {
  //     throw new Error(`Error al obtener productos sin stock: ${error.message}`);
  //   }
  // }

  // // Servicio que obtiene productos con bajo stock 
  // async obtenerProductosBajoStock(params: { umbral: number, page: number, limit: number }) {
  //   const { umbral = 10, page = 1, limit = 10 } = params;
  //   const validatedPage = Math.max(1, page);
  //   const validatedLimit = Math.max(1, limit);
  //   const validatedUmbral = Math.max(1, umbral);

  //   console.log('Bajo stock', params);


  //   try {
  //     const [productos, totalRecords] = await Promise.all([
  //       this.prisma.producto.findMany({
  //         where: { stock: { lt: validatedUmbral, gt: 0 } },
  //         select: {
  //           codigo: true,
  //           nombre: true,
  //           stock: true,
  //           categoria: { select: { nombre: true } },
  //           subCategoria: { select: { nombre: true } },
  //         },
  //         skip: (validatedPage - 1) * validatedLimit,
  //         take: validatedLimit,
  //       }),
  //       this.prisma.producto.count({ where: { stock: { lt: validatedUmbral, gt: 0 } } }),
  //     ]);

  //     const totalPages = Math.max(1, Math.ceil(totalRecords / validatedLimit));
  //     const hasNext = validatedPage < totalPages;

  //     return {
  //       success: true,
  //       data: {
  //         productos,
  //         totalRecords,
  //         limit: validatedLimit,
  //         currentPage: validatedPage,
  //         totalPages,
  //         hasNext,
  //       },
  //       message: 'Consulta satisfactoria',
  //     };
  //   } catch (error) {
  //     throw new Error(`Error al obtener productos con bajo stock: ${error.message}`);
  //   }
  // }


  // // Servicio que calcula el valor total del inventario
  // async calcularValorInventarioTotal() {
  //   try {

  //     const productosInventory = await this.prisma.producto.findMany({
  //       where: { stock: { gt: 0 } },
  //       select: {
  //         precio: true,
  //         stock: true,
  //       },
  //     });

  //     const valorTotal = productosInventory.reduce((acc, producto) => acc + Number(producto.precio) * producto.stock, 0);

  //     const productos = await this.prisma.producto.findMany({
  //       where: { stock: { gt: 0 } },
  //       select: {
  //         precio: true,
  //         stock: true,
  //         categoria: { select: { nombre: true } },
  //       },
  //     });

  //     const valorPorCategoria = productos.reduce((acc, producto) => {
  //       const categoria = producto.categoria.nombre;
  //       const valor = Number(producto.precio) * producto.stock;
  //       acc[categoria] = (acc[categoria] || 0) + valor;
  //       return acc;
  //     }, {} as Record<string, number>);

  //     return {
  //       success: true,
  //       data: {
  //         valorTotal,
  //         valorPorCategoria,
  //       },
  //       message: 'Consulta satisfactoria',
  //     };
  //   } catch (error) {
  //     throw new Error(`Error al obtener el valor de inventario por categoría: ${error.message}`);
  //   }
  // }

  // Servicio que calcula utilidad bruta en un periodo
  async calcularDatosDashboard(periodoInicio: Date, periodoFin: Date): Promise<{ success: boolean; data: DashboardData }> {
    console.log("Iniciando cálculo del dashboard");
    
    const startDateTime = periodoInicio ? new Date(new Date(periodoInicio).setUTCHours(0, 0, 0, 0)) : undefined;
    const endDateTime = periodoFin ? new Date(new Date(periodoFin).setUTCHours(23, 59, 59, 999)) : undefined;
    console.log("----------------------------------------------------");
    console.log("Periodo de análisis:", { startDateTime, endDateTime });
    console.log("----------------------------------------------------");
    
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
    console.log("Facturas obtenidas:", facturas.length);
  
    // Ventas totales calculadas desde facturas
    const ventasTotales = facturas.reduce((acc, factura) => acc + Number(factura.total), 0);
    console.log("Ventas totales calculadas:", ventasTotales);
  
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
    console.log("Movimientos de inventario obtenidos:", movimientos.length);
  
    // Procesar movimientos
    for (const movimiento of movimientos) {
      console.log("Procesando movimiento:", movimiento);
  
      const lote = await this.prisma.loteProducto.findFirst({
        where: { productoId: movimiento.productoId, estado: 'ACTIVO', delete: false, },
        orderBy: { fechaEntrada: 'asc' },
      });
  
      if (!lote) {
        console.warn("Lote no encontrado para producto:", movimiento.productoId);
        continue;
      }
  
      const costoUnitario = Number(lote.precioCompra);
      console.log("Costo unitario calculado:", costoUnitario);
  
      // Actualizar costos y métricas de productos vendidos
      costoTotal += costoUnitario * movimiento.cantidad;
      console.log("Costo total actualizado:", costoTotal);
  
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
  
      console.log("Producto vendido actualizado:", productosVendidos[movimiento.productoId]);
  
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
      console.log("Tendencias actualizadas para mes:", mes, tendencias[mes]);
    });
  
    // KPIs
    const gananciaBruta = ventasTotales - costoTotal;
    console.log("Ganancia bruta calculada:", gananciaBruta);
  
    const margenBruto: number = ventasTotales ? Number(((gananciaBruta / ventasTotales) * 100).toFixed(2)) : 0;
    const ticketPromedio: number = facturas ? Number((ventasTotales / facturas.length).toFixed(2)) : 0;
    console.log("KPIs calculados:", { margenBruto, ticketPromedio });
  
    const productosBajoStock = await this.prisma.loteProducto.findMany({
      where: { cantidadRestante: { lte: 10 }, delete: false, },
      include: { producto: true },
    });
    console.log("Productos bajo stock encontrados:", productosBajoStock.length);
  
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
