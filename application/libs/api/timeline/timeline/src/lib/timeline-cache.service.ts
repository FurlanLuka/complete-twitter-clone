import { Injectable } from '@nestjs/common';
import { RedisService } from '@twitr/api/utils/redis';
import { TweetDto } from '@twitr/api/tweet/data-transfer-objects/types';
import {
  TIMELINE_CACHE,
  TIMELINE_PAGE_CACHE,
} from '@twitr/api/timeline/constants';
import {
  AddTweetsResponse,
  GetTweetsResponse,
} from './timeline-cache.interfaces';

@Injectable()
export class TimelineCacheService {
  static CACHE_EXPIRY_TIME = 24 * 60 * 60;
  static TWEETS_PER_PAGE = 30;

  constructor(private redisService: RedisService) {}

  public async getLatestTweets(
    userId: string
  ): Promise<GetTweetsResponse | null> {
    const firstTimelinePage: string | null = await this.getFirstTimelinePage(
      userId
    );

    if (firstTimelinePage === null) {
      return null;
    }

    const tweets: string[] = await this.getTweetPage(userId, firstTimelinePage);

    return {
      tweets,
      pageName: firstTimelinePage,
    };
  }

  public async getNextTweetPage(
    userId: string,
    basePageName: string
  ): Promise<GetTweetsResponse | null> {
    const timeline: string[] | null = await this.getTimeline(userId);

    if (timeline === null) {
      return null;
    }

    const basePageIndex: number = timeline.indexOf(basePageName);
    const nextPageIndex: number = basePageIndex - 1;

    if (nextPageIndex < 0) {
      return null;
    }

    const pageName: string = timeline[nextPageIndex];

    const tweets: string[] = await this.getTweetPage(userId, pageName);

    return {
      tweets,
      pageName: pageName,
    };
  }

  public async getPreviousTweetPage(
    userId: string,
    basePageName: string
  ): Promise<GetTweetsResponse | null> {
    const timeline: string[] | null = await this.getTimeline(userId);

    if (timeline === null) {
      return null;
    }

    const basePageIndex: number = timeline.indexOf(basePageName);
    const nextPageIndex: number = basePageIndex + 1;

    if (timeline.length > nextPageIndex) {
      return null;
    }

    const pageName: string = timeline[nextPageIndex];

    const tweets: string[] = await this.getTweetPage(userId, pageName);

    return {
      tweets,
      pageName: pageName,
    };
  }

  public async addNewTweet(
    tweet: TweetDto,
    userId: string
  ): Promise<AddTweetsResponse> {
    const firstTimelinePage: string | null = await this.getFirstTimelinePage(
      userId
    );

    if (firstTimelinePage === null) {
      return this.createTweetPage(
        [tweet.id],
        tweet.createdAt.toString(),
        userId
      );
    }

    const tweetPageSize: number | null = await this.getTweetPageSize(
      userId,
      firstTimelinePage
    );

    if (
      tweetPageSize === null ||
      tweetPageSize < TimelineCacheService.TWEETS_PER_PAGE
    ) {
      return this.addToTweetPage([tweet.id], firstTimelinePage, userId);
    }

    return this.createTweetPage([tweet.id], tweet.createdAt.toString(), userId);
  }

  public async loadTweets(
    tweets: TweetDto[],
    userId: string
  ): Promise<AddTweetsResponse[]> {
    const timeline: string[] | null = await this.getTimeline(userId);

    if (timeline === null) {
      return this.loadTweetsToNewPages(tweets, userId);
    }

    const orderedTimeline: string[] = timeline.sort(
      (first, second) => Number(second) - Number(first)
    );

    const { pageTweetMap, remainingTweets } = orderedTimeline.reduce(
      (value, currentValue) => {
        const bottomLimit = Number(currentValue);

        const [filtered, remaining] = value.remainingTweets.reduce(
          (result: [TweetDto[], TweetDto[]], tweet) => {
            if (
              tweet.createdAt < value.previousBottomLimit &&
              tweet.createdAt > bottomLimit
            ) {
              return [[...result[0], tweet], [...result[1]]];
            } else {
              return [[...result[0]], [...result[1], tweet]];
            }
          },
          [[], []]
        );

        value.pageTweetMap.set(currentValue, filtered);

        return {
          previousBottomLimit: bottomLimit,
          pageTweetMap: value.pageTweetMap,
          remainingTweets: remaining,
        };
      },
      {
        previousBottomLimit: Infinity,
        pageTweetMap: new Map<string, TweetDto[]>(),
        remainingTweets: tweets,
      }
    );

    const addToPageResponse: AddTweetsResponse[] = await Promise.all(
      Array.from(pageTweetMap.keys()).map(async (key: string) => {
        const tweets: TweetDto[] = pageTweetMap.get(key);

        return this.addToTweetPage(
          tweets.map((tweet) => tweet.id),
          key,
          userId
        );
      })
    );

    if (remainingTweets.length > 0) {
      const loadTweetsToNewPagesResponse: AddTweetsResponse[] =
        await this.loadTweetsToNewPages(remainingTweets, userId);

      return [...addToPageResponse, ...loadTweetsToNewPagesResponse];
    }

    return addToPageResponse;
  }

  private async loadTweetsToNewPages(
    tweets: TweetDto[],
    userId: string
  ): Promise<AddTweetsResponse[]> {
    const sortedTweets: TweetDto[] = tweets.sort(
      (first, second) => second.createdAt - first.createdAt
    );

    const maximumChunks = Math.ceil(
      sortedTweets.length / TimelineCacheService.TWEETS_PER_PAGE
    );

    return Promise.all(
      Array.from(Array(maximumChunks).keys()).map(async (_, index) => {
        const startIdx = index * TimelineCacheService.TWEETS_PER_PAGE;
        const endIdx = startIdx + TimelineCacheService.TWEETS_PER_PAGE;

        const tweetChunk: TweetDto[] = tweets.slice(startIdx, endIdx);
        const pageName: string = tweetChunk.at(-1).createdAt.toString();

        return this.createTweetPage(
          tweetChunk.map((tweet) => tweet.id),
          pageName,
          userId
        );
      })
    );
  }

  private async getTimeline(userId: string): Promise<string[] | null> {
    return this.redisService.forConnection(TIMELINE_CACHE).getList(userId);
  }

  private async getFirstTimelinePage(userId: string): Promise<string | null> {
    const timeline: string[] | null = await this.redisService
      .forConnection(TIMELINE_CACHE)
      .getListRange(userId, 0, 1);

    if (timeline === null) {
      return null;
    }

    return timeline[0];
  }

  private async getTweetPage(
    userId: string,
    tweetPageName: string
  ): Promise<string[]> {
    return this.redisService
      .forConnection(TIMELINE_PAGE_CACHE)
      .getSet(`${userId}-${tweetPageName}`);
  }

  private async getTweetPageSize(
    userId: string,
    tweetPageName: string
  ): Promise<number | null> {
    return this.redisService
      .forConnection(TIMELINE_PAGE_CACHE)
      .getSetSize(`${userId}-${tweetPageName}`);
  }

  private async addToTweetPage(
    tweets: string[],
    tweetPageName: string,
    userId: string
  ): Promise<AddTweetsResponse> {
    await this.redisService
      .forConnection(TIMELINE_PAGE_CACHE)
      .addToSet(`${userId}-${tweetPageName}`, tweets);

    return {
      pageName: tweetPageName,
      tweets,
    };
  }

  private async createTweetPage(
    tweets: string[],
    tweetPageName: string,
    userId: string
  ): Promise<AddTweetsResponse> {
    await this.addToTweetPage(tweets, tweetPageName, userId);

    await this.redisService
      .forConnection(TIMELINE_CACHE)
      .addToList(userId, [tweetPageName]);

    return {
      pageName: tweetPageName,
      tweets,
    };
  }
}
