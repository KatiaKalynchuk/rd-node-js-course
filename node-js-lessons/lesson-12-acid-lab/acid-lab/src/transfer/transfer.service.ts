import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Account } from '../account/entities/account.entity';
import { Movement } from '../movements/entities/movements.entity';

@Injectable()
export class TransferService {
  constructor(private dataSource: DataSource) {}

  async transfer(fromId: string, toId: string, amount: number) {
    return this.dataSource.transaction(async (manager) => {
      const from = await manager.findOne(Account, { where: { id: fromId } });
      const to = await manager.findOne(Account, { where: { id: toId } });

      if (!from || !to) {
        throw new BadRequestException('Account not found');
      }

      if (Number(from.balance) < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      from.balance = Number(from.balance) - amount;
      to.balance = Number(to.balance) + amount;

      await manager.save(from);
      await manager.save(to);

      const movement = manager.create(Movement, { from, to, amount });
      return manager.save(movement);
    });
  }
}
