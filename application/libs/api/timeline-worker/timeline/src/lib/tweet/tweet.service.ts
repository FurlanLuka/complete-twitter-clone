import { Injectable } from '@nestjs/common';
import {
  TweetDto,
  TweetUpdatedPayload,
} from '@twitr/api/tweet/data-transfer-objects/types';
import { TWEET_CACHE } from '@twitr/api/timeline-worker/constants';
import { RedisService } from '@twitr/api/utils/redis';

@Injectable()
export class TweetService {
  constructor(private redisService: RedisService) {}

  async tweetUpdatedEventHandler({
    tweet,
  }: TweetUpdatedPayload): Promise<void> {
    this.redisService
      .forConnection(TWEET_CACHE)
      .set(tweet.id, JSON.stringify(tweet, null, 0));
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
