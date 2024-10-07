import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake';
import { FacturaInterface } from 'src/interface/factura.interface';

const styles: StyleDictionary = {
    header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
    },
    subheader: {
        fontSize: 12,
        alignment: 'center',
        margin: [0, 0, 0, 20],
    },
    details: {
        fontSize: 10,
        margin: [0, 5, 0, 5],
    },
    tableHeader: {
        bold: true,
        fontSize: 10,
        fillColor: '#eeeeee',
        alignment: 'center',
    },
    tableContent: {
        fontSize: 10,
        margin: [0, 5, 0, 5],
    },
    total: {
        fontSize: 12,
        bold: true,
        alignment: 'right',
        margin: [0, 5, 0, 5],
    },
    footer: {
        fontSize: 8,
        alignment: 'center',
        margin: [0, 20, 0, 0],
    },
};

export const facturaReport = (factura: FacturaInterface): TDocumentDefinitions => {
    console.log('Generating report for factura:', factura);

    // Prepara los detalles de los productos
    const productRows = factura.detallesFacturas.map(detalle => {
        const producto = detalle.producto;
        return [
            { text: `${producto.nombre}\n${detalle.cantidad} x RD$${detalle.importe.toFixed(2)}`, style: 'tableContent', alignment: 'left' },
            { text: `RD$${88}`, style: 'tableContent', alignment: 'center' },
            { text: `RD$${(detalle.cantidad * parseFloat(detalle.importe.toString()))}`, style: 'tableContent', alignment: 'right' },
        ];
    });

    // Definición del documento
    const docDefinition: TDocumentDefinitions = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        styles: styles,
        content: [
            {
                text: 'Kamila Shop',
                style: 'header',
            },
            {
                text: 'FACTURA DE VENTA',
                style: 'subheader',
            },
            {
                columns: [
                    { text: `Factura: ${factura.codigo}`, style: 'details' },
                ],
            },
            {
                columns: [
                    { text: `Método de pago: ${factura.metodoPago}`, style: 'details' },
                    { text: `Usuario: ${factura.usuario}`, style: 'details', alignment: 'right' },
                ],
            },
            {
                columns: [
                    { text: `Fecha: ${new Date(factura.createdAt).toLocaleDateString('es-ES')}`, style: 'details' },
                    { text: `Cliente: ${factura.clienteNombre}`, style: 'details', alignment: 'right' },
                ],
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 'auto', 'auto'],
                    body: [
                        [{ text: 'Descripción', style: 'tableHeader' }, { text: 'ITEBIS', style: 'tableHeader' }, { text: 'Importe', style: 'tableHeader' }],
                        ...productRows,
                    ],
                },
                layout: 'lightHorizontalLines',
            },
            {
                text: `Subtotal: RD$${factura.subtotal.toFixed(2)}`,
                style: 'total',
            },
            {
                text: `ITBIS: RD$${factura.itebisTotal.toFixed(2)}`,
                style: 'total',
            },
            {
                text: `Monto Total: RD$${factura.total.toFixed(2)}`,
                style: 'total',
            },
        ],
        footer: {
            text: 'Este documento es una constancia de venta.',
            style: 'footer',
        },
    };

    return docDefinition;
};
