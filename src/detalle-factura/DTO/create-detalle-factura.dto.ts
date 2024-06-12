import { IsNotEmpty, IsNumber } from "class-validator";


export class DetalleFacturaDto {
    @IsNotEmpty()
    @IsNumber()
    productoId: number;

    @IsNotEmpty()
    @IsNumber()
    cantidad: number;
}