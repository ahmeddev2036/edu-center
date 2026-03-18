import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id!: string;

  @Column()
  @ApiProperty()
  title!: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  subject?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @ApiProperty({ required: false })
  scheduledAt?: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt!: Date;
}
