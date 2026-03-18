import { IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString() senderName!: string;
  @IsString() senderRole!: string;
  @IsOptional() @IsString() recipientId?: string;
  @IsOptional() @IsString() recipientGroup?: string;
  @IsString() content!: string;
}
