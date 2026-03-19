import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'teacher@edu.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صحيح' })
  email!: string;

  @ApiProperty({ example: 'Pass@1234', minLength: 8 })
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @IsString({ message: 'يجب أن تكون كلمة المرور نصاً' })
  @MinLength(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
  password!: string;

  @ApiProperty({ enum: ['admin', 'teacher', 'staff', 'student', 'parent'], default: 'teacher' })
  @IsOptional()
  @IsIn(['admin', 'teacher', 'staff', 'student', 'parent'], { message: 'الدور غير صحيح' })
  role?: string;
}
