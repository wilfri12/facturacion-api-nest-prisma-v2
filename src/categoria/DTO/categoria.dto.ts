import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CategoriaDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;
    
}
