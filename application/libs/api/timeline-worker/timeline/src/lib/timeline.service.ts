import { Injectable } from '@nestjs/common';
import { RedisService } from '@twitr/api/utils/redis';
import {
  TimelineResponse,
  UpdateTimelineCommandPayload,
} from '@twitr/api/timeline-worker/data-transfer-objects/types';
import {
  REQUEST_TIMELINE_COMMAND,
  TIMELINE_CACHE,
  TIMELINE_EVENT,
} from '@twitr/api/timeline-worker/constants';
import { TweetService } from './tweet/tweet.service';
import {
  GetTweetIdsPayload,
  GetTweetIdsResponse,
} from '@twitr/api/tweet/data-transfer-objects/types';
import { RmqService } from '@twitr/api/utils/queue';
import { GET_FOLLOWEES_RPC } from '@twitr/api/user/constants';
import {
  GetFolloweesPayload,
  GetFolloweesResponse,
} from '@twitr/api/user/data-transfer-objects/types';
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
          .pushToList(userId, [tweetId]);

        this.rmqService.publishEvent(REQUEST_TIMELINE_COMMAND, {
          userId,
        });
      })
    );
  }

  async getTimeline(userId: string): Promise<TimelineResponse> {
    const userTimeline: string[] | null = await this.redisService
      .forConnection(TIMELINE_CACHE)
      .getList(userId);

    if (userTimeline) {
      return {
        tweets: await this.tweetService.getTweets(userTimeline),
        userId,
      };
    }

    const timeline: string[] = await this.requestTimelineSync(userId);

    return {
      tweets: await this.tweetService.getTweets(timeline),
      userId,
    };
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

    this.redisService.forConnection(TIMELINE_CACHE).pushToList(userId, tweets);

    return tweets;
  }

  async requestTimelineEventHandler(userId: string): Promise<void> {
    const timeline = await this.getTimeline(userId);

    this.rmqService.publishEvent(TIMELINE_EVENT, timeline);
  }
}
