import {  IsNotEmpty, IsNumber  } from "class-validator";

export class DetalleMateriaPrimaDTO {
    @IsNotEmpty()
    @IsNumber()
    materiaPrimaId: number;

    @IsNotEmpty()
    @IsNumber()
    cantidadMateria: number;
  }
