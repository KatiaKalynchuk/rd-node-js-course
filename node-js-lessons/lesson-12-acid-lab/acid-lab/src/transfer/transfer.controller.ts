// // transfer.controller.ts
// import { Controller, Post, Body } from '@nestjs/common';
// import { TransferService } from './transfer.service';
//
// @Controller('transfer')
// export class TransferController {
//   constructor(private transferService: TransferService) {}
//
//   @Post()
//   async create(@Body() body: { fromId: string; toId: string; amount: number }) {
//     const movement = await this.transferService.transfer(
//       body.fromId,
//       body.toId,
//       body.amount,
//     );
//     return movement;
//   }
// }

import { Controller, Post, Body } from '@nestjs/common';
import { TransferService } from './transfer.service';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async create(@Body() body: { fromId: string; toId: string; amount: number }) {
    return this.transferService.transfer(body.fromId, body.toId, body.amount);
  }
}
