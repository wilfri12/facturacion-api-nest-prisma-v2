import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ContactoDto } from './DTO/contacto.dto';
import { ApiResponse } from 'src/interface';
import { Contacto } from '@prisma/client';
import { GetLocalDate } from 'src/utility/getLocalDate';

@Injectable()
export class ContactoService {
  constructor(private prisma: PrismaService) { }

  async createContacto(data: ContactoDto): Promise<ApiResponse<Contacto>> {
    const { direccion, email, instagram, telefono, whatsapp } = data;

    const contactoData = {
      direccion,
      email,
      instagram,
      telefono,
      whatsapp,
      createdAt: GetLocalDate(),
      updatedAt: GetLocalDate(),
    };

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
}
