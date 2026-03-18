import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exam } from './exam.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id!: string;

  @ManyToOne(() => Exam)
  @ApiProperty({ type: () => Exam })
  exam!: Exam;

  @Column()
  @ApiProperty()
  text!: string;

  @Column('jsonb', { nullable: true })
  @ApiProperty({ required: false, type: [String] })
  choices?: string[];

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  correctAnswer?: string;

  @Column({ default: 'mcq' })
  @ApiProperty({ enum: ['mcq', 'essay'] })
  type!: 'mcq' | 'essay';
}
