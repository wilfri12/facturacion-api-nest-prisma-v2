import { IsDecimal, IsNotEmpty, IsNumber } from "class-validator";


export class DetalleFacturaDto {
    @IsNotEmpty()
    @IsNumber()
    facturaId: number;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;

    @IsNotEmpty()
    @IsNumber()
    productoId: number;

    @IsNotEmpty()
    @IsNumber()
    cantidad: number;

    @IsNotEmpty()
    @IsDecimal()
    precioUnitario: number;

    @IsNotEmpty()
    @IsDecimal()
    subtotal: number;
    
}