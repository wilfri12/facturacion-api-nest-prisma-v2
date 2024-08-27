import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CreateCajaDto, CreateHistorialCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';

@Controller('api/v1/caja')
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cajaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCajaDto: UpdateCajaDto) {
    return this.cajaService.update(+id, updateCajaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cajaService.remove(+id);
  }
}
