// src/core/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // صيد جميع أنواع الأخطاء
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // تحديد كود الخطأ
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // استخراج رسالة الخطأ
    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    let errorMessage = 'حدث خطأ داخلي في الخادم';

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse) {
      // التعامل مع رسائل class-validator التي تأتي كمصفوفة
      const msg = (exceptionResponse as any).message;
      errorMessage = Array.isArray(msg) ? msg[0] : msg; // نأخذ أول رسالة خطأ فقط لتكون واضحة
    } else if (typeof exceptionResponse === 'string') {
      errorMessage = exceptionResponse;
    }

    // إرجاع الرد بنفس الهيكل المعماري
    response.status(status).json({
      success: false,
      statusCode: status,
      message: errorMessage,
      error: exception instanceof HttpException ? exception.name : 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
