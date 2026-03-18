import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ example: 'درس الجبر - الوحدة الأولى' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ enum: ['local', 'vimeo', 'youtube'] })
  @IsIn(['local', 'vimeo', 'youtube'])
  provider!: 'local' | 'vimeo' | 'youtube';

  @ApiProperty({ example: 'https://youtube.com/watch?v=...' })
  @IsNotEmpty()
  @IsString()
  sourceUrl!: string;

  @ApiProperty({ required: false, example: 'المجموعة أ' })
  @IsOptional()
  @IsString()
  allowedGroup?: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  downloadable?: boolean;
}
