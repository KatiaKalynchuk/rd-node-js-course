import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  await app.listen(port);
  console.log(`App is running on ${port}`);
}
bootstrap();
