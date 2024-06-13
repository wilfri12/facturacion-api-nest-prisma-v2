import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteDto } from './DTO/create-cliente.dto';
import { ApiResponse } from 'src/interface';
import { Cliente } from '@prisma/client';

@Controller('api/v1/cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  async create(@Body() data: ClienteDto): Promise<ApiResponse<Cliente>> {
    try {
      const cliente = await this.clienteService.createLiente(data);
      return cliente;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get()
  async find(): Promise<ApiResponse<Cliente[]>> {
    try {
      const clientes = await this.clienteService.findAllCliente();
      return clientes;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
