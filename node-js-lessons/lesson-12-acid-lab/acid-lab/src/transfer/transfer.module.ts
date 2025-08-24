// import { Module } from '@nestjs/common';
// import { TransferService } from './transfer.service';
// import { TransferController } from './transfer.controller';
//
// @Module({
//   controllers: [TransferController],
//   providers: [TransferService],
// })
// export class TransferModule {}

import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { AccountModule } from '../account/account.module';
import { MovementsModule } from '../movements/movements.module';

@Module({
  imports: [AccountModule, MovementsModule],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
