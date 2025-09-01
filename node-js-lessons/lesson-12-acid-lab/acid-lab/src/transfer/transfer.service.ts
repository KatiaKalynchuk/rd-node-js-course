import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Account } from '../entities/account.entity';
import { Movement } from '../entities/movement.entity';
import { CreateTransferDto } from './dto/CreateTransferDto';

@Injectable()
export class TransferService {
  constructor(private dataSource: DataSource) {}

  async transfer(dto: CreateTransferDto) {
    const { from_id, to_id, amount } = dto;

    return this.dataSource.transaction(async (manager) => {
      const fromAccount = await manager.findOne(Account, {
        where: { id: from_id },
        lock: { mode: 'pessimistic_write' },
      });
      const toAccount = await manager.findOne(Account, {
        where: { id: to_id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!fromAccount || !toAccount) {
        throw new BadRequestException('Account not found');
      }

      if (+fromAccount.balance < +amount) {
        throw new BadRequestException('Insufficient funds');
      }

      const fromBalance = Number(fromAccount.balance) - Number(amount);
      const toBalance = Number(toAccount.balance) + Number(amount);

      fromAccount.balance = fromBalance.toFixed(2);
      toAccount.balance = toBalance.toFixed(2);

      await manager.save(fromAccount);
      await manager.save(toAccount);

      const transfer = manager.create(Movement, {
        fromAccount,
        toAccount,
        amount,
      });
      return manager.save(transfer);
    });
  }
}
