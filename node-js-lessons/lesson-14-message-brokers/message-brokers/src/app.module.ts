import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { RetryModule } from './retry-worker/retry-worker.module';
import { LoggerModule } from './logger/logger.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [NotificationModule, LoggerModule, RetryModule, RedisModule],
})
export class AppModule {}
