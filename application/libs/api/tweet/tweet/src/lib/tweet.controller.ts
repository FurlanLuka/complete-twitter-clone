import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TweetDto } from '@twitr/api/tweet/data-transfer-objects';
import { Tweet } from './tweet.entity';
import { TweetService } from './tweet.service';
import { AuthenticationGuard } from '@twitr/api/user/authentication';

@Controller('v1/tweet')
export class TweetController {
  constructor(private tweetService: TweetService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  async tweet(@Body() { tweet }: TweetDto, @Req() req): Promise<Tweet> {
    return this.tweetService.createTweet(req.user.sub, tweet);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  async getTweet(@Param('id') tweetId: string): Promise<Tweet> {
    return this.tweetService.getTweet(tweetId);
  }
}
