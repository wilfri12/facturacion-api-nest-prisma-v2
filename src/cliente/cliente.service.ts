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
      const clientes = await this.prisma.cliente.findMany();
      return { success: true, data: clientes };
    } catch (error: any) {
      throw error;
    }
  }
}
