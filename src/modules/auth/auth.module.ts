import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    PrismaModule,
    // تشغيل محرك JWT
    JwtModule.register({
      global: true, // يجعله متاحاً في كل التطبيق
      secret: process.env.JWT_SECRET || 'fallback-secret', // نأخذ السر من ملف .env
      // signOptions: { expiresIn: '7d' }, // صلاحية الجواز: 7 أيام
    }),
  ],
  providers: [AuthService , UsersRepository],
  controllers: [AuthController]
})
export class AuthModule {}
