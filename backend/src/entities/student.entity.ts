import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id!: string;

  @Column()
  @ApiProperty()
  fullName!: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'barcode / QR code value' })
  code!: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  groupName?: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  guardianPhone?: string;

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @CreateDateColumn()
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt!: Date;
}
