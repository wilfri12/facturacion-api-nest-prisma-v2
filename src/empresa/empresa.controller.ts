import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { Empresa } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { EmpresaDto } from './DTO/empresa.dto';

@Controller('api/v1/empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) { }
  @Post()
  async create(@Body() data: EmpresaDto): Promise<ApiResponse<Empresa>> {
    try {

      const empresa = await this.empresaService.createEmpresa(data);

      return empresa;

    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Get()
  async find(): Promise<ApiResponse<Empresa[]>> {
    try {
      const empresas = this.empresaService.findAllEmpresa();
      return empresas;
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
