import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('يجب تسجيل الدخول للوصول إلى هذا المورد');
    }

    try {
      // التحقق من التوكن باستخدام السر الموجود في .env
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // حفظ بيانات المستخدم (id, email) داخل كائن الطلب لسهولة الوصول إليها لاحقاً
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('جلسة العمل غير صالحة أو منتهية');
    }

    return true; // السماح بالمرور
  }

  // دالة مساعدة لاستخراج التوكن من الهيدر (Authorization: Bearer <token>)
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
