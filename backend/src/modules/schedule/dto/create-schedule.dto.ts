import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateScheduleDto {
  @IsString() title!: string;
  @IsString() groupName!: string;
  @IsString() teacherName!: string;
  @IsString() dayOfWeek!: string;
  @IsString() startTime!: string;
  @IsString() endTime!: string;
  @IsOptional() @IsString() room?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}
