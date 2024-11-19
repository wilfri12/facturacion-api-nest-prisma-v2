import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ContactoDto, UpdateContactoDto } from './DTO/contacto.dto';
import { ApiResponse } from 'src/interface';
import { Contacto } from '@prisma/client';
import { GetLocalDate } from 'src/utility/getLocalDate';

@Injectable()
export class ContactoService {
  constructor(private prisma: PrismaService) { }

  async createContacto(data: ContactoDto): Promise<ApiResponse<Contacto>> {
    const { direccion, email, instagram, telefono, whatsapp, empresaId } = data;

    const contactoData = {
      direccion,
      email,
      instagram,
      telefono,
      whatsapp,
      empresaId,
      createdAt: GetLocalDate(),
      updatedAt: GetLocalDate(),
    };

    console.log(contactoData);
    

    try {
      const contacto = await this.prisma.contacto.create({
        data: contactoData,
      });
      return { success: true, data: contacto };
    } catch (error: any) {
      throw error;
    }
  }

  async findAllContacto(): Promise<ApiResponse<Contacto[]>> {
    try {
      const contactos = await this.prisma.contacto.findMany({
        orderBy:{id: 'desc'}
      });
      return { success: true, data: contactos };
    } catch (error: any) {
      throw error;
    }
  }


  async update(id: number, updateContactoDto: UpdateContactoDto): Promise<ApiResponse<Contacto>> {
    try {
      const contacto = await this.prisma.contacto.findUnique({ where: { id } });

      if (!contacto) {
        throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
      }

      const updatedContacto = await this.prisma.contacto.update({
        where: { id },
        data: updateContactoDto,
      });
      return { success: true, data: updatedContacto };
    } catch (error) {
        throw error;
    }
  }
}
