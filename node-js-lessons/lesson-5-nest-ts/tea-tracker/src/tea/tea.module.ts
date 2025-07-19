import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TeaController } from './tea.controller';
import { TeaService } from './tea.service';
import { teaPostRateLimit } from '../common/middleware/rate-limit.middleware';

@Module({
  controllers: [TeaController],
  providers: [TeaService],
})
export class TeaModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(teaPostRateLimit)
      .forRoutes({ path: 'tea', method: RequestMethod.POST });
  }
}
