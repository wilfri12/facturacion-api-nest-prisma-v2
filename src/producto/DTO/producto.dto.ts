import { EstadoProducto } from "@prisma/client";
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsString,  isEnum } from "class-validator";

export class CreateProductoDto {
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
    
    @IsNotEmpty()
    @IsNumber()
    categoriaId: number;
}

export class UpdateProductoDto {
    @IsString()
    nombre: string;

    @IsString()
    descripcion: string;

    @IsDecimal()
    precio: number;

    @IsEnum(EstadoProducto)
    estado: EstadoProducto;

    @IsNumber()
    stock: number;

    @IsNumber()
    empresaId: number;
    
    @IsNumber()
    categoriaId: number;
}
