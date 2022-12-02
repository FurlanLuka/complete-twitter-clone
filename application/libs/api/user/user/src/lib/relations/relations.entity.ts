import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'relations',
})
export class Relations {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  followeeId: string;

  @CreateDateColumn()
  createdAt: Date;
}
