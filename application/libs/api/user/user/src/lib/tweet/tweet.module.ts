import { Module } from '@nestjs/common';
import { RelationsModule } from '../relations/relations.module';
import { TweetQueueController } from './tweet.controller';
import { TweetService } from './tweet.service';

@Module({
  imports: [RelationsModule],
  controllers: [TweetQueueController],
  providers: [TweetService],
})
export class TweetModule {}
