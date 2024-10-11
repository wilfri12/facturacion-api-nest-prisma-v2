import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthPayLoadDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { Roles } from './roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/v1/auth/login')
export class AuthController {
    constructor(private authService: AuthService) {}

   

    @Post()
    async login(@Body() authPayload: AuthPayLoadDTO) {
        const user = await this.authService.validateUser(authPayload);
        if (!user) {
            throw new UnauthorizedException('Invalid username or password');
        }
        return this.authService.login(user);
    }

   
}
