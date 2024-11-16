import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake';
import { DateFormatter } from 'src/helpers';
import { formatCurrency } from 'src/helpers/formatCurrency';
import { FacturaInterface } from 'src/interface/factura.interface';

// Estilos mejorados
const styles: StyleDictionary = {
  header: {
    fontSize: 24,
    bold: true,
    alignment: 'center',
    color: '#0046a4',
    decoration: 'underline',
  },
  subHeader: {
    fontSize: 14,
    bold: true,
    alignment: 'center',
    color: '#333333',
    margin: [0, 5, 0, 10],
  },
  summaryTitle: {
    fontSize: 12,
    bold: true,
    color: '#444444',
  },
  summaryValue: {
    fontSize: 12,
    bold: true,
    color: '#0046a4',
    alignment: 'right',
  },
  tableHeader: {
    bold: true,
    fontSize: 10,
    fillColor: '#e3f2fd',
    color: '#0046a4',
    alignment: 'center',
  },
  tableContent: {
    fontSize: 9,
    color: '#333333',
  },
  tableTotal: {
    fontSize: 10,
    bold: true,
    color: '#0046a4',
    alignment: 'right',
  },
  footer: {
    fontSize: 9,
    color: '#666666',
  },
  
};

// Función para generar el PDF
export const reporteFacturas = (
  facturas: FacturaInterface[],
  startDate?: string,
  endDate?: string
): TDocumentDefinitions => {
  const totalFacturas = facturas.length;
  const totalMonto = facturas.reduce((sum, factura) => sum + Number(factura.total), 0);


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
    styles: styles,
    content: [
      // Encabezado principal
      {
        stack: [
          {
            text: `${facturas[0].empresa.nombre}`,
            style: 'header',
          },
          {
            text: 'Reporte Consolidado de Facturas',
            style: 'subHeader',
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 515,
                y2: 0,
                lineWidth: 1.5,
                color: '#0046a4',
              },
            ],
            margin: [0, 10, 0, 20],
          },
        ],
      },
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
    // Pie de página
    footer: (currentPage, pageCount) => ({
        margin: [40, 10, 40, 10], // Márgenes ajustados
        columns: [
          {
            text: `${new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })} a las ${new Date().toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}`,
            alignment: 'left',
            style: 'footer',
          },
          {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'right',
            style: 'footer',
          },
        ],
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            color: '#cccccc',
          },
        ],
      }),
      
  };

  return docDefinition;
};
