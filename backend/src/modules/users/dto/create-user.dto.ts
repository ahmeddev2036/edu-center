import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'teacher@edu.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Pass@1234', minLength: 8 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: ['admin', 'teacher', 'staff', 'student', 'parent'], default: 'teacher' })
  @IsOptional()
  @IsIn(['admin', 'teacher', 'staff', 'student', 'parent'])
  role?: string;
}
