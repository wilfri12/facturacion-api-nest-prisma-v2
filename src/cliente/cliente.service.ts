import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ClienteDto } from './DTO/create-cliente.dto';
import { ApiResponse } from 'src/interface';
import { Cliente } from '@prisma/client';

@Injectable()
export class ClienteService {
    constructor(private prisma: PrismaService) {}

  async createLiente(data: ClienteDto): Promise<ApiResponse<Cliente>> {
    try {
      const cliente = await this.prisma.cliente.create({ data });
      return { success: true, data: cliente };
    } catch (error: any) {
      throw error;
    }
  }

  async findAllCliente(identificacion: string): Promise<ApiResponse<Cliente>> {
    try {
      const cliente = await this.prisma.cliente.findUnique({
        where: { identificacion},
        include:{
          contacto:{
            select:{
              telefono: true,
              whatsapp: true,
              instagram: true,
              email: true,
              direccion: true,
            }
          },
          facturas:{
            select:{
              id: true,
              total: true,
              createdAt: true,
              updatedAt: true,
              detallesFacturas:{
                select:{
                  producto:{
                    select:{
                      id: true,
                      nombre: true,
                      precio: true,
                      subCategoria:
                      {
                        select:{
                          nombre: true,
                        }
                      }
                    }
                  },
                }
              },
              usuario: {
                select:{
                  id: true,
                  nombreUsuario: true,
                }
              }
            }
          }
        } 
      });

      return { success: true, data: cliente };
    } catch (error: any) {
      throw error;
    }
  }
}
