import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@edu.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @IsString({ message: 'يجب أن تكون كلمة المرور نصاً' })
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
  password!: string;
}
