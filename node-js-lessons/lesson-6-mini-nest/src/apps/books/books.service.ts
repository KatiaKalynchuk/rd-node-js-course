import { Injectable } from '../../core/decorators/injectable';
import { Config } from '../../core/decorators/сonfig';
import { BooksConfig } from '../config';

export interface Book {
  id: number;
  title: string;
}

@Injectable()
export class BooksService {
  constructor(@Config() private config: BooksConfig) {
    console.log(this.config);
  }
  #data: Book[] = [{ id: 1, title: '1984' }];
  findAll() {
    return this.#data;
  }
  findOne(id: number) {
    return this.#data.find((b) => b.id === id);
  }
  create(title: string) {
    const book = { id: Date.now(), title };
    this.#data.push(book);
    return book;
  }
}
