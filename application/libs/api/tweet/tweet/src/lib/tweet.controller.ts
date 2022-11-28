import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TweetDto } from '@twitr/api/tweet/data-transfer-objects';
import { Tweet } from './tweet.entity';
import { TweetService } from './tweet.service';

@Controller('v1/tweet')
export class TweetController {
  constructor(private tweetService: TweetService) {}

  @Post()
  async tweet(@Body() { author, tweet }: TweetDto): Promise<Tweet> {
    return this.tweetService.createTweet(author, tweet);
  }

  @Get(':id')
  async getTweet(@Param('id') tweetId: string): Promise<Tweet> {
    return this.tweetService.getTweet(tweetId);
  }
}
