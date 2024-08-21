import { TipoMoneda } from "@prisma/client";
import { IsDecimal, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CompraDto {
    @IsNotEmpty()
    @IsNumber()
    usuarioId: number;

    @IsOptional()
    @IsNumber()
    proveedorId: number;   

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;

    @IsNotEmpty()
    @IsEnum(TipoMoneda)
    moneda: TipoMoneda;
}

export class DetalleCompraDto {

    @IsNotEmpty()
    @IsNumber()
    productoId: number;

    @IsNotEmpty()
    @IsNumber()
    cantidad: number;

    @IsNotEmpty()
    @IsDecimal()
    precioCompra: number;

    @IsNotEmpty()
    @IsDecimal()
    precioVenta: number;
    
}
