import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: 'مركز التعليم' })
  centerName!: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  currency?: string; // EGP, USD, SAR

  @Column({ default: 'ar' })
  language!: string;

  @Column({ type: 'jsonb', nullable: true })
  notificationSettings?: Record<string, any>;

  @UpdateDateColumn()
  updatedAt!: Date;
}
