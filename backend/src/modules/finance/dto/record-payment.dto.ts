import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class RecordPaymentDto {
  @ApiProperty()
  @IsUUID()
  studentId!: string;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
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
