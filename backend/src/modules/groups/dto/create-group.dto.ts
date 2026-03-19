import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateGroupDto {
  @IsString({ message: 'اسم المجموعة يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'اسم المجموعة مطلوب' })
  name!: string;

  @IsOptional() @IsString()
  subject?: string;

  @IsOptional() @IsString()
  teacherName?: string;

  @IsOptional() @IsString()
  schedule?: string;

  @IsOptional() @IsNumber()
  maxStudents?: number;

  @IsOptional() @IsNumber()
  monthlyFee?: number;

  @IsOptional() @IsBoolean()
  active?: boolean;
}
