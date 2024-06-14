import { EstadoProducto } from "@prisma/client";
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsString,  isEnum } from "class-validator";

export class ProductoDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsDecimal()
    precio: number;

    @IsNotEmpty()
    @IsEnum(EstadoProducto)
    estado: EstadoProducto;

    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;

    @IsNumber()
    proveedorId: number;
    
    @IsNotEmpty()
    @IsNumber()
    categoriaId: number;

    @IsNumber()
    produccionId: number;
}
