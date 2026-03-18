import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id!: string;

  @Column()
  @ApiProperty()
  title!: string;

  @Column()
  @ApiProperty({ enum: ['local', 'vimeo', 'youtube'] })
  provider!: 'local' | 'vimeo' | 'youtube';

  @Column()
  @ApiProperty()
  sourceUrl!: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  allowedGroup?: string;

  @Column({ default: false })
  @ApiProperty()
  downloadable!: boolean;

  @CreateDateColumn()
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt!: Date;
}
