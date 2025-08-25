import 'reflect-metadata';
import { NestFactory } from './core/http/router';
import { ConfigModule } from './core/ConfigModule';
import { booksSchema } from './apps/config';
import { AppModule } from './apps/appModule';
import { HttpExceptionFilter } from './core/http/filters/HttpExceptionFilter';

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Handle the error or exit the process
  process.exit(1); // Uncomment to exit the process
});

ConfigModule.forRoot({ schema: booksSchema });
async function bootstrap() {
  const app = NestFactory.create(AppModule);

  app.useGlobalFilters([HttpExceptionFilter]);
  app.listen(3000, () => {
    console.log(`🚀 Server is running on http://localhost:3000`);
  });
}

bootstrap();
