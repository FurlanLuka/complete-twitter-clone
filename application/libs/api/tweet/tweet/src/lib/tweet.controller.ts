import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateTweetDto,
  GetTweetIdsPayload,
  GetTweetIdsResponse,
} from '@twitr/api/tweet/data-transfer-objects';
import { Tweet } from './tweet.entity';
import { TweetService } from './tweet.service';
import { AuthenticationGuard } from '@twitr/api/user/authentication';
import {
  GET_TWEET_IDS_FOR_USER_IDS,
  SERVICE_QUEUE_NAME,
} from '@twitr/api/tweet/constants';
import { Rpc, RPCResponse, RPCResponseType } from '@twitr/api/utils/queue';

@Controller('v1/tweet')
export class TweetController {
  constructor(private tweetService: TweetService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  async tweet(@Body() { tweet }: CreateTweetDto, @Req() req): Promise<Tweet> {
    return this.tweetService.createTweet(req.user.sub, tweet);
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  async getTweet(@Param('id') tweetId: string): Promise<Tweet> {
    return this.tweetService.getTweet(tweetId);
  }
}

@Controller()
export class TweetQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}_tweet`;

  constructor(private tweetService: TweetService) {}

  @Rpc(GET_TWEET_IDS_FOR_USER_IDS, TweetQueueController.CONTROLLER_QUEUE_NAME)
  async getTweetIdsForUserIds(
    payload: GetTweetIdsPayload
  ): Promise<RPCResponse<GetTweetIdsResponse>> {
    try {
      const data = await this.tweetService.getTweetIdsForUserIds(
        payload.userIds
      );

      return {
        type: RPCResponseType.SUCCESS,
        data,
      };
    } catch (error) {
      return {
        type: RPCResponseType.ERROR,
        message: error.message ?? 'INTERNAL_SERVER_EXCEPTION',
      };
    }
  }
}
