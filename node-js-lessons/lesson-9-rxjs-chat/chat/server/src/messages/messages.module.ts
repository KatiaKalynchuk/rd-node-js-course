import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { Store } from '../store/store';
import { MessagesService } from './messages.service';

@Module({
  controllers: [MessagesController],
  providers: [Store, MessagesService],
  exports: [Store, MessagesService],
})
export class MessagesModule {}
