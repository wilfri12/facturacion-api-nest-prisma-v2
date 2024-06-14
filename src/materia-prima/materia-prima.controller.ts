import { Body, Controller, Get, Post } from '@nestjs/common';
import { MateriaPrimaService } from './materia-prima.service';
import { MateriaPrimaDto } from './DTO/materia-prima.dto';
import { ApiResponse } from 'src/interface';
import { MateriaPrima } from '@prisma/client';

@Controller('api/v1/materia-prima')
export class MateriaPrimaController {
  constructor(private readonly materiaPrimaService: MateriaPrimaService) { }

  @Post()
  async create(@Body() data: MateriaPrimaDto): Promise<ApiResponse<MateriaPrima>> {
    try {
      const materiaPrima = await this.materiaPrimaService.createMateriaPrima(data);
      return materiaPrima;
    } catch (error) {
      return { success: true, error: error.message };
    }
  }

  @Get()
  async find(): Promise<ApiResponse<MateriaPrima[]>> {
    try {
      const materiaPrimas = await this.materiaPrimaService.findAllMateriaPrima();
      return materiaPrimas;
    } catch (error) {
      return { success: true, error: error.message };
    }
  }
}
