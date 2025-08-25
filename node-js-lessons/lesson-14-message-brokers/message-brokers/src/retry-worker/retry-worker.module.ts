import { Module } from '@nestjs/common';
import { RetryWorker } from './retry-worker.service';

@Module({
  providers: [RetryWorker],
  exports: [RetryWorker],
})
export class RetryModule {}
