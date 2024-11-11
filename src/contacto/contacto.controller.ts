import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { Contacto } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { ContactoDto, UpdateContactoDto } from './DTO/contacto.dto';

@Controller('api/v1/contacto')
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactoDto: UpdateContactoDto,
  ) {
    try {
      const response = await this.contactoService.update(+id, updateContactoDto);
    return response;
    } catch (error) {
      return {success: false, error: error}
    }
  }
}
