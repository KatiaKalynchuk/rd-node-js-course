import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './entities/movements.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movement])],
  exports: [TypeOrmModule],
})
export class MovementsModule {}
