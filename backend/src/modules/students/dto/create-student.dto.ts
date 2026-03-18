import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'أحمد محمد' })
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 'STU-001', description: 'باركود / QR فريد' })
  @IsNotEmpty()
  @IsString()
  code!: string;

  @ApiProperty({ required: false, example: 'المجموعة أ' })
  @IsOptional()
  @IsString()
  groupName?: string;

  @ApiProperty({ required: false, example: '01012345678' })
  @IsOptional()
  @IsString()
  guardianPhone?: string;
}

export class UpdateStudentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groupName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  guardianPhone?: string;
}
