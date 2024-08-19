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

  async findAllCliente(): Promise<ApiResponse<Cliente[]>> {
    try {
      const clientes = await this.prisma.cliente.findMany({
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
                      precioVenta: true,
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
                  nombre: true,
                }
              }
            }
          }
        }
      });

      return { success: true, data: clientes };
    } catch (error: any) {
      throw error;
    }
  }
}
