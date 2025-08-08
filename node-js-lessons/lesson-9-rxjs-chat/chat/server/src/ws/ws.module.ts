import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from '../messages/messages.module';
import { Store } from '../store/store';

@Module({
  imports: [RedisModule, MessagesModule],
  providers: [ChatGateway, Store],
  exports: [ChatGateway],
})
export class WsModule {}
