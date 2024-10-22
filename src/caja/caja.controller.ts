import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CreateCajaDto, CreateHistorialCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';

@Controller('api/v1/caja')
export class CajaController {
  constructor(private readonly cajaService: CajaService) { }

  @Post()
  create(@Body() createCajaDto: CreateCajaDto) {
    return this.cajaService.createCaja(createCajaDto);
  }

  @Post('/historial')
  createHistorial(@Body() data: CreateHistorialCajaDto) {
    return this.cajaService.createHistorialCaja(data);
  }

  @Get()
  findAll() {
    return this.cajaService.findAllCajaCerrada();
  }

  @Get('/historial')
  findOne() {
    return this.cajaService.finsHistorialCaja();
  }

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


  @Put()
  cerrarCaja(@Body() data: UpdateCajaDto) {
    return this.cajaService.cerrarCaja(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cajaService.remove(+id);
  }
}
