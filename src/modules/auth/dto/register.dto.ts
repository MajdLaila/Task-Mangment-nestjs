 
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'الإيميل مطلوب ولا يمكن أن يكون فارغاً' })
  @IsEmail({}, { message: 'صيغة الإيميل غير صحيحة، يرجى إدخال إيميل صالح' })
  email: string;

  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @IsString({ message: 'كلمة المرور يجب أن تكون نصاً' })
  @MinLength(6, { message: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' })
  password: string;
}
