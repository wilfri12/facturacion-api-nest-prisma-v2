import { IsDecimal, IsNotEmpty, IsNumber} from "class-validator";

export class ProduccionDto {
    @IsNotEmpty()
    @IsNumber()
    productoId: number;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;

    @IsNotEmpty()
    @IsNumber()
    cantidadProducida: number;

    @IsDecimal()
    costoTotal: number;
}
