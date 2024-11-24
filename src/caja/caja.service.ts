import { Injectable } from '@nestjs/common';
import { CreateCajaDto, AbrirCajaDTO, CreateMovimientosCajaDto } from './dto/create-caja.dto';
import { ApiResponse } from 'src/interface';
import { Caja, EstadoCaja, HistorialCaja, MovimientosCaja, tipoMovimientoCaja } from '@prisma/client';
import { GetLocalDate } from 'src/utility/getLocalDate';
import { PrismaService } from 'src/prisma.service';
import { UpdateCajaDto } from './dto/update-caja.dto';

@Injectable()
export class CajaService {

  constructor(private readonly prisma: PrismaService) { }

  async createCaja(data: CreateCajaDto): Promise<ApiResponse<Caja>> {
    const { empresaId, nombre, ubicacion } = data;

    if (!empresaId || !nombre) {
      console.log('Faltan datos requeridos para crear la caja.');
      return {
        success: false,
        message: 'El ID de la empresa y el nombre de la caja son obligatorios para proceder con la creación.'
      };
    }

    const cajaData = {
      empresaId,
      nombre,
      ubicacion,
      createdAt: GetLocalDate(),
      updatedAt: GetLocalDate(),
    };

    try {
      const caja = await this.prisma.caja.create({ data: cajaData });
      return {
        success: true,
        data: caja,
        message: `La caja "${caja.nombre}" se creó exitosamente con el ID ${caja.id}.`
      };
    } catch (error: any) {
      console.error('Error al intentar crear la caja:', error.message);

      // Mensaje específico según el tipo de error
      const errorMessage = error.code === 'P2002' // Prisma Unique Constraint Error
        ? `Ya existe una caja con el nombre "${nombre}" en la empresa especificada.`
        : 'Ocurrió un error al crear la caja. Por favor, intente de nuevo más tarde.';

      return {
        success: false,
        message: errorMessage
      };
    }
  }


  async findAllCajaCerrada(): Promise<ApiResponse<Caja[]>> {
    try {
      const cajas = await this.prisma.caja.findMany();
      return { success: true, data: cajas };
    } catch (error: any) {
      throw error;
    }
  }

  async abrirCaja(datosApertura: AbrirCajaDTO): Promise<ApiResponse<Caja>> {
    const { cajaId, montoInicial, usuarioId } = datosApertura;

    const datosHistorialCaja = {
      cajaId,
      montoInicial: parseFloat(montoInicial.toString()),
      fechaApertura: GetLocalDate(),
      createdAt: GetLocalDate(),
      updatedAt: GetLocalDate(),
    };

    try {
      const cajaActualizada = await this.prisma.$transaction(async (prisma) => {
        // Verificar si la caja existe
        const cajaExistente = await prisma.caja.findUnique({
          where: { id: cajaId },
          include: {
            Usuario: {
              select: { nombreUsuario: true },
            },
          },
        });

        if (!cajaExistente) {
          throw new Error(`No se encontró una caja con el ID ${cajaId}. Verifique el ID proporcionado.`);
        }

        // Verificar si la caja ya está abierta
        if (cajaExistente.estado === EstadoCaja.ABIERTA) {
          throw new Error(`La caja ya está abierta y está siendo utilizada por el usuario ${cajaExistente.Usuario?.nombreUsuario ?? 'desconocido'}.`);
        }

        // Crear el historial de apertura de la caja
        const historialCaja = await prisma.historialCaja.create({ data: datosHistorialCaja });

        // Crear un movimiento inicial en la caja
        const movimientoInicial: CreateMovimientosCajaDto = {
          usuarioId,
          descripcion: 'Apertura de caja',
          historialCajaId: historialCaja.id,
          monto: parseFloat(historialCaja.montoInicial.toString()),
          tipo: tipoMovimientoCaja.INICIAL,
          createdAt: GetLocalDate(),
          updatedAt: GetLocalDate(),
        };

        await prisma.movimientosCaja.create({ data: movimientoInicial });

        // Actualizar el estado de la caja a ABIERTA
        return await prisma.caja.update({
          where: { id: cajaId },
          data: {
            estado: EstadoCaja.ABIERTA,
            usuarioId,
            updatedAt: GetLocalDate(),
          },
          select: {
            id: true,
            nombre: true,
            estado: true,
            ubicacion: true,
            usuarioId: true,
            empresaId: true,
            fechaEntrada: true,
            updatedAt: true,
          },
        });
      });

      return {
        success: true,
        data: cajaActualizada,
        message: `La caja "${cajaActualizada.nombre}" ha sido abierta exitosamente.`
      };
    } catch (error) {
      console.error('Error al intentar abrir la caja:', error.message);

      // Mejora en el mensaje de error
      const errorMessage =
        error.message.includes('No se encontró una caja')
          ? error.message
          : error.message.includes('La caja ya está abierta')
            ? error.message
            : 'Ocurrió un error inesperado al intentar abrir la caja. Por favor, inténtelo nuevamente.';

      return {
        success: false,
        message: errorMessage
      };
    }
  }


  async finsHistorialCaja(): Promise<ApiResponse<HistorialCaja[]>> {
    try {
      const historial = await this.prisma.historialCaja.findMany({
        orderBy: {
          id: 'desc',
        }
      });
      return { success: true, data: historial }
    } catch (error) {
    }
  }

  async cerrarCaja(data: UpdateCajaDto): Promise<ApiResponse<Caja>> {
    const { cajaId, montoFinal, usuarioId } = data;

    // Datos para actualizar la caja y su historial
    const cajaData = {
      estado: EstadoCaja.CERRADA,
      updatedAt: GetLocalDate(),
      usuarioId: null,
    };

    const historialCajaData = {
      montoFinal: parseFloat(montoFinal.toString()),
      estado: EstadoCaja.CERRADA,
      fechaCierre: GetLocalDate(),
      updatedAt: GetLocalDate(),
    };

    try {
      // Validación previa
      if (!cajaId || !montoFinal || !usuarioId) {
        throw new Error(
          'Los datos proporcionados son incompletos. Asegúrese de incluir el ID de la caja, el monto final y el ID del usuario.'
        );
      }

      // Inicio de la transacción
      const response = await this.prisma.$transaction(async (prisma) => {
        // Validar la existencia de la caja
        const cajaExistente = await prisma.caja.findUnique({ where: { id: cajaId } });
        if (!cajaExistente) {
          throw new Error(`No se encontró una caja con el ID ${cajaId}.`);
        }

        if (cajaExistente.estado === EstadoCaja.CERRADA) {
          throw new Error('La caja ya se encuentra cerrada.');
        }

        // Buscar el historial de caja más reciente en estado abierto
        const historial = await prisma.historialCaja.findFirst({
          where: {
            cajaId,
            estado: EstadoCaja.ABIERTA,
          },
          orderBy: {
            id: 'desc', // Ordenar por el registro más reciente
          },
        });

        if (!historial) {
          throw new Error(
            `No se puede cerrar la caja porque no tiene un historial activo que
             indique que está abierta. Verifique los registros y asegúrese de que
             la caja esté correctamente abierta antes de intentar cerrarla.`
          );
        }

        // Actualizar el historial de caja con los datos de cierre
        await prisma.historialCaja.update({
          where: { id: historial.id },
          data: historialCajaData,
        });

        // Crear el movimiento de caja para el cierre
        await prisma.movimientosCaja.create({
          data: {
            historialCajaId: historial.id,
            createdAt: GetLocalDate(),
            descripcion: 'Cierre de caja',
            monto: parseFloat(montoFinal.toString()),
            tipo: tipoMovimientoCaja.CIERRE,
            updatedAt: GetLocalDate(),
            usuarioId: parseInt(usuarioId.toString()),
          },
        });

        // Actualizar el estado de la caja a CERRADA
        return await prisma.caja.update({
          where: { id: cajaId },
          data: cajaData,
        });
      });

      return {
        success: true,
        data: response,
        message: `La caja "${response.nombre}" ha sido cerrada exitosamente.`,
      };
    } catch (error: any) {

      const errorMessage =
        error.message
          ? error.message
          : 'Ocurrió un error inesperado al intentar cerrar la caja.';

      console.error('Error al cerrar la caja:', error.message || errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  }


  async cajaAbierta(usuarioId: number): Promise<Caja | null> {
    try {
      return await this.prisma.caja.findFirst({
        where: {
          usuarioId,
          estado: EstadoCaja.ABIERTA,
        },
      });
    } catch (error) {
      console.error('Error al buscar la caja abierta:', error);
      throw new Error('No se pudo obtener el estado de la caja.'); // Puedes lanzar un error específico
    }
  }


}
