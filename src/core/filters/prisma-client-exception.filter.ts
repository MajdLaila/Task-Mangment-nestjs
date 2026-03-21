import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

 @Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR; // الافتراضي 500
    let message = 'حدث خطأ غير متوقع في قاعدة البيانات';
    const errorType = exception.name;

    // 1. معالجة الأخطاء المعروفة (التي لها كود مثل P2002)
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2000': // البيانات أطول من المسموح به في العمود
          status = HttpStatus.BAD_REQUEST; // 400
          message = 'البيانات المدخلة أطول من الحد المسموح به في قاعدة البيانات.';
          break;

        case 'P2002': // خطأ الحقل الفريد (Unique Constraint)
          status = HttpStatus.CONFLICT; // 409
          const field = exception.meta?.target ? (exception.meta.target as string[])[0] : 'هذا الحقل';
          message = `القيمة المدخلة في (${field}) مسجلة مسبقاً في النظام.`;
          break;

        case 'P2003': // خطأ المفتاح الأجنبي (Foreign Key Constraint)
          status = HttpStatus.BAD_REQUEST; // 400
          message = 'العملية مرفوضة: السجل المرتبط  غير موجود في النظام.';
          break;

        case 'P2025': // خطأ عدم العثور على السجل (Not Found)
          status = HttpStatus.NOT_FOUND; // 404
          message = 'السجل المطلوب غير موجود في قاعدة البيانات للقيام بهذه العملية.';
          break;

        default: // أي كود Prisma آخر لم نغطيه
          message = 'حدث تعارض في قاعدة البيانات. يرجى مراجعة البيانات المدخلة.';
          break;
      }
    }
    // 2. معالجة أخطاء التحقق (مثلاً حاولت إدخال String في حقل DateTime)
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST; // 400
      message = 'بيانات غير صالحة تم إرسالها إلى قاعدة البيانات (تأكد من أنواع الحقول).';
    }

    // إرجاع الرد بنفس الهيكل المعماري الموحد
    response.status(status).json({
      success: false,
      statusCode: status,
      message: message,
      error: errorType,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
