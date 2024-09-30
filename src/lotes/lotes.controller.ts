import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { ApiResponse } from 'src/interface';
import { LoteProducto } from '@prisma/client';

@Controller('api/v1/lotes')
export class LotesController {
  constructor(private readonly lotesService: LotesService) { }

  @Post()
  create(@Body() createLoteDto: CreateLoteDto) {
    return this.lotesService.create(createLoteDto);
  }

  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number
  ): Promise<ApiResponse<{ loteProducto: LoteProducto[], totalRecords: number }>> {

    try {

      // Convertir las fechas de string a Date si están presentes
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      // Validación: Si se pasa una fecha de inicio o de fin, ambas deben estar presentes
      if ((startDate && !endDate) || (!startDate && endDate)) {
        return {
          success: false,
          error: 'Ambas fechas (startDate y endDate) deben estar presentes o ninguna.'
        };
      }
      return await this.lotesService.findAll(
        {
          startDate: start,
          endDate: end,
          page,
          pageSize
        }
      );
      
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoteDto: UpdateLoteDto) {
    return this.lotesService.update(+id, updateLoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotesService.remove(+id);
  }
}
