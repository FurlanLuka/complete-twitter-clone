import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TweetController, TweetQueueController } from './tweet.controller';
import { Tweet } from './tweet.entity';
import { TweetService } from './tweet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet])],
  controllers: [TweetController, TweetQueueController],
  providers: [TweetService],
})
export class TweetModule {}
