import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ClienteDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    identificacion: string;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;  
    
    @IsNotEmpty()
    @IsNumber()
    contactoId: number;
}
