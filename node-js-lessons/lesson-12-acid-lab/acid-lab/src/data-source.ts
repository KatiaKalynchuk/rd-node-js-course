import { Account } from './account/entities/account.entity';
import { Movement } from './movements/entities/movements.entity';

import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true, // auto-sync for demos; disable in prod
  logging: false,
  entities: [Account, Movement],
});
