import { Account } from './entities/account.entity';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransferModule } from './transfer/transfer.module';
import { AppConfig } from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './entities/movement.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => AppConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: AppConfig.DATABASE_URL,
        entities: [Account, Movement],
      }),
    }),
    TransferModule,
  ],
})
export class AppModule {}
