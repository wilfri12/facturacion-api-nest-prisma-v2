import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { Contacto } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { ContactoDto } from './DTO/contacto.dto';

@Controller('contacto')
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}

  @Post()
  async create(@Body() data: ContactoDto): Promise<ApiResponse<Contacto>> {
    try {
      const contacto = await this.contactoService.createContacto(data);
      return contacto;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Get()
  async find(): Promise<ApiResponse<Contacto[]>> {
    try {
      const contactos = await this.contactoService.findAllContacto();
      return contactos;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
