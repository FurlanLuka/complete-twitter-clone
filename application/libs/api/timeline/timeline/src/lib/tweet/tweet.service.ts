import { Injectable } from '@nestjs/common';
import {
  GetUserTweetsPayload,
  TweetDto,
  TweetUpdatedPayload,
} from '@twitr/api/tweet/data-transfer-objects/types';
import { TWEET_CACHE } from '@twitr/api/timeline/constants';
import { RedisService } from '@twitr/api/utils/redis';
import { RmqService } from '@twitr/api/utils/queue';
import { GetTweetsResponse } from '../timeline-cache.interfaces';
import { GET_USER_TWEETS } from '@twitr/api/tweet/constants';

@Injectable()
export class TweetService {
  constructor(
    private redisService: RedisService,
    private rmqService: RmqService
  ) {}

  async tweetUpdatedEventHandler({
    tweet,
  }: TweetUpdatedPayload): Promise<void> {
    this.redisService
      .forConnection(TWEET_CACHE)
      .set(tweet.id, JSON.stringify(tweet, null, 0));
  }

  async cacheTweet(tweet): Promise<void> {}

  async requestUserTweetsSync(userIds: string[]): Promise<void> {
    const tweets: GetTweetsResponse = await this.rmqService.request<
      GetTweetsResponse,
      GetUserTweetsPayload
    >(GET_USER_TWEETS, {
      userIds: userIds,
    });
  }

  async getTweets(ids: string[]): Promise<TweetDto[] | null> {
    const tweets: string[] | null = await this.redisService
      .forConnection(TWEET_CACHE)
      .getMulti(ids);

    if (tweets !== null) {
      return tweets.map((tweet) => JSON.parse(tweet));
    }

    // request tweet here

    return null;
  }
}
