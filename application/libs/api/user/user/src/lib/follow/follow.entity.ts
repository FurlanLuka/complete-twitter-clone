import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'follow',
})
export class Follow {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  followeeId: string;

  @CreateDateColumn()
  createdAt: Date;
}
