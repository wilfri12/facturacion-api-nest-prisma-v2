import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MateriaPrimaDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    stock: number;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;

    @IsNotEmpty()
    @IsNumber()
    proveedorId: number;
}


export class UpdateMateriaPrimaDto {
    @IsString()
    nombre?: string;

    @IsString()
    stock?: number;

    @IsString()
    descripcion?: string;

    @IsNumber()
    empresaId?: number;

    @IsNumber()
    proveedorId?: number;
}
