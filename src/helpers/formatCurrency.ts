type FormatCurrencyOptions = {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  };
  
 export  const formatCurrency = (
    value: number | string,
    { 
      locale = 'en-US', 
      currency = 'USD', 
      minimumFractionDigits = 2, 
      maximumFractionDigits = 2 
    }: FormatCurrencyOptions = {}
  ): string => {
    // Convertir el valor a número
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  
    // Verificar si el valor es un número válido
    if (isNaN(numberValue)) {
      return 'Valor no válido';
    }
  
    // Formatear el número a moneda
    return numberValue.toLocaleString(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    });
  };