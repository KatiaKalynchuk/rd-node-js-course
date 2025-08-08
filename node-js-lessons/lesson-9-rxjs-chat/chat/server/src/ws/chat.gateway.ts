import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';
import { OnModuleDestroy } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { ChatDTO } from '../dto';
import { Store } from '../store/store';

const INSTANCE_ID = uuid(); // 🎯 унікальний для кожної репліки

@WebSocketGateway({ path: '/ws', cors: true })
export class ChatGateway implements OnGatewayConnection, OnModuleDestroy {
  private readonly sub: Redis;
  private event$ = new Subject<{
    ev: string;
    data: any;
    meta?: any;
    src?: typeof INSTANCE_ID;
  }>();

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly redis: Redis,
    private messagesService: MessagesService,
    private store: Store,
  ) {
    this.sub = this.redis.duplicate();
    this.sub.subscribe('chat-events');

    this.sub.on('message', (_, raw) => {
      const parsed = JSON.parse(raw);
      if (parsed.src === INSTANCE_ID) return; // ⬅️ skip own
      console.log('Received event:', parsed);
      this.event$.next(parsed);
    });

    this.event$.subscribe((e) => {
      if (e.data?.chatId) {
        this.server.to(e.data.chatId).emit(e.ev, e.data);
      } else {
        this.server.emit(e.ev, e.data);
      }
    });

    this.event$
      .pipe(filter((e) => e.meta?.local))
      .subscribe((e) =>
        this.redis.publish(
          'chat-events',
          JSON.stringify({ ...e, meta: undefined, src: INSTANCE_ID }),
        ),
      );
  }

  onChatCreated(chat: ChatDTO) {
    this.event$.next({
      ev: 'chatCreated',
      data: chat,
      meta: { local: true },
    });
  }

  onMembersUpdated(chatId: string, members: string[]) {
    this.event$.next({
      ev: 'membersUpdated',
      data: { chatId, members },
      meta: { local: true },
    });
  }

  onModuleDestroy() {
    this.sub.disconnect();
    this.redis.disconnect();
  }

  handleConnection(client: Socket) {
    const user = client.handshake.auth?.user as string;

    if (!user) return client.disconnect(true);
    client.data.user = user;

    // forward broadcast events belonging to this user
  }

  @SubscribeMessage('join')
  onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string },
  ) {
    client.join(body.chatId);
  }

  @SubscribeMessage('leave')
  onLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string },
  ) {
    client.leave(body.chatId);
  }

  @SubscribeMessage('send')
  async onSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; text: string },
  ) {
    const message = await this.messagesService.addChatMessage(
      client.data.user,
      body.chatId,
      body.text,
    );

    this.event$.next({
      ev: 'message',
      data: message,
    });
  }

  @SubscribeMessage('typing')
  onTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; isTyping: boolean },
  ) {
    this.event$.next({
      ev: 'typing',
      data: {
        chatId: body.chatId,
        user: client.data.user,
        isTyping: body.isTyping,
      },
    });
  }
}
