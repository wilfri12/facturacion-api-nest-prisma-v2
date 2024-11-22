import TDocumentDefinitions from 'pdfmake';
import { formatDateRangeWithDifference } from 'src/helpers/dateUtils';
import { formatCurrency } from 'src/helpers/formatCurrency';
import { sharedStyles } from './sharedStyles';
import { generarEncabezado } from './generateHeader ';
import { generateFooter } from './generateFooter';
// Tipo para un movimiento de inventario
interface Movimiento {
  id: number;
  productoId: number;
  tipo: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  descripcion: string;
  precioVenta?: number; // Solo para SALIDA
  precioCompra?: number; // Solo para ENTRADA
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  producto: {
    codigo: string;
    nombre: string;
  };
  usuario: {
    nombreUsuario: string;
  };
  empresa: {
    nombre: string;
  };
}

// Tipo para la estructura de datos del reporte
interface ReporteMovimientosData {
  movimientos: Movimiento[];
  totalRecords: number;
}

// Tipo para los parámetros de entrada del reporte
interface ReporteMovimientos {
  data: ReporteMovimientosData;
  startDate?: string; // ISO Date
  endDate?: string; // ISO Date
}

// Función de la definición del documento PDF
export const reporteMovimientoEntradaSalida = (
  reporteMovimientos: any
): TDocumentDefinitions => {
  const { data: { movimientos, totalRecords }, startDate, endDate } = reporteMovimientos;

  const rangoFormateado = formatDateRangeWithDifference(
    new Date(startDate || Date.now()),
    new Date(endDate || Date.now())
  );

  // Extraer nombre de la empresa del primer movimiento
  const empresaNombre = movimientos.length > 0 ? movimientos[0].empresa.nombre : 'Empresa Desconocida';

  // Resumen General
  const totalEntradas = movimientos
    .filter(mov => mov.tipo === 'ENTRADA')
    .reduce((sum, mov) => sum + mov.cantidad, 0);

  const totalSalidas = movimientos
    .filter(mov => mov.tipo === 'SALIDA')
    .reduce((sum, mov) => sum + mov.cantidad, 0);

  const totalMontoEntradas = movimientos
    .filter(mov => mov.tipo === 'ENTRADA')
    .reduce((sum, mov) => sum + (mov.precioCompra || 0) * mov.cantidad, 0);

  const totalMontoSalidas = movimientos
    .filter(mov => mov.tipo === 'SALIDA')
    .reduce((sum, mov) => sum + (mov.precioVenta || 0) * mov.cantidad, 0);

  // Filas de la tabla
  const tableRows = movimientos.map(mov => [
    { text: mov.producto.codigo, style: 'tableContent' },
    { text: mov.producto.nombre, style: 'tableContent' },
    { text: mov.tipo, style: 'tableContent', alignment: 'center' },
    { text: mov.cantidad, style: 'tableContent', alignment: 'right' },
    {
      text:
        mov.tipo === 'ENTRADA'
          ? formatCurrency((mov.precioCompra || 0).toString())
          : formatCurrency((mov.precioVenta || 0).toString()),
      style: 'tableContent',
      alignment: 'right',
    },
    { text: mov.descripcion, style: 'tableContent' },
    { text: mov.usuario.nombreUsuario, style: 'tableContent' },
    { text: new Date(mov.createdAt).toLocaleDateString(), style: 'tableContent' },
  ]);

  // Definición del documento
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [20, 40, 20, 40],
    styles: sharedStyles,
    content: [
      // Encabezado
      generarEncabezado(
        empresaNombre,
        'Reporte de Movimientos de Entrada y Salida',
        rangoFormateado
      ),
      // Resumen General
      {
        style: 'borderedBox',
        table: {
          widths: ['50%', '50%'],
          body: [
            [
              { text: 'Total de Movimientos:', style: 'summaryTitle' },
              { text: `${totalRecords}`, style: 'summaryValue' },
            ],
            [
              { text: 'Total Entradas:', style: 'summaryTitle' },
              {
                text: `${totalEntradas} (${formatCurrency(totalMontoEntradas.toString())})`,
                style: 'summaryValue',
              },
            ],
            [
              { text: 'Total Salidas:', style: 'summaryTitle' },
              {
                text: `${totalSalidas} (${formatCurrency(totalMontoSalidas.toString())})`,
                style: 'summaryValue',
              },
            ],
          ],
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 20],
      },
      // Tabla de Movimientos
      {
        table: {
          headerRows: 1,
          widths: ['10%', '20%', '9%', '9%', '10%', '18%', '12%', '12%'],
          body: [
            [
              { text: 'Código', style: 'tableHeader' },
              { text: 'Producto', style: 'tableHeader' },
              { text: 'Tipo', style: 'tableHeader' },
              { text: 'Cantidad', style: 'tableHeader' },
              { text: 'Precio', style: 'tableHeader' },
              { text: 'Descripción', style: 'tableHeader' },
              { text: 'Usuario', style: 'tableHeader' },
              { text: 'Fecha', style: 'tableHeader' },
            ],
            ...tableRows,
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? '#f7f7f7' : null),
          hLineWidth: (i) => (i === 0 ? 1.5 : 0.5),
          vLineWidth: () => 0,
          hLineColor: () => '#cccccc',
        },
      },
    ],
    footer: generateFooter(), // Usa el pie de página reutilizable
  };

  return docDefinition;
};
