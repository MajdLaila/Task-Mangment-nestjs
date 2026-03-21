import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { PrismaClientExceptionFilter } from './core/filters/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // أمان: يمسح أي بيانات إضافية يرسلها المخترق ولا توجد في الـ DTO
      forbidNonWhitelisted: true, // أمان: يرفض الطلب تماماً إذا احتوى على حقول خبيثة غير معروفة
    }),
  );
   app.useGlobalInterceptors(new TransformInterceptor());

   app.useGlobalFilters(new HttpExceptionFilter(), new PrismaClientExceptionFilter());
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
