import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'الإيميل مطلوب' })
  @IsEmail({}, { message: 'يجب إدخال إيميل صالح' })
  email: string;

  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @IsString()
  password: string;
}
