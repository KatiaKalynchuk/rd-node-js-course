import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export type UserSignedUpPayload = {
  id: string;
  email: string;
};

@Injectable()
export class LoggerService {
  private readonly logger = new Logger(LoggerService.name);

  constructor(private readonly redis: RedisService) {}

  async handleEvent(event: { type: string; payload: UserSignedUpPayload }) {
    try {
      this.logger.log(`Received event: ${JSON.stringify(event)}`);

      switch (event.type) {
        case 'UserSignedUp':
          this.handleUserSignedUp(event.payload);
          break;
        default:
          this.logger.warn(`Unknown event type: ${event.type}`);
      }

      if (Math.random() > 0.5) {
        throw new Error('Simulated crash in consumer');
      }
    } catch (err) {
      this.logger.error(`Consumer crashed: ${err.message}`, err.stack);
      await this.redis.addRetry(event);
    }
  }

  private handleUserSignedUp(payload: UserSignedUpPayload) {
    this.logger.log(
      `Handling UserSignedUp: id=${payload.id}, email=${payload.email}`,
    );
  }
}
