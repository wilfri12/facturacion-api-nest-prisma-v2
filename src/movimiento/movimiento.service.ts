import { Injectable } from '@nestjs/common';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
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
        }, 
        
      });

      return { success: true, data: movimientos };
    } catch (error: any) {
      throw error;
    }
  }
}
