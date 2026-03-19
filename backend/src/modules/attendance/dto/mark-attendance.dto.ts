import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class MarkAttendanceDto {
  @ApiProperty()
  @IsUUID('4', { message: 'معرف الطالب غير صحيح' })
  studentId!: string;

  @ApiProperty({ example: '2026-03-18' })
  @IsDateString({}, { message: 'تاريخ الجلسة غير صحيح' })
  sessionDate!: string;

  @ApiProperty({ default: true })
  @IsBoolean({ message: 'قيمة الحضور يجب أن تكون صح أو خطأ' })
  present!: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
