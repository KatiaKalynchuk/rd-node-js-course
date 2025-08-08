import { Injectable, NotFoundException } from '@nestjs/common';
import { Store } from '../store/store';
import { CreatedChatsDTO, ChatDTO, UserDTO, UpdatedChatsDTO } from '../dto';
import { randomUUID } from 'node:crypto';
import { DB_KEYS } from '../system/constants';
import { ChatGateway } from '../ws/chat.gateway';

@Injectable()
export class ChatsService {
  constructor(
    private store: Store,
    private readonly gateway: ChatGateway,
  ) {}

  async getAll() {
    const chats = await this.store.readByKey(DB_KEYS.CHATS);

    return chats || [];
  }

  async getUserChats(user: UserDTO['name']) {
    const chats = await this.getAll();

    const items = chats.filter((item) => item.members.includes(user));

    return { items };
  }

  async create(
    creator: UserDTO['name'],
    { name, members }: CreatedChatsDTO,
  ): Promise<ChatDTO> {
    const chats = await this.getAll();

    const newChat = {
      name,
      id: randomUUID(),
      members: [...members, creator],
      updatedAt: new Date().toISOString(),
    };

    await this.store.writeByKey(DB_KEYS.CHATS, [...chats, newChat]);

    this.gateway.onChatCreated(newChat);

    return newChat;
  }

  async update(
    user: UserDTO['id'],
    id: ChatDTO['id'],
    { remove, add }: UpdatedChatsDTO,
  ) {
    const { items: chats } = await this.getUserChats(user);

    const chat = chats.find((item) => item.id === id);

    if (!chat) {
      throw new NotFoundException(`Chat with id ${id} not found`);
    }

    const filteredMembers = chat.members.filter(
      (item) => !remove.includes(item),
    );

    chat.members = [...filteredMembers, ...add];

    await this.store.writeByKey(DB_KEYS.CHATS, chats);
    this.gateway.onMembersUpdated(id, chat.members);
  }

  async delete(user: UserDTO['id'], id: ChatDTO['id']) {
    const { items: chats } = await this.getUserChats(user);

    const chat = chats.find((item) => item.id === id);

    if (!chat) {
      throw new NotFoundException(`Chat with id ${id} not found`);
    }

    const updatedChats = chats.filter((item) => item.id !== id);

    await this.store.writeByKey(DB_KEYS.CHATS, updatedChats);
  }
}
