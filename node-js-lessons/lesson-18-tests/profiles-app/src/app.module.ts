import { Module } from '@nestjs/common';
import { ProfilesModule } from './profiles/profiles.module';
import { LoggerModule } from './logger/logger.module';
import { HttpValidationFilter } from './filters/http-validation.filter';

@Module({
  imports: [ProfilesModule, LoggerModule],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: HttpValidationFilter,
    },
  ],
})
export class AppModule {}
