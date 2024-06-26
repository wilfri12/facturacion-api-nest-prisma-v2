import {  IsNotEmpty, IsNumber,  ValidateNested } from "class-validator";
import { DetalleMateriaPrimaDTO } from "src/detalle-materia-prima/DTO/detalle-materia-prima.dto";

export class DetalleProduccionDTO {
    @IsNotEmpty()
    @IsNumber()
    produccionId: number;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;


    @IsNotEmpty()
    @IsNumber()
    productoId: number;

    @IsNotEmpty()
    @IsNumber()
    cantidadProducto: number;

  }


  export class DetalleProduccionConMateriaPrimaDTO {
    @IsNotEmpty()
    @IsNumber()
    produccionId: number;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;


    @IsNotEmpty()
    @IsNumber()
    productoId: number;

    @IsNotEmpty()
    @IsNumber()
    cantidadProducto: number;

    detalleMateriaPrima?: DetalleMateriaPrimaDTO[];

  }
