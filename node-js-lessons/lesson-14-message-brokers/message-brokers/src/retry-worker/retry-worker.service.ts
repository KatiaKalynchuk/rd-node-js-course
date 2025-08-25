import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RetryWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RetryWorker.name);
  private isRunning = true;

  constructor(private readonly redis: RedisService) {}

  async onModuleInit() {
    this.logger.log('RetryWorker started');
    this.start();
  }

  async onModuleDestroy() {
    this.logger.log('RetryWorker stopped');
    this.isRunning = false;
  }

  private async start() {
    let lastId = '0';

    while (this.isRunning) {
      try {
        const streams = await this.redis.readRetries(lastId);

        if (streams) {
          for (const stream of streams) {
            for (const message of stream.messages) {
              try {
                const event = JSON.parse(message.message.event);
                this.logger.warn(`Retrying event: ${JSON.stringify(event)}`);

                lastId = message.id;
              } catch (err) {
                this.logger.error(
                  `Failed to process message ${message.id}: ${err.message}`,
                  err.stack,
                );
              }
            }
          }
        } else {
          await this.delay(1000);
        }
      } catch (err) {
        this.logger.error(`Redis read error: ${err.message}`, err.stack);
        await this.delay(2000);
      }
    }
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
