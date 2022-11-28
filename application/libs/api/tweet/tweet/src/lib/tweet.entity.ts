import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'tweet',
})
export class Tweet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  author: string;

  @Column({
    length: 140,
    type: 'varchar',
  })
  tweet: string;

  @Column('integer', {
    default: 0,
  })
  likes: number;

  @Column({
    nullable: true,
    type: 'uuid',
  })
  parent?: string | null;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
