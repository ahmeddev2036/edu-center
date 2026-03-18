import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id!: string;

  @ManyToOne(() => Student)
  @ApiProperty({ type: () => Student })
  student!: Student;

  @Column({ type: 'date' })
  @ApiProperty()
  sessionDate!: string;

  @Column({ default: true })
  @ApiProperty()
  present!: boolean;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  note?: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt!: Date;
}
