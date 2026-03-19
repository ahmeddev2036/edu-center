import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateScheduleDto {
  @IsString({ message: 'العنوان يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'العنوان مطلوب' })
  title!: string;

  @IsString({ message: 'اسم المجموعة يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'اسم المجموعة مطلوب' })
  groupName!: string;

  @IsString({ message: 'اسم المعلم يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'اسم المعلم مطلوب' })
  teacherName!: string;

  @IsString({ message: 'يوم الأسبوع يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'يوم الأسبوع مطلوب' })
  dayOfWeek!: string;

  @IsString({ message: 'وقت البداية يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'وقت البداية مطلوب' })
  startTime!: string;

  @IsString({ message: 'وقت النهاية يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'وقت النهاية مطلوب' })
  endTime!: string;

  @IsOptional() @IsString() room?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}
