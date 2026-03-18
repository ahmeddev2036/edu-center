import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications')
export class NotificationLog {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id!: string;

  @Column()
  @ApiProperty({ enum: ['whatsapp', 'email', 'sms'] })
  channel!: 'whatsapp' | 'email' | 'sms';

  @Column()
  @ApiProperty()
  recipient!: string;

  @Column()
  @ApiProperty()
  template!: string;

  @Column({ default: 'queued' })
  @ApiProperty()
  status!: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt!: Date;
}
