import { Module } from '../core/decorators/module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [BooksModule],
  controllers: [],
  providers: [],
})

export class AppModule {}
