import { GetLocalDate } from 'src/utility/getLocalDate';

/**
 * Genera un pie de página reutilizable para documentos PDF.
 * @returns Una función para el pie de página de PDFMake.
 */
export const generateFooter = () => {
  return (currentPage: number, pageCount: number) => ({
    margin: [40, 10, 40, 10], // Márgenes ajustados
    columns: [
      {
        text: `${GetLocalDate().toLocaleDateString('es-ES', {
          weekday: 'long',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })} a las ${GetLocalDate().toLocaleTimeString('es-ES', {
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
  });
};
