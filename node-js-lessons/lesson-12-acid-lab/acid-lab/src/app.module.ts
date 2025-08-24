import { Account } from './account/entities/account.entity';
import { Movement } from './movements/entities/movements.entity';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransferModule } from './transfer/transfer.module';
import { AppConfig } from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';

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
        synchronize: true,
        // password: 'postqres',
      }),
    }),
    AccountModule,
    TransferModule,
  ],
})
export class AppModule {}
