import { IsDecimal, IsNotEmpty, IsNumber} from "class-validator";

export class OrdenCompraDto {
    @IsNumber()
    proveedorId: number;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;   

    @IsNotEmpty()
    @IsNumber()
    usuarioId: number; 

    @IsNotEmpty()
    @IsDecimal()
    total: number;
}
