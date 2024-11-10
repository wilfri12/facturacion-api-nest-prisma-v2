/**
 * Obtiene la fecha y hora actual en la zona horaria local.
 * 
 * @returns La fecha y hora actual en la zona horaria local.
 */

//se recomienda utilizar esta forma si se esta trabjando en un ambiente local
export const GetLocalDate = (): Date => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Calcula el desfase horario en milisegundos
    return new Date(now.getTime() - offset); // Ajusta la fecha para la zona horaria local
}


// createdAt: GetLocalDate(),
// updatedAt: GetLocalDate(),






/**
 * Obtiene la fecha y hora actual en la zona horaria local deseada.
 * 
 * @param timeZone La zona horaria local deseada (por ejemplo, 'America/Santo_Domingo').
 * @returns La fecha y hora ajustada a la zona horaria especificada.
 */

//usar esta forma cuando se esta trabjando en produccion.
export const GetLocalDate2 = (): Date => {
    const now = new Date();

    return now;
};
