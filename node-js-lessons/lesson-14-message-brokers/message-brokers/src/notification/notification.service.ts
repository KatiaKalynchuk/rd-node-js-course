import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka) {}

  async onModuleInit() {
    await this.kafka.connect();
  }

  async sendUserSignedUpEvent(user: { id: string; email: string }) {
    return this.kafka.emit('events.notifications', {
      type: 'UserSignedUp',
      payload: user,
    });
  }
}
