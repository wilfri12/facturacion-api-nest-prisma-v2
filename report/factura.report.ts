import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake';
import { DateFormatter } from 'src/helpers';
import { formatCurrency } from 'src/helpers/formatCurrency';
import { FacturaInterface } from 'src/interface/factura.interface';

const styles: StyleDictionary = {
    header: {
        fontSize: 12,  // Tamaño reducido para adaptarse a 80 mm
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 12],
    },
    details: {
        fontSize: 9,
        margin: [0, 2, 0, 4],
        alignment: 'left',  // Alineado a la izquierda
    },
    tableHeader: {
        bold: true,
        fontSize: 10,  // Tamaño reducido
        fillColor: '#f3f3f3',
        alignment: 'start',
        margin: [0, 2, 0, 2],
    },
    tableContent: {
        fontSize: 10,  // Tamaño reducido
        margin: [0, 2, 0, 2],
    },
    total: {
        fontSize: 10,  // Tamaño reducido
        bold: true,
        alignment: 'right',
        margin: [0, 5, 0, 5],
    },
    footer: {
        fontSize: 8,
        alignment: 'center',
        margin: [0, 18, 0, 10],  // Espacio en el pie de página
    },
};


export const facturaReport = (factura: FacturaInterface): TDocumentDefinitions => {
    const productRows = factura.detallesFacturas.map(detalle => {
        const producto = detalle.producto;
        return [
            { text: producto.nombre, style: 'tableContent', alignment: 'left' },
            { text: `x${detalle.cantidad}`, style: 'tableContent', alignment: 'center' },
            { text: `${formatCurrency(detalle.importe.toString())} `, style: 'tableContent', alignment: 'right' },
        ];
    });

    const docDefinition: TDocumentDefinitions = {
        pageSize: { width: 203, height: 'auto' },
        pageMargins: [5, 8, 5, 20],  // Márgenes ajustados
        styles: styles,
        content: [
            {
                text: `${factura.empresa.nombre }`,
                style: 'header',
            },
            {
                text: 'FACTURA DE VENTA',
                style: 'header',
            },
            {
                text: `${factura.clienteNombre || 'Cliente no registrado'}`,
                style: 'details',
            },
            {
                text: `Factura: ${factura.codigo}`,
                style: 'details',
            },
            {
                text: `Pago: ${factura.metodoPago}`,
                style: 'details',
            },
            {
                text: `${DateFormatter.getDDMMYYYY(factura.createdAt)}`,
                style: 'details',
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto', 'auto'],
                    body: [
                        [{ text: 'Producto', style: 'tableHeader' }, { text: 'Cant.', style: 'tableHeader' }, { text: 'Impor.', style: 'tableHeader' }],
                        ...productRows,
                    ],
                },
                layout: 'noBorders',  // Sin bordes para evitar problemas de impresión
            },
            {
                text: `Subtotal: ${formatCurrency(factura.subtotal.toString())}`,
                style: 'total',
            },
            {
                text: `Total: ${formatCurrency(factura.total.toString())}`,
                style: 'total',
            },
            {
                text: 'Gracias por su compra.',
                style: 'footer',
            },
        ],

       
    };

    return docDefinition;
};
