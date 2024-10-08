import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake';
import { DateFormatter } from 'src/helpers';
import { formatCurrency } from 'src/helpers/formatCurrency';
import { FacturaInterface } from 'src/interface/factura.interface';

const styles: StyleDictionary = {
    header: {
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
    },
    details: {
        fontSize: 9,
        margin: [0, 2, 0, 2],
    },
    tableHeader: {
        bold: true,
        fontSize: 9,
        fillColor: '#f3f3f3',
        alignment: 'center',
        margin: [0, 5, 0, 5],
    },
    tableContent: {
        fontSize: 9,
        margin: [0, 4, 0, 4],
    },
    total: {
        fontSize: 11,
        bold: true,
        alignment: 'right',
        margin: [0, 10, 0, 10],
    },
    footer: {
        fontSize: 8,
        alignment: 'center',
        margin: [0, 20, 0, 0],
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
        pageSize: 'A4',
        pageMargins: [20, 20, 20, 30],  // Márgenes ajustados
        styles: styles,
        content: [
            {
                text: 'Kamila Shop',
                style: 'header',
            },
            {
                text: 'FACTURA DE VENTA',
                style: 'header',
            },
            {
                text: `Cliente: ${factura.clienteNombre || 'Cliente no registrado'}`,
                style: 'details',
            },
            {
                text: `Factura: ${factura.codigo}`,
                style: 'details',
            },
            {
                text: `Método de pago: ${factura.metodoPago}`,
                style: 'details',
            },
            {
                text: `Fecha: ${DateFormatter.getDDMMYYYY(factura.createdAt)}`,
                style: 'details',
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto', 'auto'],
                    body: [
                        [{ text: 'Descripción', style: 'tableHeader' }, { text: 'Cant.', style: 'tableHeader' }, { text: 'Total', style: 'tableHeader' }],
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
        ],
        footer: {
            text: 'Gracias por su compra.',
            style: 'footer',
        },
    };

    return docDefinition;
};
