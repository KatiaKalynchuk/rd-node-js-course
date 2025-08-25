import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RedisService } from '../redis/redis.service';

@Controller()
export class LoggerService {
  private readonly logger = new Logger(LoggerService.name);

  constructor(private readonly redis: RedisService) {}

  @MessagePattern('events.notifications')
  async logNotifications(@Payload() message: { type: string, payload: { id: string, email: string} }) {
    try {
      this.logger.log(`Received from Kafka: ${JSON.stringify(message.type)}`);

      // симуляція падіння
      if (Math.random() > 0.5) {
        throw new Error('Simulated crash in consumer');
      }
    } catch (err) {
      this.logger.error(`Consumer crashed, pushing to Redis...`);
      await this.redis.addRetry(message.type);
    }
  }
}
