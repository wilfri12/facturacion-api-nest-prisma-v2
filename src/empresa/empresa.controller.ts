import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { Empresa } from '@prisma/client';

@Controller('api/v1/empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}
  @Post()
  async create(@Body() data: any): Promise<any> {
    try {
      
      const empresa = await this.empresaService.createEmpresa(data);

      return { success: true, empresa }; 

    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Get()
  async find(): Promise<Empresa[]>
  {
    const empresas = this.empresaService.findAllEmpresa();
    return empresas;
  }
}
