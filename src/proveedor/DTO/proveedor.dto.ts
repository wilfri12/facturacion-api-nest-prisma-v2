import {  IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProveedorDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsNumber()
    contactoId: number;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;
}
