 
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // يجعل هذا الموديول متاحاً في كل التطبيق دون الحاجة لاستيراده بشكل متكرر
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // تصدير الخدمة لتتمكن المجالات الأخرى (مثل Tasks) من استخدامها
})
export class PrismaModule {}
