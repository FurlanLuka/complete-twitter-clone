import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RelationsController,
  RelationsQueueController,
} from './relations.controller';
import { Relations } from './relations.entity';
import { RelationsService } from './relations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Relations])],
  controllers: [RelationsController, RelationsQueueController],
  providers: [RelationsService],
  exports: [RelationsService],
})
export class RelationsModule {}
