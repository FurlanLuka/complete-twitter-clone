import { Injectable } from '@nestjs/common';
import { RedisService } from '@twitr/api/utils/redis';
import { UpdateTimelineCommandPayload } from '@twitr/api/timeline-worker/data-transfer-objects';
import { TIMELINE_CACHE } from '@twitr/api/timeline-worker/constants';
import { TweetService } from './tweet/tweet.service';
import {
  GetTweetIdsPayload,
  GetTweetIdsResponse,
  TweetDto,
} from '@twitr/api/tweet/data-transfer-objects';
import { RmqService } from '@twitr/api/utils/queue';
import { GET_FOLLOWEES_RPC } from '@twitr/api/user/constants';
import {
  GetFolloweesPayload,
  GetFolloweesResponse,
} from '@twitr/api/user/data-transfer-objects';
import { GET_TWEET_IDS_FOR_USER_IDS } from '@twitr/api/tweet/constants';

@Injectable()
export class TimelineService {
  static ITEMS_PER_PAGE = 30;

  constructor(
    private redisService: RedisService,
    private tweetService: TweetService,
    private rmqService: RmqService
  ) {}

  async updateTimelineCommandHandler({
    tweetId,
    userIds,
  }: UpdateTimelineCommandPayload): Promise<void> {
    await Promise.all(
      userIds.map(async (userId: string) => {
        this.redisService
          .forConnection(TIMELINE_CACHE)
          .pushToList(userId, tweetId);
      })
    );
  }

  async getTimeline(userId: string): Promise<TweetDto[]> {
    const userTimeline: string[] | null = await this.redisService
      .forConnection(TIMELINE_CACHE)
      .getList(userId);

    if (userTimeline) {
      return this.tweetService.getTweets(userTimeline);
    }

    const timeline: string[] = await this.requestTimelineSync(userId);

    return this.tweetService.getTweets(timeline);
  }

  async requestTimelineSync(userId: string): Promise<string[]> {
    const followees: string[] = await this.rmqService.request<
      GetFolloweesResponse,
      GetFolloweesPayload
    >(GET_FOLLOWEES_RPC, {
      userId,
    });

    const tweets: string[] = await this.rmqService.request<
      GetTweetIdsResponse,
      GetTweetIdsPayload
    >(GET_TWEET_IDS_FOR_USER_IDS, {
      userIds: [...followees, userId],
    });

    return tweets;
  }
}
