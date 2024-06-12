import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { DetalleFacturaDto } from "src/detalle-factura/DTO/create-detalle-factura.dto";

export class CreateFacturaDto {
    @IsNotEmpty()
    @IsString()
    cliente: string;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DetalleFacturaDto)
    detalle: DetalleFacturaDto[];
}
