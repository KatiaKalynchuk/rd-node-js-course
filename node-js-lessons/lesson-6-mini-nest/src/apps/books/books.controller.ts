import { BooksService } from './books.service.js';
import { ZodValidationPipe } from '../pipes/zod.pipe';
import { booksSchemaAddHandler } from './books.schema';
import { Roles, RolesGuard } from '../guards/roles.guard';
import { Controller } from '../../core/decorators/controller';
import { UseGuards } from '../../core/decorators/use-guards';
import { Get, Post } from '../../core/decorators/route';
import { Body, Param } from '../../core/decorators/param';
import { UsePipes } from '../../core/decorators/use-pipes';
import { UseFilters } from '../../core/decorators/use-filters';
import { HttpException, NotFoundException } from '../../core/errors';

@Controller('/books')
@UseGuards(RolesGuard) // застосовуємо глобально до всіх методів контролера
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
