import { PartialType } from "@nestjs/mapped-types";
import { Role, GeneroPersona, EstadoUsuario } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, isString, IsString } from "class-validator";

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


export class UpdateUsuarioDto extends PartialType(UsuarioDto) {
    @IsOptional()
    @IsString()
    nombreUsuario?: string;
    @IsOptional()
    @IsString()
    password?: string;
    @IsOptional()
    @IsNumber()
    contactoId?: number;
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
    @IsOptional()
    @IsEnum(GeneroPersona)
    genero?: GeneroPersona;
    @IsOptional()
    @IsEnum(EstadoUsuario)
    estado?: EstadoUsuario;



}
