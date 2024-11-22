import type { Content } from 'pdfmake';

/**
 * Genera el encabezado para los reportes.
 * @param empresaNombre Nombre de la empresa.
 * @param reporteSubTitulo Título del reporte.
 * @param startDate Fecha de inicio del rango.
 * @param endDate Fecha de fin del rango.
 * @returns Encabezado como un contenido reutilizable para PDFMake.
 */
export const generarEncabezado = (
  empresaNombre: string,
  reporteSubTitulo: string,
  fechaFormateada: string
): Content => {
  return {
    stack: [
      { text: empresaNombre, style: 'header' },
      { text: reporteSubTitulo, style: 'subHeader' },
      {
        text: fechaFormateada,
        style: 'subHeader',
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 555,
            y2: 0,
            lineWidth: 1.5,
            color: '#0046a4',
          },
        ],
        margin: [0, 10, 0, 20],
      },
    ],
  };
};
