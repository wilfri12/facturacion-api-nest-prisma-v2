import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApiResponse } from 'src/interface';
import { Movimiento } from './entities/movimiento.entity';

@Injectable()
export class MovimientoService {
  constructor( private readonly prisma: PrismaService){}
  async findAll(): Promise<ApiResponse<Movimiento[]>> {
    try {
      const movimientos = await this.prisma.movimientoInventario.findMany({
        include:{
          producto:{
            select:{
              codigo: true,
              nombre: true,
            }
          },
          usuario:{
            select:{
              nombreUsuario: true
            }
          }
        }, orderBy: {
          createdAt: ('desc')
        }
        
      });

      return { success: true, data: movimientos };
    } catch (error: any) {
      throw error;
    }
  }
}
