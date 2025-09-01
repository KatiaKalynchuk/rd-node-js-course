import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AppConfig } from './config/config';
import { Account } from './entities/account.entity';
import { Movement } from './entities/movement.entity';

export default new DataSource({
  type: 'postgres',
  url: AppConfig.DATABASE_URL,
  synchronize: false,
  entities: [Account, Movement],
  migrations: ['src/migrations/**/*.ts'],
});
