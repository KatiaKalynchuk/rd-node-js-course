import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka,
  ) {}

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
