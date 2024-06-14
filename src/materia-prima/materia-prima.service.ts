import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { MateriaPrimaDto } from './DTO/materia-prima.dto';
import { MateriaPrima } from '@prisma/client';

@Injectable()
export class MateriaPrimaService {
    constructor(private readonly prisma: PrismaService){}

    async createMateriaPrima(data: MateriaPrimaDto): Promise<ApiResponse<MateriaPrima>>{
        try {
            const materiaPrima = await this.prisma.materiaPrima.create({data});
            return {success: true, data: materiaPrima};
        } catch (error) {
            throw error;
        }
    }

    async findAllMateriaPrima(): Promise<ApiResponse<MateriaPrima[]>>{
        try {
            const materiaPrimas = await this.prisma.materiaPrima.findMany();
            return {success: true, data: materiaPrimas};
        } catch (error) {
            throw error;
        }
    }


}
