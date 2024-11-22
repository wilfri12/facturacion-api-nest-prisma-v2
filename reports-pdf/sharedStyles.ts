import type { StyleDictionary } from 'pdfmake';

export const sharedStyles: StyleDictionary = {
  header: {
    fontSize: 24,
    bold: true,
    alignment: 'center',
    color: '#0046a4',
    decoration: 'underline',
  },
  subHeader: {
    fontSize: 12,
    alignment: 'center',
    color: '#333333',
    margin: [0, 5, 0, 10],
  },
  periodo: {
    fontSize: 10,
    bold: false,
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
  footer: {
    fontSize: 9,
    color: '#666666',
  },
};
