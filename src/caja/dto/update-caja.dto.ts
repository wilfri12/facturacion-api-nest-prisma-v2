import { IsDecimal, IsEnum, isEnum, IsNumber, IsOptional } from 'class-validator';




export class UpdateCajaDto {

    @IsNumber()
    usuarioId: number;

    @IsNumber()
    cajaId: number;

    @IsDecimal()
    montoFinal: number;
}
