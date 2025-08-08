import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { MessageDTO, UserDTO } from '../dto';
import { MessagesService } from './messages.service';

@Controller('/api/chats/:id/messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get()
  async list(
    @Param('id') chatId: MessageDTO['chatId'],
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '30',
  ) {
    return this.messagesService.getChatMessages(chatId, {
      cursor,
      limit: +limit,
    });
  }

  @Post()
  create(
    @Headers('X-User') user: UserDTO['name'],
    @Param('id') chatId: MessageDTO['chatId'],
    @Body('text') text: string,
  ): Promise<MessageDTO> {
    return this.messagesService.addChatMessage(user, chatId, text);
  }
}
