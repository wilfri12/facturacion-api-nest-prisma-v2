import { Injectable } from '@nestjs/common';
import { Detalle_factura } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DetalleFacturaService {
    constructor(
        private pisma: PrismaService 
    ){}

    async createDetalleFactura(data: any): Promise<any>{
        try {
            return await this.pisma.detalle_factura.create({data})
            
        } catch (error: any) {
            return {success: false, error: error.message}
        }
        
    }

    async findAllDetalleFactura(): Promise<Detalle_factura[]>
    {
        try {
            const detallesFacturas = await this.pisma.detalle_factura.findMany();
            return detallesFacturas;
        } catch (error: any) {
            throw new Error(`${error.message}`)
        }
    }
}
