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
      console.log('El ID de la empresa y el nombre de la caja son obligatorios.' );
      return { success: false, error: 'El ID de la empresa y el nombre de la caja son obligatorios.' };
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
      return { success: true, data: caja };
    } catch (error: any) {
      console.error('Error al crear la caja:', error);
      return { success: false, error: 'Error al crear la caja. Por favor, intente de nuevo.' };
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
          throw new Error(`La caja con ID ${cajaId} no existe.`);
        }

        // Verificar si la caja ya está abierta
        if (cajaExistente.estado === EstadoCaja.ABIERTA) {
          throw new Error(`La caja ya está abierta por el usuario ${cajaExistente.Usuario?.nombreUsuario ?? 'desconocido'}.`);
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
            fechaEntrada: true, // <--- Aquí se incluye 'fechaEntrada'
            updatedAt: true,
          },
        });
      });

      return { success: true, data: cajaActualizada};
    } catch (error) {
      console.error('Error en abrirCaja:', error);
      throw error;
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
        throw new Error('Datos incompletos: cajaId, montoFinal o usuarioId no proporcionados.');
      }
  
      // Inicio de la transacción
      const response = await this.prisma.$transaction(async (prisma) => {
        // Actualizar el estado de la caja
        const cajaUpdated = await prisma.caja.update({
          where: { id: cajaId },
          data: cajaData,
        });
  
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
          throw new Error('No se encontró un historial de caja abierta para esta caja.');
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
  
        return cajaUpdated; // Retornar la caja actualizada
      });
  
      return { success: true, data: response }; // Respuesta en caso de éxito
    } catch (error: any) {
      console.error('Error al cerrar la caja:', error.message || error);
      return {
        success: false,
        error: error.message || 'Ocurrió un error inesperado al cerrar la caja.',
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



  remove(id: number) {
    return `This action removes a #${id} caja`;
  }
}
