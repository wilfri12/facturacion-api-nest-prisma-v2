import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from '@prisma/client';
import { CreateProductoDto } from './DTO/producto.dto';
import { ApiResponse } from 'src/interface';

@Controller('api/v1/producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) { }

  @Post()
  async create(@Body() data: CreateProductoDto): Promise<ApiResponse<Producto>> {
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

  @Get('codigo/:codigo')
  async findByCodigo2(@Param('codigo') codigo: string) {
    console.log('HOLA');
    
    try {
      return this.productoService.findByCodigo(codigo);

    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
