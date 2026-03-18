import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ default: 'teacher' })
  role!: string;

  @Column({ nullable: true })
  salaryMode?: 'per-session' | 'percentage' | 'fixed';

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  rate?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
