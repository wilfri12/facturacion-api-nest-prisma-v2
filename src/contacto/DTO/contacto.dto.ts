import {IsEmail, IsString } from "class-validator";

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
}
