import { MetodoPago } from "@prisma/client";
import { IsDecimal, IsEnum, isEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class FacturaDto {
    @IsString()
    clienteNombre?: string;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;

    @IsNotEmpty()
    @IsNumber()
    usuarioId: number;

    @IsNumber()
    clienteId?: number;

    @IsNotEmpty()
    @IsDecimal()
    total: number;

    @IsNotEmpty()
    @IsDecimal()
    itebisTotal: number;

    @IsNotEmpty()
    @IsEnum(MetodoPago)
    metodoPago: MetodoPago

}












