import { TipoMovimiento, tipoMovimientoCaja } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCajaDto {

    @IsString()
    nombre: string;

    @IsString()
    ubicacion: string;

    @IsNumber()
    empresaId: number;
}


export class CreateHistorialCajaDto {

    @IsNumber()
    cajaId: number;

    @IsDecimal()
    montoInicial: number;
}


export class CreateMovimientosCajaDto {
    @IsNotEmpty()
    @IsNumber()
    historialCajaId: number;
  
    @IsNotEmpty()
    @IsNumber()
    usuarioId: number;
  
    @IsNotEmpty()
    @IsNumber()
    monto: number;
  
    @IsNotEmpty()
    @IsEnum(tipoMovimientoCaja)
    tipo: tipoMovimientoCaja; // Suponiendo que 'tipo' es una cadena de texto. Si es un enum, deberías definirlo como tal.
  
    @IsOptional()
    @IsString()
    descripcion?: string;
  
    @IsOptional()
    createdAt?: Date;
  
    @IsOptional()
    updatedAt?: Date;
  }


