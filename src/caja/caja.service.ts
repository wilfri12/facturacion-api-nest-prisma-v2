import { Injectable } from '@nestjs/common';
import { CreateCajaDto, CreateHistorialCajaDto, CreateMovimientosCajaDto } from './dto/create-caja.dto';
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
      const cajas = await this.prisma.caja.findMany({
        where: { estado: 'CERRADA' }
      });
      return { success: true, data: cajas };
    } catch (error: any) {
      throw error;
    }
  }


  async createHistorialCaja(data: CreateHistorialCajaDto): Promise<ApiResponse<HistorialCaja>> {
    const { cajaId, montoInicial } = data;
    
    const historialData = {
      cajaId,
      montoInicial: parseFloat(montoInicial.toString()),
      fechaApertura: GetLocalDate(),
      createdAt: GetLocalDate(),
      updatedAt: GetLocalDate(),
    };
  
    try {
      const historial = await this.prisma.$transaction(async (prisma) => {
        // Crear el historial de caja
        const historialCreated = await prisma.historialCaja.create({ data: historialData });

        // Convertir montoInicial de Decimal a number
      const montoInicialNumber = historialCreated.montoInicial.toNumber();
  
        // Crear el movimiento de caja relacionado con la apertura
        const movimientoData: CreateMovimientosCajaDto = {
          usuarioId: 1, // Asegúrate de que el usuarioId se pase correctamente
          descripcion: 'Inicio de caja',
          historialCajaId: historialCreated.id,
          monto: montoInicialNumber,
          tipo: tipoMovimientoCaja.INICIAL, // Asegúrate de que el tipo esté bien definido
          createdAt: GetLocalDate(),
          updatedAt: GetLocalDate(),
        };
  
        await prisma.movimientosCaja.create({ data: movimientoData });
  
        // Actualizar el estado de la caja a 'ABIERTA'
        await prisma.caja.update({
          where: { id: cajaId },
          data: { estado: EstadoCaja.ABIERTA, updatedAt: GetLocalDate() },
        });
  
        return historialCreated;
      });
  
      return { success: true, data: historial };
    } catch (error) {
      console.error('Error al crear historial de caja:', error);
      return { success: false, error: error.message };
    }
  }


  async finsHistorialCaja(): Promise<ApiResponse<HistorialCaja[]>> {
    try {

      const historial = await this.prisma.historialCaja.findMany({
        orderBy:{
          createdAt: 'desc',
        }
      });

      return {success: true, data: historial}
      
    } catch (error) {
      
    }

    
  }

  async cerrarCaja(data: UpdateCajaDto): Promise<ApiResponse<Partial<Caja>>> {
    const { cajaId, montoFinal, usuarioId } = data;
  
    const cajaData = {
      estado: EstadoCaja.CERRADA,
      updatedAt: GetLocalDate(),
    };
  
    const historialCajaData = {
      montoFinal: parseFloat(montoFinal.toString()),
      estado: EstadoCaja.CERRADA,
      fechaCierre: GetLocalDate(),
      updatedAt: GetLocalDate(),
    };
  
    try {
      // Creación transacción
      const response = await this.prisma.$transaction(async (prisma) => {
        // Actualizar el estado de la caja
        const cajaUpdated = await prisma.caja.update({
          where: { id: cajaId },
          data: cajaData,
        });
  
        // Buscar el historial de caja abierta más reciente
        const historial = await prisma.historialCaja.findFirst({
          where: {
            cajaId,
            estado: EstadoCaja.ABIERTA,
          },
          orderBy: {
            createdAt: 'desc', // Ordenar por la fecha más reciente
          },
        });
  
        if (!historial) {
          throw new Error('No se encontró un historial de caja abierta.');
        }
  
        // Actualizar el historial de caja con los datos de cierre
        const historialUpdated = await prisma.historialCaja.update({
          where: { id: historial.id },
          data: historialCajaData,
        });
  
        // Crear el movimiento de caja para el cierre
        const montoFloat = parseFloat(montoFinal.toString())
        const usuarioIdInt = parseInt(usuarioId.toString())

        await prisma.movimientosCaja.create({
          data: {
            historialCajaId: historial.id,
            createdAt: GetLocalDate(),
            descripcion: 'Cierre de caja',
            monto: montoFloat,
            tipo: tipoMovimientoCaja.CIERRE,
            updatedAt: GetLocalDate(),
            usuarioId: usuarioIdInt,
          },
        });
  
        return cajaUpdated;
      });
  
      return { success: true, data: response };
    } catch (error) {
      console.error('Error al cerrar la caja:', error);
      return { success: false, error: error.message };
    }
  }
  

  remove(id: number) {
    return `This action removes a #${id} caja`;
  }
}
