import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ApiResponse } from 'src/interface';
import { Proveedor } from '@prisma/client';
import { ProveedorDto } from './DTO/proveedor.dto';

@Controller('api/v1/proveedor')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) { }
  @Post()
  async create(@Body() data: ProveedorDto): Promise<ApiResponse<Proveedor>> {
    try {
      const proveedor = await this.proveedorService.createProveedor(data);
      return proveedor;
    } catch (error: any) {
      return { success: true, error: error.message }
    }
  }
  
  @Get()
  async find(): Promise<ApiResponse<Proveedor[]>> {
    try {
      const proveedores = await this.proveedorService.findAllProveedores();
      return proveedores;
    } catch (error) {
      return { success: true, error: error.message }
    }
  }
}
