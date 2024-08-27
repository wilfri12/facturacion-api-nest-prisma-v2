import { Injectable } from '@nestjs/common';
import { CreateCajaDto, CreateHistorialCajaDto, CreateMovimientosCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { ApiResponse } from 'src/interface';
import { Caja, HistorialCaja, MovimientosCaja } from '@prisma/client';
import { GetLocalDate } from 'src/utility/getLocalDate';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CajaService {

  constructor(private readonly prisma: PrismaService) { }

  async createCaja(data: CreateCajaDto): Promise<ApiResponse<Caja>> {
    const { empresaId, nombre, ubicacion } = data;
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
      throw error;
    }
  }


  async createHistorialCaja(data: CreateHistorialCajaDto): Promise<ApiResponse<HistorialCaja>> {
    const { cajaId, montoInicial } = data;
    const HistorialData = {
      cajaId,
      montoInicial,
      createdAt: GetLocalDate(),
      updatedAt: GetLocalDate(),
    };
  
    try {
      const historial = await this.prisma.$transaction(async (prisma) => {
        const historialCreated = await prisma.historialCaja.create({ data: HistorialData });
  
        if (historialCreated) {
          const movimiento: CreateMovimientosCajaDto = {
            usuarioId: 1,
            descripcion: 'Inicio de caja',
            historialCajaId: historialCreated.id,
            monto: parseFloat(historialCreated.montoInicial.toString()),
            tipo: "INICIAL",
            createdAt: GetLocalDate(),
            updatedAt: GetLocalDate(),
          };
  
          console.log(movimiento);
  
          await prisma.movimientosCaja.create({ data: movimiento });

          await prisma.caja.update({
            where: { id: cajaId },
            data: { estado: 'ABIERTA', updatedAt: GetLocalDate() }
          });
        }
  
        return historialCreated;
      });
  
      return { success: true, data: historial };
    } catch (error: any) {
      throw error;
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

  findOne(id: number) {
    return `This action returns a #${id} caja`;
  }

  update(id: number, updateCajaDto: UpdateCajaDto) {
    return `This action updates a #${id} caja`;
  }

  remove(id: number) {
    return `This action removes a #${id} caja`;
  }
}
