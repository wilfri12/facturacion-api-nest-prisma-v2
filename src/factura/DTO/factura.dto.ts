import { IsDecimal, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class FacturaDto {
    @IsString()
    clienteNombre: string;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;

    @IsNotEmpty()
    @IsNumber()
    usuarioId: number;

    @IsNumber()
    clienteId: number;

    @IsNotEmpty()
    @IsDecimal()
    total: number;

}
