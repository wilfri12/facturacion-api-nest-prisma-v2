import { Injectable, NotFoundException } from '@nestjs/common';
import { Producto } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateProductoDto, UpdateProductoDto } from './DTO/producto.dto';
import { ApiResponse } from 'src/interface';
import { GetLocalDate } from 'src/utility/getLocalDate';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductoService {
    constructor(private prisma: PrismaService) { }

    async createProducto(data: CreateProductoDto): Promise<ApiResponse<Producto>> {
        const currentDate = GetLocalDate();
      
        const productoData = {
          ...data,
          subCategoriaId: data.subCategoriaId || null,
          createdAt: currentDate,
          updatedAt: currentDate,
        };
      
        try {
          const producto = await this.prisma.$transaction(async (prisma) => {
            // Obtener y actualizar la secuencia
            const secuencia = await prisma.secuencias.findUnique({
              where: { nombre: 'producto' },
            });
      
            const secuenciaProducto = (secuencia?.valor || 0) + 1;
      
            await prisma.secuencias.update({
              where: { nombre: 'producto' },
              data: { valor: secuenciaProducto },
            });
      
            // Crear el producto
            const productoCreated = await prisma.producto.create({
              data: productoData,
            });
      
            // Actualizar el código con la secuencia
            const updatedProducto = await prisma.producto.update({
              where: { id: productoCreated.id },
              data: { codigo: `${data.codigo}${secuenciaProducto}`.toUpperCase() },
            });
      
            return updatedProducto;
          });
      
          return { success: true, data: producto };
        } catch (error) {
          console.error('Error al crear producto:', error);
          return {
            success: false,
            message: 'Error al crear el producto. Verifique los datos e intente nuevamente.',
          };
        }
      }
      
    

      async findAllProducto(params: {
        page?: number;
        pageSize?: number;
        filtro?: string;
        empresaId?: number;
      }): Promise<ApiResponse<{
        productos: Producto[];
        totalRecords: number;
        currentPage: number;
        totalPages: number;
      }>> {
        const { page = 1, pageSize = 10, filtro = '', empresaId } = params;
      
        const whereCondition = {
          AND: [
            empresaId ? { empresaId } : {},
            {
              OR: [
                { nombre: { contains: filtro, lte: 'insensitive' } },
                { codigo: { contains: filtro, lte: 'insensitive' } },
                { categoria: { nombre: { contains: filtro, lte: 'insensitive' } } },
              ],
            },
          ],
        };
      
        try {
          const [productos, totalRecords] = await Promise.all([
            this.prisma.producto.findMany({
              where: whereCondition,
              include: {
                empresa: { select: { nombre: true } },
                categoria: { select: { nombre: true } },
                subCategoria: { select: { nombre: true } },
              },
              orderBy: { nombre: 'asc' },
              skip: (page - 1) * pageSize,
              take: Number(pageSize),
            }),
            this.prisma.producto.count({ where: whereCondition }),
          ]);
      
          return {
            success: true,
            data: {
              productos,
              totalRecords,
              currentPage: Number(page),
              totalPages: Math.ceil(totalRecords / pageSize),
            },
          };
        } catch (error) {
          console.error('Error al obtener productos:', error);
          return { success: false, message: 'Error al obtener productos.' };
        }
      }
      
      


      async FindByCodigoNombre(filtro: string): Promise<ApiResponse<Producto[]>> {
        try {
          const productos = await this.prisma.producto.findMany({
            where: {
              OR: [
                { nombre: { contains: filtro, } },
                { codigo: { contains: filtro,  } },
              ],
            },
            take: 10,
            include: {
              empresa: { select: { nombre: true } },
              categoria: { select: { nombre: true } },
              subCategoria: { select: { nombre: true } },
            },
          });
      
          return { success: true, data: productos };
        } catch (error) {
          console.error('Error al buscar productos por código/nombre:', error);
          return { success: false, message: 'Error al buscar productos.' };
        }
      }

//modificar
      async findByCodigo(codigo: string): Promise<Producto> {

        try {
            const productos = await this.prisma.producto.findFirst({
                where: { codigo },
                include: {
                    categoria: {
                        select: {
                            id: true,
                            nombre: true,
                        }
                    },

                    subCategoria: {
                        select: {
                            id: true,
                            nombre: true,
                        }
                    },


                    LoteProducto: {
                        select: {
                            id: true,
                            fechaEntrada: true,

                        }
                    }
                }
            });
            return productos;
        } catch (error: any) {
            throw error;
        }

    }
     
    

      async update(id: number, updateProductoDto: UpdateProductoDto): Promise<ApiResponse<Producto>> {
        try {
          const producto = await this.prisma.producto.findUnique({ where: { id } });
      
          if (!producto) {
            return { success: false, message: `Producto con ID ${id} no encontrado.` };
          }
      
          const updatedProducto = await this.prisma.producto.update({
            where: { id },
            data: {...updateProductoDto, updatedAt: GetLocalDate()}, 
          });
      
          return { success: true, data: updatedProducto };
        } catch (error) {
          console.error('Error al actualizar producto:', error);
          return { success: false, message: 'Error al actualizar el producto.' };
        }
      }
      



}
