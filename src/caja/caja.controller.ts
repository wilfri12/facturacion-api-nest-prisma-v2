import { Controller, Get, Post, Body, Patch, Put, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CreateCajaDto, AbrirCajaDTO } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { ApiResponse } from 'src/interface';
import { Caja, HistorialCaja } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth/auth.guard';

@Controller('api/v1/caja')
export class CajaController {
  constructor(private readonly cajaService: CajaService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createCajaDto: CreateCajaDto): Promise<ApiResponse<any>> {
    try {
      const response = await this.cajaService.createCaja(createCajaDto);

      // Si el servicio responde con éxito
      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Caja creada exitosamente.',
        };
      }

      // Si el servicio responde con error
      throw new HttpException(
        {
          success: false,
          message: response.message || 'No se pudo crear la caja.',
        },
        HttpStatus.BAD_REQUEST
      );
    } catch (error: any) {
      console.error('Error al crear la caja en el controlador:', error.message || error);

      // Manejo de errores inesperados
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Ocurrió un error inesperado al intentar crear la caja.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post('abrir')
async abrirCaja(@Body() datosApertura: AbrirCajaDTO): Promise<ApiResponse<Caja>> {
  try {
    const resultado = await this.cajaService.abrirCaja(datosApertura);

    if (!resultado) {
      throw new HttpException(
         'Error al abrir la caja.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return resultado;
  } catch (error) {
    return {success: false, message: error}
  }
}

@UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.cajaService.findAllCajaCerrada();
  }

  @UseGuards(AuthGuard)
  @Get('/historial')
  findOne() {
    return this.cajaService.finsHistorialCaja();
  }

  @UseGuards(AuthGuard)
  @Get('/estado/:usuarioId')
  async findCajaAbierta(@Param('usuarioId') usuarioId: string) {
    const caja = await this.cajaService.cajaAbierta(+usuarioId);

    if (!caja) {
      return {
        success: false,
        message: 'No hay caja abierta para este usuario.',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Caja abierta encontrada.',
      data: caja,
    };
  }

  // @UseGuards(AuthGuard)
  @Patch('cerrar')
  async cerrarCaja(@Body() data: UpdateCajaDto): Promise<ApiResponse<Caja>> {
    try {
      // Llamar al servicio para cerrar la caja
      const response = await this.cajaService.cerrarCaja(data);

      return response;
    } catch (error) {
      return {success: false, message: error}
    }
  }

}
