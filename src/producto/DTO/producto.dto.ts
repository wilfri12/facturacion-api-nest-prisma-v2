import { EstadoProducto, GeneroProducto } from "@prisma/client";
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
    codigoBarras?: string;

    @IsOptional()
    @IsString()
    talla?: string;

    @IsOptional()
    @IsString()
    volumen?: string;

    @IsOptional()
    @IsString()
    peso?: string;

    @IsOptional()
    @IsString()
    edadRecomendada?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsString()
    marca?: string;

    @IsOptional()
    @IsString()
    ubicacion?: string;

    @IsNotEmpty()
    @IsEnum(EstadoProducto)
    estado: EstadoProducto;
    
    @IsNotEmpty()
    @IsEnum(GeneroProducto)
    genero: GeneroProducto;
        

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

export class UpdateProductoDto {
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
    codigoBarras?: string;

    @IsOptional()
    @IsString()
    talla?: string;

    @IsOptional()
    @IsString()
    volumen?: string;

    @IsOptional()
    @IsString()
    peso?: string;

    @IsOptional()
    @IsString()
    edadRecomendada?: string;

    @IsOptional()
    @IsString()
    color?: string;

    @IsOptional()
    @IsString()
    marca?: string;

    @IsOptional()
    @IsString()
    ubicacion?: string;

    @IsOptional()
    @IsEnum(EstadoProducto)
    estado: EstadoProducto;
    
    @IsOptional()
    @IsEnum(GeneroProducto)
    genero?: GeneroProducto;
        

    @IsOptional()
    @IsNumber()
    stock?: number;

    @IsOptional()
    @IsNumber()
    empresaId?: number;

    @IsOptional()
    @IsNumber()
    subCategoriaId?: number;

    @IsOptional()
    @IsNumber()
    categoriaId?: number;
    
}
