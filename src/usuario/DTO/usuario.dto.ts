import { Role, GeneroPersona, EstadoUsuario} from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class UsuarioDto {
    @IsNotEmpty()
    @IsString()
    nombreUsuario: string;

    @IsNotEmpty()
    @IsEnum(GeneroPersona)
    genero: GeneroPersona;

    @IsNotEmpty()
    @IsNumber()
    contactoId: number;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;

    @IsNotEmpty()
    @IsEnum(EstadoUsuario)
    estado: EstadoUsuario;

    @IsNotEmpty()
    @IsNumber()
    empresaId: number;
}
