/**
 * Obtiene la fecha y hora actual en la zona horaria local.
 * 
 * @returns La fecha y hora actual en la zona horaria local.
 */
export const GetLocalDate = (): Date => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Calcula el desfase horario en milisegundos
    return new Date(now.getTime() - offset); // Ajusta la fecha para la zona horaria local
}


// createdAt: GetLocalDate(),
// updatedAt: GetLocalDate(),