import { Estado, MetodoPago, TipoMoneda } from "@prisma/client";
import { IsDecimal, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class FacturaDto {
    @IsNotEmpty()
    @IsString()
    codigo: string;

    @IsNotEmpty()
    @IsDecimal()
    subtotal: number;

    @IsNotEmpty()
    @IsDecimal()
    total: number;

    @IsNotEmpty()
    @IsDecimal()
    itebisTotal: number;

    @IsNotEmpty()
    @IsEnum(MetodoPago)
    metodoPago: MetodoPago;
    
    @IsNotEmpty()
    @IsInt()
    usuarioId: number;

    @IsOptional()
    @IsInt()
    clienteId?: number;

    @IsOptional()
    @IsString()
    clienteNombre?: string;
    @IsNotEmpty()
    @IsInt()
    empresaId: number;

    @IsEnum(Estado)
    estado: Estado;

    @IsEnum(TipoMoneda)
    moneda: TipoMoneda;

}












