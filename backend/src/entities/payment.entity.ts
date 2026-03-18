import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id!: string;

  @Column()
  @ApiProperty()
  studentId!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  @ApiProperty()
  amount!: number;

  @Column({ default: 'tuition' })
  @ApiProperty()
  category!: string;

  @Column({ type: 'timestamp with time zone' })
  @ApiProperty()
  paidAt!: Date;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  reference?: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt!: Date;
}
