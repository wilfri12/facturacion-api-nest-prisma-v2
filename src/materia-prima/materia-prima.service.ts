import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { MateriaPrimaDto, UpdateMateriaPrimaDto } from './DTO/materia-prima.dto';
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

    async updateMateriaPrimaStock(Data: UpdateMateriaPrimaDto, id: number): Promise<void> {

        const materiaPrima = await this.prisma.materiaPrima.findUnique({ where: { id } });
        let oldStock: number = parseInt(materiaPrima.stock.toString());
        let newStock: number = oldStock - Data.stock;
        const data = { stock: newStock } as UpdateMateriaPrimaDto;
        await this.prisma.materiaPrima.update({ data, where: { id } });
    }

}
