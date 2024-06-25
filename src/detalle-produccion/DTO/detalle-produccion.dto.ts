import { Type } from "class-transformer";
import {  IsNotEmpty, IsNumber,  ValidateNested } from "class-validator";
import { DetalleMateriaPrimaDTO } from "src/detalle-materia-prima/DTO/detalle-materia-prima.dto";

export class DetalleProduccionDTO {
    @IsNotEmpty()
    @IsNumber()
    empresaId: number;

    @IsNotEmpty()
    @IsNumber()
    productoId: number;

    @IsNotEmpty()
    @IsNumber()
    cantidadProducto: number;

    @ValidateNested({ each: true })
    @Type(() => DetalleMateriaPrimaDTO)
    detalleMateriaPrima: DetalleMateriaPrimaDTO[]; // Se puede hacer opcional con ?
  }
