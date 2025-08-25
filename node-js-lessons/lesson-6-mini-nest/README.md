# Mini-Nest Framework

A lightweight, NestJS-like framework built from scratch. The goal of this project is to explore concepts such as DI/IoC, modules, controllers, pipes, guards, filters, and a bootstrap mechanism.

## Features

* Dependency Injection (DI) container
* Decorators: `@Controller`, `@Get`, `@Post`, `@Body`, `@Param`, `@UseGuards`, `@UsePipes`, `@UseFilters`
* Controllers and routing
* Pipes for validation and transformation
* Guards for authorization
* Exception filters
* Module system with support for `imports`, `providers`, `controllers`: `@Module({controllers, providers, imports})`

## Example: BooksModule

```ts
import { Module } from '../core/module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
```

## Example Controller

```ts
@Controller('/books')
@UseGuards(RolesGuard)
@UseFilters(HttpException)
export class BooksController {
  constructor(private svc: BooksService) {}

  @Get('/')
  @Roles('admin')
  list() {
    return this.svc.findAll();
  }

  @Get('/:id')
  one(@Param('id') id: string) {
    return this.svc.findOne(+id) || new NotFoundException();
  }

  @Post('/')
  @UsePipes(new ZodValidationPipe(booksSchemaAddHandler))
  add(@Body() body: { title: string }) {
    return this.svc.create(body.title);
  }
}
```

## Example Requests

```bash
# Get all books
curl -X GET http://localhost:3000/books

# Get one book by ID
curl -X GET http://localhost:3000/books/1

# Add a new book
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title": "New Book"}'
```

## Getting Started

```bash
npm install
npm run dev
```

The server will start at `http://localhost:3000`.

---

This is a learning project inspired by NestJS, not intended for production use.
