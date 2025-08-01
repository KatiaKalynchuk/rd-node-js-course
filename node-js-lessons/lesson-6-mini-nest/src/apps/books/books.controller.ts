import { BooksService } from './books.service.js';
import { ZodValidationPipe } from '../pipes/zod.pipe';
import { booksSchema } from './books.schema';
import { Roles, RolesGuard } from '../guards/roles.guard';
import { Controller } from '../../core/decorators/controller';
import { UseGuards } from '../../core/decorators/use-guards';
import { Get, Post } from '../../core/decorators/route';
import { Body, Param } from '../../core/decorators/param';
import { UsePipes } from '../../core/decorators/use-pipes';

@Controller('/books')
@UseGuards(RolesGuard) // застосовуємо глобально до всіх методів контролера
export class BooksController {
  constructor(private svc: BooksService) {}

  @Get('/')
  @Roles('admin')
  list() {
    return this.svc.findAll();
  }

  @Get('/:id')
  one(@Param('id') id: string) {
    return this.svc.findOne(+id);
  }

  @Post('/')
  @UsePipes(new ZodValidationPipe(booksSchema))
  add(@Body() body: { title: string }) {
    return this.svc.create(body.title);
  }
}
