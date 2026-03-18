import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExamDto {
  @ApiProperty({ example: 'امتحان الفصل الأول' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ required: false, example: 'رياضيات' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}

export class AddQuestionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  text!: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  choices?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @ApiProperty({ enum: ['mcq', 'essay'], default: 'mcq' })
  @IsOptional()
  @IsString()
  type?: 'mcq' | 'essay';
}

export class SubmitResultDto {
  @ApiProperty()
  studentId!: string;

  @ApiProperty()
  score!: number;
}
