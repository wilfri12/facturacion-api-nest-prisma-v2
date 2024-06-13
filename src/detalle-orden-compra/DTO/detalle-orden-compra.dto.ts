import {  IsDecimal, IsNotEmpty, IsNumber } from "class-validator";

export class DetalleOrdenCompraDto {
    @IsNotEmpty()
    @IsNumber()
    ordenId: number;

    @IsNotEmpty()
    @IsNumber()
    productoId: number;

    @IsNotEmpty()
    @IsDecimal()
    precioUnitario: number;

    @IsNotEmpty()
    @IsNumber()
    cantidad: number;

    @IsNotEmpty()
    @IsDecimal()
    subtotal: number;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;
    
}
