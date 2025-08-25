import { z } from 'zod';

export const booksSchema = z.object({
  PORT: z.string().transform(Number),
  DB_URL: z.string().url(),
});

export type BooksConfig = z.infer<typeof booksSchema>;
