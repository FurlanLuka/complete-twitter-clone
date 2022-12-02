import { Module } from '@nestjs/common';
import { TweetQueueController } from './tweet.controller';
import { TweetService } from './tweet.service';

@Module({
  controllers: [TweetQueueController],
  providers: [TweetService],
  exports: [TweetService],
})
export class TweetModule {}
