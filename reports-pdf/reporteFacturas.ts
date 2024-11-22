import type { TDocumentDefinitions } from 'pdfmake';
import { DateFormatter } from 'src/helpers';
import { formatCurrency } from 'src/helpers/formatCurrency';
import { FacturaInterface } from 'src/interface/factura.interface';
import { GetLocalDate } from 'src/utility/getLocalDate';
import { sharedStyles } from './sharedStyles';
import { formatDateRangeWithDifference } from 'src/helpers/dateUtils';
import { generarEncabezado } from './generateHeader ';
import { generateFooter } from './generateFooter';

// Estilos mejorados


// Función para generar el PDF
export const reporteFacturas = (
  facturas: FacturaInterface[],
  startDate?: string,
  endDate?: string
): TDocumentDefinitions => {
  const totalFacturas = facturas.length;
  const totalMonto = facturas.reduce((sum, factura) => sum + Number(factura.total), 0);


const rangoFormateado = formatDateRangeWithDifference(new Date(startDate), new Date(endDate));



  // Filas de las facturas
  const facturasRows = facturas.flatMap((factura) => {
    const detallesRows = factura.detallesFacturas.map((detalle) => [
      { text: `${detalle.producto.codigo} ${detalle.producto.nombre} | ${detalle.producto.categoria.nombre}`, style: 'tableContent', alignment: 'left' },
      { text: `x${detalle.cantidad}`, style: 'tableContent', alignment: 'center' },
      { text: formatCurrency(detalle.importe.toString()), style: 'tableContent', alignment: 'right' },
    ]);

    return [
      [
        {
          text: `Factura: ${factura.codigo}`,
          colSpan: 3,
          style: 'tableContent',
          fillColor: '#e8f5e9', // Fondo verde claro
        },
        {},
        {},
      ],
      [
        {
          text: `Fecha: ${DateFormatter.getDDMMYYYY(factura.createdAt)} | Estado: ${factura.estado}`,
          colSpan: 3,
          style: 'tableContent',
          fillColor: '#f1f8e9', // Fondo amarillo claro
        },
        {},
        {},
      ],
      ...detallesRows,
      [
        { text: '', colSpan: 2 },
        {},
        { text: `Subtotal: ${formatCurrency(factura.subtotal.toString())}`, style: 'tableTotal' },
      ],
      [
        { text: '', colSpan: 2 },
        {},
        { text: `Total: ${formatCurrency(factura.total.toString())}`, style: 'tableTotal' },
      ],
      [{ text: '', colSpan: 3 }, {}, {}],
    ];
  });

  // Definición del documento PDF
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [20, 40, 20, 40],
    styles: sharedStyles,
    content: [
      // Encabezado principal
      generarEncabezado(facturas[0].empresa.nombre, 'Reporte de Movimientos de Entrada y Salida', rangoFormateado),
      
      // Resumen General
      {
        style: 'borderedBox',
        table: {
          widths: ['50%', '50%'],
          body: [
            [
              { text: 'Total de Facturas:', style: 'summaryTitle' },
              { text: `${totalFacturas}`, style: 'summaryValue' },
            ],
            [
              { text: 'Monto Total:', style: 'summaryTitle' },
              { text: `${formatCurrency(totalMonto.toString())}`, style: 'summaryValue' },
            ],
          ],
        },
        layout: 'noBorders',
      },
      // Tabla de facturas
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              { text: 'Detalles de Factura', style: 'tableHeader' },
              { text: 'Cantidad de producto', style: 'tableHeader' },
              { text: 'Importe', style: 'tableHeader' },
            ],
            ...facturasRows,
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? '#f7f7f7' : null), // Alternar colores
          hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 1.5 : 0.5),
          vLineWidth: () => 0,
          hLineColor: () => '#cccccc',
        },
      },
    ],
    footer: generateFooter(), // Usa el pie de página reutilizable
      
  };

  return docDefinition;
};
