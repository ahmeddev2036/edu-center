import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  senderName!: string;

  @Column()
  senderRole!: string; // admin, teacher, parent

  @Column({ nullable: true })
  recipientId?: string; // null = broadcast

  @Column({ nullable: true })
  recipientGroup?: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ default: false })
  isRead!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
