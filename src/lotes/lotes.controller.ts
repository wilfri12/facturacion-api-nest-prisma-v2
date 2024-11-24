import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { ApiResponse } from 'src/interface';
import { LoteProducto } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth/auth.guard';

@Controller('api/v1/lotes')
export class LotesController {
  constructor(private readonly lotesService: LotesService) { }
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createLoteDto: CreateLoteDto) {
    return this.lotesService.create(createLoteDto);
  }
  @UseGuards(AuthGuard)
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
          message: 'Ambas fechas (startDate y endDate) deben estar presentes o ninguna.'
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
      return { success: false, message: error.message }
    }
  }

  @UseGuards(AuthGuard)
  @Get('activar/:id')
  async activarLote(@Param('id') id: string) {
    try {
      // Llamada al servicio para activar el lote
      const result = await this.lotesService.activarLote(+id);

      if (result.success) {
        return {
          success: true,
          message: result.message,
        };
      } else {
        return {
          success: false,
          message: result.message || result.error,
        };
      }
    } catch (error) {
      console.error('Error al activar el lote:', error);
      return {
        success: false,
        message: 'Ocurrió un error al activar el lote.',
        error: error.message || error,
      };
    }
  }


}
