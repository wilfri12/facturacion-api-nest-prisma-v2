import { Type } from "class-transformer";
import { IsDecimal, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { DetalleProduccionDTO } from "src/detalle-produccion/DTO/detalle-produccion.dto";

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
  
    @ValidateNested({ each: true })
    @Type(() => DetalleProduccionDTO)
    detalleProduccion: DetalleProduccionDTO[];
  }
