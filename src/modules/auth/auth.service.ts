import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from './users.repository';
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UsersRepository, // 👈 استبدلنا PrismaService
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, } = registerDto;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // نمرر البيانات الجديدة للريبوزتري
    const user = await this.userRepo.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
  
    });

    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      user: { id: user.id, email: user.email, firstName: user.firstName },
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
