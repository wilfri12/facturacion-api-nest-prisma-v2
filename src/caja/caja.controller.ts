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
  create(@Body() createCajaDto: CreateCajaDto) {
    return this.cajaService.createCaja(createCajaDto);
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
    return {success: false, error: error}
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

  @UseGuards(AuthGuard)
  @Put('cerrar')
  async cerrarCaja(@Body() data: UpdateCajaDto): Promise<ApiResponse<Caja>> {
    try {
      // Llamar al servicio para cerrar la caja
      const response = await this.cajaService.cerrarCaja(data);

      // Retornar respuesta estándar
      if (response.success) {
        return {
          success: true,
          data: response.data,
        };
      } else {
        throw new HttpException(
          response.error || 'No se pudo cerrar la caja.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      return {success: false, error}
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cajaService.remove(+id);
  }
}
