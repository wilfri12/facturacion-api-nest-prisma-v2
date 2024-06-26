import { IsDecimal, IsNotEmpty, IsNumber } from "class-validator";

export class DetalleMateriaPrimaDTO {
  @IsNotEmpty()
  @IsNumber()
  detalleProduccionId: number

  @IsNotEmpty()
  @IsNumber()
  materiaPrimaId: number;

  @IsNotEmpty()
  @IsNumber()
  cantidadMateria: number;

}



