import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovimientoService } from './movimiento.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';

@Controller('api/v1/movimiento')
export class MovimientoController {
  constructor(private readonly movimientoService: MovimientoService) {}

  

  @Get()
  findAll() {
    return this.movimientoService.findAll();
  }

 
}
