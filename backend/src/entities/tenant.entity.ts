import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  slug!: string; // subdomain: myschool.eduflow.app

  @Column()
  name!: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ nullable: true })
  primaryColor?: string;

  @Column({ default: 'trial' })
  plan!: string; // trial, basic, pro, enterprise

  @Column({ default: true })
  active!: boolean;

  @Column({ nullable: true })
  ownerEmail?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'timestamp', nullable: true })
  trialEndsAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionEndsAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
