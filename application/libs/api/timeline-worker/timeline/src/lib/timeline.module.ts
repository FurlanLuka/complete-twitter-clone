import { Module } from '@nestjs/common';
import {
  TimelineController,
  TimelineQueueController,
} from './timeline.controller';
import { TimelineService } from './timeline.service';
import { TweetModule } from './tweet/tweet.module';

@Module({
  imports: [TweetModule],
  controllers: [TimelineQueueController, TimelineController],
  providers: [TimelineService],
})
export class TimelineModule {}
