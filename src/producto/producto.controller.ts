import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from '@prisma/client';
import { CreateProductoDto, UpdateProductoDto } from './DTO/producto.dto';
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
  async find(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('filtro') filtro?: string
  ): Promise<ApiResponse<{ productos: Producto[], totalRecords: number }>> {
    try {
      const productos = await this.productoService.findAllProducto({
        page,
        pageSize,
        filtro
      });
      return productos;
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Get('codigo/:codigo')
  async findByCodigo2(@Param('codigo') codigo: string) {

    try {
      return this.productoService.findByCodigo(codigo);

    } catch (error) {
      return { success: false, error: error.message }
    }
  }


  @Get('buscar/:filtro')
  async findByFiltro(@Param('filtro') filtro: string) {
    try {
      const resultado = await this.productoService.FindByCodigoNombre(filtro);
      return resultado;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }


  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    const response = await this.productoService.update(+id, updateProductoDto);
    return response;
  }

}
