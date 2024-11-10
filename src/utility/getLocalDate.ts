/**
 * Obtiene la fecha y hora actual en la zona horaria local.
 * Si no hay desfase horario, ajusta la fecha restando 4 horas.
 * 
 * @returns La fecha y hora actual en la zona horaria local.
 */
export const GetLocalDate = (): Date => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Calcula el desfase horario en milisegundos

    if (offset === 0) {
        // Si no hay desfase (UTC), restamos 4 horas.
        now.setHours(now.getHours() - 4);
    }

    // Devuelve la fecha ajustada según el desfase horario o el ajuste manual.
    return new Date(now.getTime() - offset); // Ajusta la fecha para la zona horaria local
}
