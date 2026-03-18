import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  groupName!: string;

  @Column()
  teacherName!: string;

  @Column()
  dayOfWeek!: string; // السبت، الأحد، ...

  @Column({ type: 'time' })
  startTime!: string; // HH:MM

  @Column({ type: 'time' })
  endTime!: string;

  @Column({ nullable: true })
  room?: string;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
