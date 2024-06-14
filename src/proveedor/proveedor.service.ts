import { Injectable } from '@nestjs/common';
import { Proveedor } from '@prisma/client';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { ProveedorDto } from './DTO/proveedor.dto';

@Injectable()
export class ProveedorService {
    constructor(private readonly prisma: PrismaService) { }

    async createProveedor(data: ProveedorDto): Promise<ApiResponse<Proveedor>> {
        try {
            const proveedor = await this.prisma.proveedor.create({ data });
            return { success: true, data: proveedor }
        } catch (error) {
            throw error;
        }
    }

    async findAllProveedores(): Promise<ApiResponse<Proveedor[]>> {
        try {
            const proveedores = await this.prisma.proveedor.findMany();
            return { success: true, data: proveedores }
        } catch (error) {
            throw error;
        }
    }
}
