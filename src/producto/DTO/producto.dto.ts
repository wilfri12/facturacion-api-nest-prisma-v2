import { PartialType } from "@nestjs/mapped-types";
import { EstadoProducto } from "@prisma/client";
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductoDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsNotEmpty()
    @IsDecimal()
    precio: number;

    @IsOptional()
    @IsString()
    codigo?: string;


    @IsOptional()
    @IsString()
    ubicacion?: string;

    @IsNotEmpty()
    @IsEnum(EstadoProducto)
    estado: EstadoProducto;
    

    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;

    @IsOptional()
    @IsNumber()
    subCategoriaId?: number;

    @IsNotEmpty()
    @IsNumber()
    categoriaId: number;

}
export class UpdateProductoDto extends PartialType(CreateProductoDto) {
    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsDecimal()
    precio?: number;

    @IsOptional()
    @IsString()
    codigo?: string;

    @IsOptional()
    @IsString()
    ubicacion?: string;

    @IsOptional()
    @IsNumber()
    stock?: number;

    @IsOptional()
    @IsNumber()
    subCategoriaId?: number;

    @IsOptional()
    @IsNumber()
    categoriaId?: number;
    
}
