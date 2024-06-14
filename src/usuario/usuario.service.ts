import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
import { UsuarioDto } from './DTO/usuario.dto';
import { ApiResponse } from 'src/interface';

@Injectable()
export class UsuarioService {
    constructor(
        private pisma: PrismaService
    ){}

    async createUsuario(data: UsuarioDto): Promise<ApiResponse<Usuario>>{
        try {
            const usuario = await this.pisma.usuario.create({data})

            return {success: true, data: usuario}
            
        } catch (error: any) {
            throw error;
        }
        
    }

    async findAllUsuario(): Promise<ApiResponse<Usuario[]>>
    {
        try {
            const usuarios = await this.pisma.usuario.findMany();
            return {success: true, data: usuarios}

        } catch (error: any) {
            throw error;
        }
    }
}
