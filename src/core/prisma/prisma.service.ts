
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  // مبدأ Fail-Fast: الاتصال بقاعدة البيانات عند إقلاع السيرفر
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to PostgreSQL database via Prisma.');
    } catch (error) {
      this.logger.error('Failed to connect to the database', error);
      process.exit(1); // إيقاف التطبيق فوراً إذا فشل الاتصال (Fail-Fast)
    }
  }

  // منع تسريب الذاكرة (Memory Leaks) عند إغلاق التطبيق
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
