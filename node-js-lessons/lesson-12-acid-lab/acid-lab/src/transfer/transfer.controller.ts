import { Controller, Post, Body } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/CreateTransferDto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async create(@Body() body: CreateTransferDto) {
    return this.transferService.transfer(body);
  }
}
