import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('movement')
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.sentMovements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'from_id' })
  fromAccount: Account;

  @ManyToOne(() => Account, (account) => account.receivedMovements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'to_id' })
  toAccount: Account;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  amount: string;

  @CreateDateColumn()
  createdAt: Date;
}
