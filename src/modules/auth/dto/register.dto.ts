
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'الإيميل مطلوب ولا يمكن أن يكون فارغاً' })
  @IsEmail({}, { message: 'صيغة الإيميل غير صحيحة، يرجى إدخال إيميل صالح' })
  email: string;

  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @IsString({ message: 'كلمة المرور يجب أن تكون نصاً' })
  @MinLength(6, { message: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' })
  password: string;


  @IsNotEmpty({ message:   'الاسم الاول مطلوب ' })
  @IsString({ message: '   الاسم الاول يجب أن تكون نصاً' })
  @MinLength(6, { message: 'يجب أن يتكون   الاسم الاول من 6 أحرف على الأقل' })
  firstName: string;

  @IsNotEmpty({ message: '  الاسم الاخير مطلوبة' })
  @IsString({ message: '  الاسم الاخير يجب أن تكون نصاً' })
  @MinLength(6, { message: 'يجب أن يتكون   الاسم الاخير من 6 أحرف على الأقل' })
  lastName: string;

}
