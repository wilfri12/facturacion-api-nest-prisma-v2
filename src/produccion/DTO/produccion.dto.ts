import { IsDecimal, IsNotEmpty, IsNumber } from "class-validator";

export class ProduccionDTO {
    @IsNotEmpty()
    @IsNumber()
    cantidadProducida: number;
  
    @IsNotEmpty()
    @IsNumber()
    empresaId: number;
  
    @IsNotEmpty()
    @IsDecimal()
    costoTotal: number;
  }
