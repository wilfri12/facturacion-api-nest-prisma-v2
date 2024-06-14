import { IsDecimal, IsNotEmpty, IsNumber} from "class-validator";

export class ProduccionDto {

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;

    @IsNotEmpty()
    @IsNumber()
    cantidadProducida: number;

    @IsDecimal()
    costoTotal: number;
}
