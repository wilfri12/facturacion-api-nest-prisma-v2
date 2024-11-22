/**
 * Obtiene el nombre del mes en español.
 * @param monthNumber Número del mes (0 = Enero, 11 = Diciembre).
 * @returns Nombre del mes en formato abreviado.
 */
const getMonthName = (monthNumber: number): string => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return months[monthNumber];
  };
  
  /**
   * Formatea una fecha en el formato "Día Mes Año".
   * @param date Fecha a formatear.
   * @returns Fecha formateada como string.
   */
  export const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = getMonthName(date.getMonth());
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  
  /**
   * Calcula la diferencia detallada en meses y días entre dos fechas.
   * @param start Fecha de inicio.
   * @param end Fecha de fin.
   * @returns Objeto con la diferencia en meses y días.
   */
  export const calculateDetailedDifference = (start: Date, end: Date): { months: number; days: number } => {
    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    let days = end.getDate() - start.getDate();
  
    // Ajustar si los días son negativos
    if (days < 0) {
      const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += previousMonth.getDate(); // Añadimos los días del mes anterior
      months -= 1;
    }
  
    return { months, days };
  };
  
  /**
   * Formatea un rango de fechas con diferencia detallada en meses y días.
   * @param startDate Fecha de inicio del rango.
   * @param endDate Fecha de fin del rango.
   * @returns String con el rango y la diferencia detallada.
   */
  export const formatDateRangeWithDifference = (startDate: Date, endDate: Date): string => {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const { months, days } = calculateDetailedDifference(startDate, endDate);
  
    return `${formattedStartDate} a ${formattedEndDate} (${months} ${months === 1 ? 'mes' : 'meses'}${days > 0 ? ` y ${days} ${days === 1 ? 'día' : 'días'}` : ''})`;
  };
  