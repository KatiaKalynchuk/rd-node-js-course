import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { createDistDirectories } from './utils/createDirectories.js';

async function bootstrap() {
  await createDistDirectories();

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
