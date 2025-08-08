import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { Store } from '../store/store';
import { ChatsService } from './chats.service';
import { WsModule } from '../ws/ws.module';

@Module({
  imports: [WsModule],
  controllers: [ChatsController],
  providers: [Store, ChatsService],
  exports: [Store, ChatsService],
})
export class ChatsModule {}
