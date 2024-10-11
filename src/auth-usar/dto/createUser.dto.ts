import { Role } from "@prisma/client";

export class CreateUserDTO {
    user: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}