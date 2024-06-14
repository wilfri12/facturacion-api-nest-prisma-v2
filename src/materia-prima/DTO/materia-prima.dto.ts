import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MateriaPrimaDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

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
