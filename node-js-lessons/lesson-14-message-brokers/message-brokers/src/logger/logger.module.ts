import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { RedisService } from '../redis/redis.service';

@Module({
  providers: [LoggerService, RedisService],
  controllers: [LoggerController],
})
export class LoggerModule {}
