import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ example: 'محمد أحمد' })
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  @IsString({ message: 'يجب أن يكون الاسم نصاً' })
  name!: string;

  @ApiProperty({ enum: ['teacher', 'admin', 'staff'], default: 'teacher' })
  @IsOptional()
  @IsIn(['teacher', 'admin', 'staff'], { message: 'الدور غير صحيح' })
  role?: string;

  @ApiProperty({ enum: ['per-session', 'percentage', 'fixed'], required: false })
  @IsOptional()
  @IsIn(['per-session', 'percentage', 'fixed'])
  salaryMode?: 'per-session' | 'percentage' | 'fixed';

  @ApiProperty({ required: false, example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rate?: number;
}

export class UpdateStaffDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: ['teacher', 'admin', 'staff'], required: false })
  @IsOptional()
  @IsIn(['teacher', 'admin', 'staff'])
  role?: string;

  @ApiProperty({ enum: ['per-session', 'percentage', 'fixed'], required: false })
  @IsOptional()
  @IsIn(['per-session', 'percentage', 'fixed'])
  salaryMode?: 'per-session' | 'percentage' | 'fixed';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rate?: number;
}
