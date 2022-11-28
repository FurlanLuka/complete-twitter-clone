import { Body, Controller, Post } from '@nestjs/common';
import { TweetDto } from '@twitr/api/tweet/data-transfer-objects';
import { TweetService } from './tweet.service';

@Controller('v1/tweet')
export class TweetController {
  constructor(private tweetService: TweetService) {}

  @Post()
  async tweet(@Body() { author, tweet }: TweetDto): Promise<void> {
    return this.tweetService.createTweet(author, tweet);
  }
}
