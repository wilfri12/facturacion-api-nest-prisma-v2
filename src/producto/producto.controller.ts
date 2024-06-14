import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from '@prisma/client';
import { ProductoDto } from './DTO/producto.dto';
import { ApiResponse } from 'src/interface';

@Controller('api/v1/producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) { }

  @Post()
  async create(@Body() data: ProductoDto): Promise<ApiResponse<Producto>> {
    try {
      const producto = await this.productoService.createProducto(data);
      return producto;
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Get()
  async find(): Promise<Promise<ApiResponse<Producto[]>>> {
    try {
      const productos = this.productoService.findAllProducto();
      return productos;
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
