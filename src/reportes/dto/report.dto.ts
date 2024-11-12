// report.dto.ts
export class ReporteVentasComprasDto {
    totalVentas: number;
    totalCompras: number;
    ganancia: number;
  }
  
  export class VentasDiariasDto {
    fecha: Date;
    totalVentas: number;
  }
  
  export class TopProductosVendidosDto {
    productoId: number;
    totalMonto: number;
    totalCantidad: number;
  }
  