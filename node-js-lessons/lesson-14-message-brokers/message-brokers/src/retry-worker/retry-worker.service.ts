import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RetryWorker implements OnModuleInit {
  private readonly logger = new Logger(RetryWorker.name);

  constructor(private readonly redis: RedisService) {}

  async onModuleInit() {
    this.start();
  }

  async start() {
    let lastId = '0';
    while (true) {
      const streams = await this.redis.readRetries(lastId);
      if (streams) {
        for (const stream of streams) {
          for (const message of stream.messages) {
            const event = JSON.parse(message.message.event);
            this.logger.warn(`Retrying event: ${JSON.stringify(event)}`);
            lastId = message.id;
          }
        }
      }
    }
  }
}
