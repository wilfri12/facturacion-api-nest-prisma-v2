import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductoService } from './producto.service';
import {  Producto } from '@prisma/client';

@Controller('api/v1/producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) { }

  @Post()
  async create(@Body() data: any): Promise<any> {
    try {

      console.log(data);
      
      const producto = await this.productoService.createProducto(data);

      return { success: true, producto }; 

    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Get()
  async find(): Promise<Producto[]>
  {
    const productos = this.productoService.findAllProducto();
    return productos;
  }
}
