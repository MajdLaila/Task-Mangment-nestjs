import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
     return this.authService.register(registerDto);
  }
  @Post('login')
  @HttpCode(HttpStatus.OK) // قرار معماري: نرجع كود 200 (نجاح) وليس 201 لأننا لم ننشئ بيانات جديدة
  async login(@Body() loginDto: LoginDto) {
    // نمرر البيانات للخدمة، والخدمة سترجع المستخدم + التوكن
    return this.authService.login(loginDto);
  }
}
