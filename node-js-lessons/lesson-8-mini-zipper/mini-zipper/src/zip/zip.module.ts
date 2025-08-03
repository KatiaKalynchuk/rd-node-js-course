import { Module } from '@nestjs/common';
import { ZipController } from './zip.controller.js';
import { ZipService } from './zip.service.js';

@Module({
  controllers: [ZipController],
  providers: [ZipService],
})
export class ZipModule {}
