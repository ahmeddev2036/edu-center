import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exam } from './exam.entity';
import { Student } from './student.entity';

@Entity('exam_results')
export class ExamResult {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id!: string;

  @ManyToOne(() => Exam)
  @ApiProperty({ type: () => Exam })
  exam!: Exam;

  @ManyToOne(() => Student)
  @ApiProperty({ type: () => Student })
  student!: Student;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  @ApiProperty()
  score!: number;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  grade?: string;
}
