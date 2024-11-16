import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake';
import { DateFormatter } from 'src/helpers';
import { formatCurrency } from 'src/helpers/formatCurrency';
import { FacturaInterface } from 'src/interface/factura.interface';

const styles: StyleDictionary = {
    header: {
        fontSize: 12,  // Tamaño adecuado para impresoras térmicas
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 8],  // Margen ajustado
        color: '#000',  // Color más oscuro para impresión
    },
    subheader: {
        fontSize: 10,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 6], // Menos espacio
        color: '#000',
    },
    details: {
        fontSize: 9,
        margin: [0, 2, 0, 4],
        alignment: 'left',  // Alineado a la izquierda
    },
    item: {
        fontSize: 9,  // Fuente pequeña para el contenido
        margin: [0, 4, 0, 4],
        alignment: 'justify',  // Para productos y precios
    },
    total: {
        fontSize: 10,
        bold: true,
        alignment: 'right',
        margin: [0, 4, 0, 4],  // Margen menor
    },
    line: {
        margin: [0, 6, 0, 6],
        alignment: 'center',
        color: '#000',
    },
    footer: {
        fontSize: 8,
        alignment: 'center',
        margin: [0, 10, 0, 0],  // Espacio en el pie de página
    },
};

export const facturaReport = (factura: FacturaInterface): TDocumentDefinitions => {
    const productLines = factura.detallesFacturas.map(detalle => {
        const producto = detalle.producto;
        return `${producto.nombre}  x${detalle.cantidad}  ${formatCurrency(detalle.importe.toString())}`;
    });

    const docDefinition: TDocumentDefinitions = {
        pageSize: { width: 203, height: 'auto' },  // Ajuste de tamaño a 72mm
        pageMargins: [10, 10, 10, 10],  // Márgenes más pequeños
        styles: styles,
        content: [
            {
                text: 'Kamila Shop',
                style: 'header',
                decoration: 'underline',
            },
            {
                text: 'FACTURA DE VENTA',
                style: 'subheader',
            },
            {
                text: `Cliente: ${factura.clienteNombre || 'Cliente no registrado'}`,
                style: 'details',
            },
            {
                text: `Factura No: ${factura.codigo}`,
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
                text: '---------------------------------------------',  // Separador limpio
                style: 'line',
            },
            ...productLines.map(line => ({ text: line, style: 'item' })),
            {
                text: '---------------------------------------------',
                style: 'line',
            },
            {
                columns: [
                    { text: 'Subtotal:', alignment: 'left', style: 'total' },
                    { text: `${formatCurrency(factura.subtotal.toString())}`, alignment: 'right', style: 'total' },
                ],
            },
            {
                columns: [
                    { text: 'Total:', alignment: 'left', style: 'total' },
                    { text: `${formatCurrency(factura.total.toString())}`, alignment: 'right', style: 'total' },
                ],
            },
            {
                text: 'Gracias por su compra.',
                style: 'footer',
                margin: [0, 14, 0, 0],  // Más espacio
            },
            {
                text: 'www.kamilashop.com',
                style: 'footer',
                fontSize: 8,
            },
        ],
    };

    return docDefinition;
};

