import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  tenantId!: string;

  @Column()
  plan!: string; // basic, pro, enterprise

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount!: number;

  @Column({ default: 'monthly' })
  billingCycle!: string; // monthly, yearly

  @Column({ default: 'active' })
  status!: string; // active, cancelled, expired

  @Column({ type: 'timestamp', nullable: true })
  startsAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endsAt?: Date;

  @Column({ nullable: true })
  paymentRef?: string;

  @Column({ nullable: true })
  reference?: string; // Stripe PaymentIntent ID

  @CreateDateColumn()
  createdAt!: Date;
}
