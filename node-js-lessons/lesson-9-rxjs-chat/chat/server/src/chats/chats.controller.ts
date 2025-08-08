import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ChatDTO, CreatedChatsDTO, UpdatedChatsDTO, UserDTO } from '../dto';
import { ChatsService } from './chats.service';

@Controller('/api/chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post()
  async create(
    @Headers('X-User') creator: UserDTO['name'],
    @Body() body: CreatedChatsDTO,
  ): Promise<ChatDTO> {
    return this.chatsService.create(creator, body);
  }

  @Get()
  list(@Headers('X-User') user: UserDTO['name']) {
    return this.chatsService.getUserChats(user);
  }

  @Patch(':id/members')
  async patch(
    @Headers('X-User') user: UserDTO['id'],
    @Param('id') id: ChatDTO['id'],
    @Body() dto: UpdatedChatsDTO,
  ) {
    return this.chatsService.update(user, id, dto);
  }

  @Delete(':id')
  delete(
    @Headers('X-User') user: UserDTO['id'],
    @Param('id') id: ChatDTO['id'],
  ) {
    return this.chatsService.delete(user, id);
  }
}
