import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NotificationService } from './notification/notification.service';
import { LoggerService } from './logger/logger.service';
import { RedisService } from './redis/redis.service';
import { RetryWorker } from './retry-worker/retry-worker.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // Kafka Producer
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'producer-client',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [AppController, LoggerService],
  providers: [NotificationService, RedisService, RetryWorker],
})

export class AppModule {}
