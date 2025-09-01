import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Check,
} from 'typeorm';
import { Movement } from './movement.entity';

@Entity('accounts')
@Check('balance_positive', '"balance" >= 0')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  balance: string;

  @OneToMany(() => Movement, (movement) => movement.fromAccount)
  sentMovements: Movement[];

  @OneToMany(() => Movement, (movement) => movement.toAccount)
  receivedMovements: Movement[];
}
