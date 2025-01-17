import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Compra } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { CompraService } from './compra.service';
import { CompraDto, DetalleCompraDto } from './DTO/compra.dto';
import { AuthGuard } from 'src/auth/auth/auth.guard';

@Controller('api/v1/compra')
export class CompraController {
    constructor(private readonly compraService: CompraService) { }

    @UseGuards(AuthGuard)
    @Post()
    async createCompra(@Body() data: CompraDto & { detalles: DetalleCompraDto[] }): Promise<ApiResponse<Compra>> {
        try {
            const compra = await this.compraService.create(data);
            
            return compra;

        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    @UseGuards(AuthGuard)
    @Get()
    async findAllCompra(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number
    ): Promise<ApiResponse<{ compras: Compra[], totalRecords: number }>> {
        try {
            // Convertir las fechas de string a Date si están presentes
            const start = startDate ? new Date(startDate) : undefined;
            const end = endDate ? new Date(endDate) : undefined;

            if ((startDate && !endDate) || (!startDate && endDate)) {
                return
            }

            const compras = await this.compraService.findAll(
                {startDate: start,
                endDate: end,
                page,
                pageSize}
            );
            return compras;

        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
  async softDeleteCompra(
    @Param('id') id: string
  ) {
    try {
      // Llamamos al servicio que maneja la lógica de eliminación suave
      const result = await this.compraService.delete(+id);
      return {
        success: true,
        messaje: `Compra con ID ${id} eliminada suavemente.`,
        response: result
      };
    } catch (error) {
      // En caso de error, retornar una respuesta con código 500
      return {
        success: false,
        error: error,
        message: `No se pudo completar el proceso de eliminación suave de la compra con ID ${id}.`,
      };
    }
  }
}
