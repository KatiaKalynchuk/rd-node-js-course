import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AppConfig } from './config';
import { RATE_LIMIT, TIME_TO_LIVE } from './system/constants';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => AppConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: TIME_TO_LIVE,
        limit: RATE_LIMIT,
      },
    ]),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
