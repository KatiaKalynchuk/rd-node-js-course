import dotenv from 'dotenv';
import { container } from './container';
import { CONFIG_TOKEN } from './decorators/сonfig';
import { ZodSchema } from 'zod';

export class ConfigModule {
  static forRoot<T extends ZodSchema>(options: { schema: T }) {
    dotenv.config();
    const parsed = options?.schema.safeParse(process.env);

    if (!parsed.success) {
      throw new Error('Invalid config!');
    }

    const config = parsed.data;

    container.register(CONFIG_TOKEN, config);
  }
}
