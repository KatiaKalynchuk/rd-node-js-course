import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kafka Consumer
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notifications-client',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'notifications-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('🚀 App is running on http://localhost:3000');
}
bootstrap();
