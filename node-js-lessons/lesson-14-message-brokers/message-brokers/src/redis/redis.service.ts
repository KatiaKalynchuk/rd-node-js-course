import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({ url: 'redis://localhost:6379' });
    await this.client.connect();
  }

  async addRetry(event: any) {
    await this.client.xAdd('retries.notifications', '*', {
      event: JSON.stringify(event),
    });
  }

  async readRetries(lastId = '0') {
    return this.client.xRead(
      { key: 'retries.notifications', id: lastId },
      { BLOCK: 5000, COUNT: 1 },
    );
  }
}
