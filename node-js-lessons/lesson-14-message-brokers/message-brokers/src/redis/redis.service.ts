import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  async onModuleInit() {
    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      });

      this.client.on('error', (err) => {
        this.logger.error(`Redis Client Error: ${err.message}`, err.stack);
      });

      await this.client.connect();
      this.logger.log('Connected to Redis');
    } catch (err) {
      this.logger.error(
        `Failed to connect to Redis: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis connection closed');
    }
  }

  async addRetry(event: any, stream = 'retries.notifications') {
    try {
      await this.client.xAdd(stream, '*', {
        event: JSON.stringify(event),
      });
      this.logger.debug(`Event added to stream ${stream}`);
    } catch (err) {
      this.logger.error(
        `Failed to add retry to Redis: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  async readRetries(
    lastId = '0',
    stream = 'retries.notifications',
    block = 5000,
  ) {
    try {
      return await this.client.xRead(
        { key: stream, id: lastId },
        { BLOCK: block, COUNT: 1 },
      );
    } catch (err) {
      this.logger.error(`Failed to read retries: ${err.message}`, err.stack);
      throw err;
    }
  }
}
