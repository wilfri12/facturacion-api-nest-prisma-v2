import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake';
import { FacturaInterface } from 'src/interface/factura.interface';

const styles: StyleDictionary = {
    header: {
        fontSize: 12,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 5],
    },
    details: {
        fontSize: 8,
        margin: [0, 3, 0, 3],
    },
    tableHeader: {
        bold: true,
        fontSize: 8,
        fillColor: '#eeeeee',
        alignment: 'center',
    },
    tableContent: {
        fontSize: 8,
        margin: [0, 3, 0, 3],
    },
    total: {
        fontSize: 10,
        bold: true,
        alignment: 'right',
        margin: [0, 3, 0, 3],
    },
    footer: {
        fontSize: 7,
        alignment: 'center',
        margin: [0, 10, 0, 0],
    },
};

export const facturaReport = (factura: FacturaInterface): TDocumentDefinitions => {
    // Prepara los detalles de los productos
    const productRows = factura.detallesFacturas.map(detalle => {
        const producto = detalle.producto;
        return [
            { text: producto.nombre, style: 'tableContent', alignment: 'left' },
            { text: `x${detalle.cantidad}`, style: 'tableContent', alignment: 'center' },
            { text: `RD$${detalle.importe.toFixed(2)}`, style: 'tableContent', alignment: 'right' },
        ];
    });

    // Definición del documento
    const docDefinition: TDocumentDefinitions = {
        pageSize: { width: 200, height: 'auto' },  // Configuración para impresoras pequeñas
        pageMargins: [10, 10, 10, 10],  // Márgenes pequeños
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
                text: `Factura: ${factura.codigo}`,
                style: 'details',
            },
            {
                text: `Fecha: ${new Date(factura.createdAt).toLocaleDateString('es-ES')}`,
                style: 'details',
            },
            {
                text: `Método de pago: ${factura.metodoPago}`,
                style: 'details',
            },
            {
                text: `Cliente: ${factura.clienteNombre || 'Cliente no registrado'}`,
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
                layout: 'lightHorizontalLines',  // Líneas simples
            },
            {
                text: `Subtotal: RD$${factura.subtotal.toFixed(2)}`,
                style: 'total',
            },
            {
                ...(factura.itebisTotal.toNumber() !== 0
                    ? {
                        text: `ITBIS: RD$${factura.itebisTotal.toFixed(2)}`,
                        style: 'total',
                    }
                    : {}),
            }
            ,
            {
                text: `Total: RD$${factura.total.toFixed(2)}`,
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
