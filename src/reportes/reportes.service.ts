import { Injectable } from '@nestjs/common';
import {  ReporteVentasComprasDto, VentasDiariasDto } from './dto/report.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { PrismaService } from 'src/prisma.service';
import { Producto } from '@prisma/client';

@Injectable()
export class ReportesService {

  constructor(private readonly prisma: PrismaService) { }

  // const startDateTime = fechaInicio ? new Date(new Date(fechaInicio).setUTCHours(0, 0, 0, 0)) : undefined;
  // const endDateTime = fechaFin ? new Date(new Date(fechaFin).setUTCHours(23, 59, 59, 999)) : undefined;
  // where: { tipo: 'VENTA',
  //   AND: [
  //     startDateTime ? { fecha: { gte: startDateTime } } : {},
  //     endDateTime ? { fecha: { lte: endDateTime } } : {},
  //   ] 
  //    },


  async getVentasComprasPeriodo(
    fechaInicio: Date,
    fechaFin: Date
  ): Promise<{
    success: boolean;
    message: string;
    data?: ReporteVentasComprasDto;
  }> {
    if (!(fechaInicio instanceof Date && !isNaN(fechaInicio.valueOf())) ||
      !(fechaFin instanceof Date && !isNaN(fechaFin.valueOf()))) {
      return {
        success: false,
        message: 'Las fechas de inicio y fin son obligatorias y deben ser válidas.',
      };
    }

    const startDateTime = fechaInicio ? new Date(new Date(fechaInicio).setUTCHours(0, 0, 0, 0)) : undefined;
    const endDateTime = fechaFin ? new Date(new Date(fechaFin).setUTCHours(23, 59, 59, 999)) : undefined;

    try {
      // Total de ventas y compras en el período
      const ventas = await this.prisma.transaccion.aggregate({
        _sum: { monto: true },
        where: {
          tipo: 'VENTA',
          AND: [
            startDateTime ? { fecha: { gte: startDateTime } } : {},
            endDateTime ? { fecha: { lte: endDateTime } } : {},
          ]
        },
      });

      const compras = await this.prisma.transaccion.aggregate({
        _sum: { monto: true },
        where: {
          tipo: 'COMPRA',
          AND: [
            startDateTime ? { fecha: { gte: startDateTime } } : {},
            endDateTime ? { fecha: { lte: endDateTime } } : {},
          ]
        },
      });

      const totalVentas = ventas._sum.monto || 0;
      const totalCompras = compras._sum.monto || 0;
      const ganancia = totalVentas - totalCompras;

      return {
        success: true,
        message: 'Consulta realizada con éxito',
        data: {
          totalVentas,
          totalCompras,
          ganancia,
        },
      };
    } catch (error) {
      console.error('Error al obtener ventas y compras:', error);
      return {
        success: false,
        message: 'Error en la consulta a la base de datos.',
      };
    }
  }


   // 2. Ventas Diarias/Mensuales
   async getVentasDiarias(fechaInicio: Date, fechaFin: Date): Promise<VentasDiariasDto[]> {


    const startDateTime = fechaInicio ? new Date(new Date(fechaInicio).setUTCHours(0, 0, 0, 0)) : undefined;
    const endDateTime = fechaFin ? new Date(new Date(fechaFin).setUTCHours(23, 59, 59, 999)) : undefined;
    
    const ventasDiarias = await this.prisma.transaccion.groupBy({
      by: ['fecha'],
      _sum: { monto: true },
      where: {
        tipo: 'VENTA',
        AND: [
          startDateTime ? { fecha: { gte: startDateTime } } : {},
          endDateTime ? { fecha: { lte: endDateTime } } : {},
        ]
      },
      orderBy: { fecha: 'asc' },
    });

    return ventasDiarias.map(v => ({
      fecha: v.fecha,
      totalVentas: v._sum.monto || 0,
    }));
  }

  // // 3. Top Productos Vendidos
  // async getTopProductosVendidos(fechaInicio: Date, fechaFin: Date, limit: number): Promise<Producto[]> {
  //   const productos = await this.prisma.transaccion.groupBy({
  //     by: ['productoId'],
  //     _sum: { monto: true, cantidad: true },
  //     where: {
  //       tipo: 'VENTA',
  //       AND: [
  //         startDateTime ? { fecha: { gte: startDateTime } } : {},
  //         endDateTime ? { fecha: { lte: endDateTime } } : {},
  //       ]
  //     },
  //     orderBy: { _sum: { monto: 'desc' } },
  //     take: limit,
  //   });

  //   return productos.map(p => ({
  //     productoId: p.productoId,
  //     totalMonto: p._sum.monto || 0,
  //     totalCantidad: p._sum.cantidad || 0,
  //   }));
  // }











}
