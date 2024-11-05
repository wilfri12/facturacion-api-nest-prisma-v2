import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayLoadDTO } from './dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() authPayload: AuthPayLoadDTO) {
    console.log(authPayload);
    
    return this.authService.validatedUser(authPayload);
  }
}