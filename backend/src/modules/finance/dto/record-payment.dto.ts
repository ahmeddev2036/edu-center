import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class RecordPaymentDto {
  @ApiProperty()
  @IsUUID('4', { message: 'معرف الطالب غير صحيح' })
  studentId!: string;

  @ApiProperty({ example: 500 })
  @IsNumber({}, { message: 'المبلغ يجب أن يكون رقماً' })
  @Min(0, { message: 'المبلغ لا يمكن أن يكون سالباً' })
  amount!: number;

  @ApiProperty({ required: false, example: 'tuition' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, example: '2026-03-18' })
  @IsOptional()
  @IsString()
  paidAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reference?: string;
}
