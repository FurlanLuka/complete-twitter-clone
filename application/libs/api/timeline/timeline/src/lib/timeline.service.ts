import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GetTimelinePageResponse,
  UpdateTimelineCommandPayload,
} from '@twitr/api/timeline/data-transfer-objects/types';
import { TIMELINE_CACHE } from '@twitr/api/timeline/constants';
import { TweetService } from './tweet/tweet.service';
import {
  GetUserTweetsPayload,
  GetTweetIdsResponse,
} from '@twitr/api/tweet/data-transfer-objects/types';
import { RmqService } from '@twitr/api/utils/queue';
import { GET_FOLLOWEES_RPC } from '@twitr/api/user/constants';
import {
  GetFolloweesPayload,
  GetFolloweesResponse,
} from '@twitr/api/user/data-transfer-objects/types';
import { GET_USER_TWEETS } from '@twitr/api/tweet/constants';
import { TimelineCacheService } from './timeline-cache.service';
import { GetTweetsResponse } from './timeline-cache.interfaces';

@Injectable()
export class TimelineService {
  static ITEMS_PER_PAGE = 30;

  constructor(
    private tweetService: TweetService,
    private rmqService: RmqService,
    private timelineCacheService: TimelineCacheService
  ) {}

  async updateTimelineCommandHandler({
    tweet,
    userIds,
  }: UpdateTimelineCommandPayload): Promise<void> {
    await Promise.all(
      userIds.map(async (userId: string) => {
        this.timelineCacheService.addNewTweet(tweet, userId);
      })
    );
  }

  async getFirstTimelinePage(userId: string): Promise<GetTimelinePageResponse> {
    const tweetsPageResponse: GetTweetsResponse | null =
      await this.timelineCacheService.getLatestTweets(userId);

    if (tweetsPageResponse === null) {
      throw new NotFoundException();
    }

    return {
      pageName: tweetsPageResponse.pageName,
      tweets: await this.tweetService.getTweets(tweetsPageResponse.tweets),
    };
  }

  async getPreviousTimelinePage(
    userId: string,
    basePageName: string
  ): Promise<GetTimelinePageResponse> {
    const tweetsPageResponse: GetTweetsResponse | null =
      await this.timelineCacheService.getPreviousTweetPage(
        userId,
        basePageName
      );

    if (tweetsPageResponse === null) {
      throw new NotFoundException();
    }

    return {
      pageName: tweetsPageResponse.pageName,
      tweets: await this.tweetService.getTweets(tweetsPageResponse.tweets),
    };
  }

  async getNextTimelinePage(
    userId: string,
    basePageName: string
  ): Promise<GetTimelinePageResponse> {
    const tweetsPageResponse: GetTweetsResponse | null =
      await this.timelineCacheService.getNextTweetPage(userId, basePageName);

    if (tweetsPageResponse === null) {
      throw new NotFoundException();
    }

    return {
      pageName: tweetsPageResponse.pageName,
      tweets: await this.tweetService.getTweets(tweetsPageResponse.tweets),
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
      GetUserTweetsPayload
    >(GET_USER_TWEETS, {
      userIds: [...followees, userId],
    });

    this.redisService.forConnection(TIMELINE_CACHE).pushToList(userId, tweets);

    return tweets;
  }

  // async requestTimelineEventHandler(
  //   userId: string,
  //   pageIndex: number
  // ): Promise<void> {
  //   const timeline = await this.getTimeline(userId, pageIndex);

  //   this.rmqService.publishEvent(TIMELINE_EVENT, timeline);
  // }
}
