import { Injectable } from '@nestjs/common';
import { Store } from '../store/store';
import { MessageDTO, UserDTO } from '../dto';
import { randomUUID } from 'node:crypto';
import { DB_KEYS } from '../system/constants';

@Injectable()
export class MessagesService {
  constructor(private store: Store) {}

  getAll() {
    return this.store.readByKey(DB_KEYS.MESSAGES) || [];
  }

  async getChatMessages(
    chatId: MessageDTO['chatId'],
    { cursor, limit }: { cursor?: string; limit: number },
  ) {
    const messages = await this.getAll();

    const items = messages
      .filter((message) => message.chatId === chatId)
      .filter((message) => (cursor ? message.sentAt < cursor : true))
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
      .slice(0, limit);

    return { items };
  }

  async addChatMessage(
    user: UserDTO['name'],
    chatId: MessageDTO['chatId'],
    text: MessageDTO['text'],
  ): Promise<MessageDTO> {
    const messages = await this.getAll();

    const message: MessageDTO = {
      id: randomUUID(),
      chatId,
      text,
      author: user,
      sentAt: new Date().toISOString(),
    };

    await this.store.writeByKey(DB_KEYS.MESSAGES, [...messages, message]);

    return message;
  }
}
