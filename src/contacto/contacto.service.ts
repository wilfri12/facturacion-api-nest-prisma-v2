import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ContactoDto } from './DTO/contacto.dto';
import { ApiResponse } from 'src/interface';
import { Contacto } from '@prisma/client';

@Injectable()
export class ContactoService {
    constructor(private prisma: PrismaService) {}

    async createContacto(data: ContactoDto): Promise<ApiResponse<Contacto>> {
        try {
          const contacto = await this.prisma.contacto.create({ data });
          return { success: true, data: contacto };
        } catch (error: any) {
          throw error;
        }
      }
    
      async findAllContacto(): Promise<ApiResponse<Contacto[]>> {
        try {
          const contactos = await this.prisma.contacto.findMany();
          return { success: true, data: contactos };
        } catch (error: any) {
          throw error;
        }
      }
}
