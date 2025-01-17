import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCajaDto, AbrirCajaDTO, CreateMovimientosCajaDto } from './dto/create-caja.dto';
import { ApiResponse } from 'src/interface';
import { Caja, EstadoCaja, HistorialCaja, MovimientosCaja, Prisma, tipoMovimientoCaja } from '@prisma/client';
import { GetLocalDate } from 'src/utility/getLocalDate';
import { PrismaService } from 'src/prisma.service';
import { UpdateCajaDto } from './dto/update-caja.dto';

@Injectable()
export class CajaService {

  constructor(private readonly prisma: PrismaService) { }

  async createCaja(data: CreateCajaDto): Promise<ApiResponse<Caja>> {
    const { empresaId, nombre, ubicacion } = data;

    if (!empresaId || !nombre) {
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


  async findAll(empresaId: number): Promise<ApiResponse<Caja[]>> {
    try {
      const cajas = await this.prisma.caja.findMany({
        where: { empresaId },
        include: {
          Usuario: {
            select: {
              id: true,
              nombreUsuario: true,
            },
          },
        },
      });

      return { success: true, data: cajas, message: 'Cajas obtenidas correctamente' };
    } catch (error: any) {
      console.error('Error al obtener cajas cerradas:', error);
      return { success: false, message: error || 'Error al obtener cajas cerradas' };
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
          include: { Usuario: { select: { nombreUsuario: true } } },
        });

        if (!cajaExistente) {
          throw (`No se encontró una caja con el ID ${cajaId}. Verifique el ID proporcionado.`);
        }

        if (cajaExistente.estado === EstadoCaja.ABIERTA) {
          throw (`Esta caja ya se encuentra abierta y asignada al usuario ${cajaExistente.Usuario.nombreUsuario}.`);
        }

        // Verificar si el usuario ya tiene una caja abierta
        const usuarioConCajaAbierta = await this.prisma.caja.findFirst({
          where: { estado: EstadoCaja.ABIERTA, usuarioId },
          include: { Usuario: { select: { nombreUsuario: true } } },
        });

        if (usuarioConCajaAbierta) {
          throw (`Actualmente tienes la  ${usuarioConCajaAbierta.nombre} abierta, debes cerrarla antes de abrir otra.`);
        }
        // Crear el historial y movimiento inicial
        await this.crearHistorialYMovimiento(prisma, datosHistorialCaja, usuarioId);

        // Actualizar el estado de la caja
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
        message: `La caja "${cajaActualizada.nombre}" ha sido abierta exitosamente.`,
      };
    } catch (error) {
      return {
        success: false,
        message: error ?? 'Ocurrió un error inesperado al intentar abrir la caja.',
      };
    }
  }

  async findHistorialCaja(cajaId: number, fecha: Date): Promise<ApiResponse<any>> {
    if (!fecha) {
      return { success: false, message: 'La fecha es requerida para realizar la búsqueda' };
    }
    const startDateTime = fecha ? new Date(new Date(fecha).setUTCHours(0, 0, 0, 0)) : undefined;
      const endDateTime = fecha ? new Date(new Date(fecha).setUTCHours(23, 59, 59, 999)) : undefined;
  
    try {
      const historiales = await this.prisma.historialCaja.findMany({

        where: {
          cajaId: cajaId,
          createdAt: {
            gte: startDateTime,
            lte: endDateTime,
          },
        },
        include: {
          movimientosCaja: true, // Incluir los movimientos relacionados
        },
        orderBy: {
          id: 'desc', // Ordenar por el ID en orden descendente
        },
      });
  
      // Crear detalles enriquecidos para cada historial
      const detalles = historiales.map((historial) => {
        const ingresos = historial.movimientosCaja
          .filter((mov) => mov.tipo === 'INGRESO')
          .reduce((acc, mov) => acc + Number(mov.monto), 0);
  
        const egresos = historial.movimientosCaja
          .filter((mov) => mov.tipo === 'EGRESO')
          .reduce((acc, mov) => acc + Number(mov.monto), 0);

          const ventasCredito = historial.movimientosCaja
          .filter((mov) => mov.tipo === 'VENTA_CREDITO')
          .reduce((acc, mov) => acc + Number(mov.monto), 0);

          const pagoCredito = historial.movimientosCaja
          .filter((mov) => mov.tipo === 'PAGO_CREDITO')
          .reduce((acc, mov) => acc + Number(mov.monto), 0);
      
  
        return {
          id: historial.id,
          cajaId: historial.cajaId,
          montoInicial: historial.montoInicial,
          montoFinal: historial.montoFinal,
          estado: historial.estado,
          fechaApertura: historial.fechaApertura,
          fechaCierre: historial.fechaCierre,
          ingresosTotales: ingresos + pagoCredito,
          ventasCreditoTotales: ventasCredito, // Mostrar las ventas a crédito, pero no las sumamos como ingresos reales
          egresosTotales: egresos,
          saldoTotal: Number(historial.montoInicial) + pagoCredito + ingresos - egresos,
          movimientos: historial.movimientosCaja.map((mov) => ({
            id: mov.id,
            tipo: mov.tipo,
            monto: mov.monto,
            descripcion: mov.descripcion,
            fecha: mov.createdAt,
          })),
        };
      });
  
      return {
        success: true,
        data: detalles,
        message: 'Datos obtenidos correctamente',
      };
    } catch (error: any) {
      console.error('Error al obtener el historial de caja:', error);
      return {
        success: false,
        message: 'Error al obtener el historial de caja. Por favor, intente de nuevo.',
      };
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
        const cajaExistente = await prisma.caja.findUnique({
          where: { id: cajaId, estado: 'ABIERTA', usuarioId },
          include: {
            historialCajas: {
              where: { estado: 'ABIERTA' },
              orderBy: { id: 'desc' }, // Suponiendo que 'fecha' es el campo temporal
              take: 1, // Esto asegura que solo tomes el historial más reciente
              include: {
                movimientosCaja: true, // Incluir los movimientos relacionados
              },
            },
          },
        });
  
        if (!cajaExistente) {
          throw new Error(`No se encontró una caja con el ID ${cajaId}.`);
        }
  
        if (cajaExistente.estado === EstadoCaja.CERRADA) {
          throw new Error('La caja ya se encuentra cerrada.');
        }
  
        // Buscar el historial de caja más reciente en estado abierto
        const historial = cajaExistente.historialCajas[0];
  
        // Calcular el cuadre de caja (sin incluir las ventas a crédito en los ingresos)
        const ingresos = historial.movimientosCaja
          .filter((mov) => mov.tipo === 'INGRESO' || mov.tipo === 'VENTA')
          .reduce((acc, mov) => acc + Number(mov.monto), 0);
  
        const egresos = historial.movimientosCaja
          .filter((mov) => mov.tipo === 'EGRESO')
          .reduce((acc, mov) => acc + Number(mov.monto), 0);
  
        // El saldo esperado es el monto inicial + los ingresos - los egresos
        const saldoEsperado = Number(historial.montoInicial) + ingresos - egresos;
  
        // Verificar el cuadre de caja
        const diferenciaCaja = montoFinal - saldoEsperado;

        if (diferenciaCaja < 0) {
          // Esto podría ser un error en el proceso de cierre, una alerta o mensaje de advertencia
          throw new Error(`Advertencia: El monto final ingresado es menor que el saldo esperado. Diferencia: $${Math.abs(diferenciaCaja)}.`);
          
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
            monto: parseFloat(montoFinal.toString()) + diferenciaCaja, // Incluir el ajuste en el monto final
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
  
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
  
  
  

  async verificarCajaAbierta(usuarioId: number): Promise<Caja | null> {
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

  private async crearHistorialYMovimiento(
    prisma: Prisma.TransactionClient,
    datosHistorialCaja: any,
    usuarioId: number
  ): Promise<void> {
    const historialCaja = await prisma.historialCaja.create({
       data: datosHistorialCaja 
      });

    const movimientoInicial: CreateMovimientosCajaDto = {
      usuarioId,
      descripcion: 'Apertura de caja',
      historialCajaId: historialCaja.id,
      monto: parseFloat(datosHistorialCaja.montoInicial.toString()),
      tipo: tipoMovimientoCaja.INICIAL,
      createdAt: GetLocalDate(),
      updatedAt: GetLocalDate(),
    };

    await prisma.movimientosCaja.create({ data: movimientoInicial });
  }


  
}
