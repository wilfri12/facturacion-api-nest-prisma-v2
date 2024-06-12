import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class UsuarioService {
    constructor(
        private pisma: PrismaService
    ){}

    async createUsuario(data: any): Promise<any>{
        try {
            return await this.pisma.usuario.create({data})
            
        } catch (error: any) {
            return {success: false, error: error.message}
        }
        
    }

    async findAllUsuario(): Promise<Usuario[]>
    {
        try {
            const usuarios = await this.pisma.usuario.findMany();
            return usuarios;
        } catch (error: any) {
            throw new Error(`${error.message}`)
        }
    }
}
