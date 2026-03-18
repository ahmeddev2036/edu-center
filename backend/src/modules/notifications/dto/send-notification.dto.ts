import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ enum: ['whatsapp', 'email', 'sms'] })
  @IsIn(['whatsapp', 'email', 'sms'])
  channel!: 'whatsapp' | 'email' | 'sms';

  @ApiProperty({ example: '01012345678' })
  @IsNotEmpty()
  @IsString()
  recipient!: string;

  @ApiProperty({ example: 'مرحباً {{name}}، موعدك غداً الساعة 10' })
  @IsNotEmpty()
  @IsString()
  template!: string;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  @IsObject()
  payload?: Record<string, string>;
}
