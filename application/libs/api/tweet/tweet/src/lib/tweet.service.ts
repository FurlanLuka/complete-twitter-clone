import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { TWEET_UPDATED_TOPIC } from '@twitr/api/tweet/constants';
import { RmqService } from '@twitr/api/utils/queue';
import {
  GetTweetResponse,
  GetTweetsResponse,
} from '@twitr/api/tweet/data-transfer-objects/types';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
    private rmqService: RmqService
  ) {}

  async createTweet(author: string, tweet: string): Promise<GetTweetResponse> {
    const tweetRecord = await this.tweetRepository.save({
      tweet,
      author,
    });

    const normalizedRecord = {
      ...tweetRecord,
      createdAt: tweetRecord.createdAt.getTime(),
    };

    this.rmqService.publishEvent(TWEET_UPDATED_TOPIC, {
      tweet: normalizedRecord,
      author,
    });

    return normalizedRecord;
  }

  async getTweet(id: string): Promise<GetTweetResponse> {
    const tweetRecord: Tweet | null = await this.tweetRepository.findOneBy({
      id,
    });

    if (tweetRecord == null) {
      throw new NotFoundException();
    }

    return {
      ...tweetRecord,
      createdAt: tweetRecord.createdAt.getTime(),
    };
  }

  async getUserTweets(
    userIds: string[],
    olderThan?: string
  ): Promise<GetTweetsResponse> {
    const response = await this.tweetRepository.find({
      where: {
        author: In(userIds),
        createdAt: olderThan ? LessThan(new Date(olderThan)) : undefined,
      },
      take: 100,
      order: { createdAt: 'DESC' },
    });

    return response.map((tweet) => ({
      ...tweet,
      createdAt: tweet.createdAt.getTime(),
    }));
  }
}
