import {  IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EmpresaDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsNumber()
    contactoId: number;
}
