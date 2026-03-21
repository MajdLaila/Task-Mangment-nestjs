import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService,) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);



    const user = await this.prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });


    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;


    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // 2. قرار أمني معماري: نستخدم عبارة مبهمة إذا كان الإيميل غير موجود أو الباسورد خطأ
    // لكي لا نساعد الهاكرز في معرفة الإيميلات المسجلة في نظامنا (User Enumeration Prevention)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

     const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
    };
  }
}
