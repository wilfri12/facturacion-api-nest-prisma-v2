import {  IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DetalleProduccionDto {
    @IsNotEmpty()
    @IsNumber()
    materiaPrimaId: number;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;

    @IsNotEmpty()
    @IsNumber()
    productoId: number;

    @IsNotEmpty()
    @IsNumber()
    produccionId: number;

    @IsNotEmpty()
    @IsNumber()
    cantidadProducto: number;

    @IsNotEmpty()
    @IsNumber()
    cantidadMateria: number;
}
