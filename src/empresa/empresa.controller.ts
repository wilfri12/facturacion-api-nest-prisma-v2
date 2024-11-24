import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { Empresa } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { EmpresaDto } from './DTO/empresa.dto';
import { AuthGuard } from 'src/auth/auth/auth.guard';

@Controller('api/v1/empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: EmpresaDto): Promise<ApiResponse<Empresa>> {
    try {

      const empresa = await this.empresaService.createEmpresa(data);

      return empresa;

    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async find(): Promise<ApiResponse<Empresa[]>> {
    try {
      const empresas = this.empresaService.findAllEmpresa();
      return empresas;
    } catch (error) {
      return { success: false, message: error.message }
    }
  }
}
