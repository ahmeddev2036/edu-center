import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  subject?: string;

  @Column({ nullable: true })
  teacherName?: string;

  @Column({ nullable: true })
  schedule?: string; // e.g. "السبت والاثنين 5م"

  @Column({ type: 'int', default: 0 })
  maxStudents!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  monthlyFee?: number;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
