import { Injectable } from '@nestjs/common';
import { Detalle_factura, Factura } from '@prisma/client';
import { DetalleFacturaService } from 'src/detalle-factura/detalle-factura.service';
import { PrismaService } from 'src/prisma.service';
import { CreateFacturaDto } from './DTO/create-factura.dto';
import { DetalleFacturaDto } from 'src/detalle-factura/DTO/create-detalle-factura.dto';

@Injectable()
export class FacturaService {
    constructor(
        private prisma: PrismaService,
        private readonly detalleFactura: DetalleFacturaService
    ) { }

    async createFatura(data: CreateFacturaDto): Promise<{ success: boolean; factura?: Factura; error?: string }> {
        try {
            const { cliente, empresaId, detalle } = data;

            const facturaData = {
                cliente,
                empresaId,
            } as CreateFacturaDto;

            const factura = await this.prisma.$transaction(async (prisma) => {
                const createdFactura = await this.prisma.factura.create({
                    data: facturaData,
                });

                if (createdFactura) {

                    const detallePromises = detalle.map((detalle) => {
                        const detalleFacturaData = {
                            facturaId: createdFactura.id,
                            productoId: detalle.productoId,
                            empresaId,
                            cantidad: detalle.cantidad,
                        } as DetalleFacturaDto;

                        return this.detalleFactura.createDetalleFactura(detalleFacturaData);
                    });

                    await Promise.all(detallePromises);
                }

                return createdFactura;
            });

            return { success: true, factura };
        } catch (error: any) {
            console.error('Error al crear la factura:', error);
            return { success: false, error: error.message };
        }
    }


    async findAllFactura(): Promise<any[]> {
        try {
            const facturas = await this.prisma.factura.findMany({
                include: {
                    empresa: {
                        select: {
                            id: true,
                            nombre: true,
                            telefono: true,
                            whatsapp: true,
                            instagram: true,
                            descripcion: true,
                            direccion: true,
                        }

                    },
                    detalles: {
                        select: {
                            producto: {
                                select: {
                                    id: true,
                                    nombre: true,
                                    precio: true,
                                }
                            },
                            cantidad: true,
                        },
                    },
                },
            });

            return facturas;
        } catch (error: any) {
            throw new Error(`${error.message}`);
        }
    }
}

