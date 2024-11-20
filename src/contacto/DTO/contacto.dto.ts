import { PartialType } from "@nestjs/mapped-types";
import {IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class ContactoDto {
    @IsString()
    direccion: string;

    @IsString()
    telefono: string;

    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    instagram: string;

    @IsString()
    whatsapp: string;

    @IsNumber()
    empresaId: number;
}

export class UpdateContactoDto extends PartialType(ContactoDto) {
    @IsString()
    @IsOptional()
    direccion?: string;

    @IsString()
    @IsOptional()
    telefono?: string;

    @IsEmail()
    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    instagram?: string;

    @IsString()
    @IsOptional()
    whatsapp?: string;
}
