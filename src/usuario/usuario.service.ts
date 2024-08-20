import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
import { UsuarioDto } from './DTO/usuario.dto';
import { ApiResponse } from 'src/interface';
import * as bcrypt from 'bcrypt';
import { EncryptionService } from 'src/utility/bcrypt/bcrypt.service';
import { GetLocalDate } from 'src/utility/getLocalDate';

@Injectable()
export class UsuarioService {
    constructor(
        private pisma: PrismaService,
        private readonly encryptionService: EncryptionService,
    ) { }

    async createUsuario(data: UsuarioDto): Promise<ApiResponse<Usuario>> {
        const { contactoId, empresaId, estado, genero, nombreUsuario, password, role } = data;

        const encryptedPassword = await this.encryptionService.encryptPassword(password);

        const usuarioData = {
            contactoId,
            empresaId,
            estado,
            genero,
            nombreUsuario,
            password: encryptedPassword,
            role,
            createdAt: GetLocalDate(),
            updatedAt: GetLocalDate(),
        };

        try {
            const usuario = await this.pisma.usuario.create({ data: usuarioData });

            return { success: true, data: usuario };
        } catch (error: any) {
            throw error;
        }
    }

    async findAllUsuario(): Promise<ApiResponse<Usuario[]>> {
        try {
            const usuarios = await this.pisma.usuario.findMany();
            return { success: true, data: usuarios };
        } catch (error: any) {
            throw error;
        }
    }
}
