import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { TWEET_CACHE } from '@twitr/api/tweet/constants';
import { RedisService } from '@twitr/api/utils/redis';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
    private redisService: RedisService
  ) {}

  async createTweet(author: string, tweet: string): Promise<Tweet> {
    const tweetRecord = await this.tweetRepository.save({
      tweet,
      author,
    });

    this.cacheTweet(tweetRecord);

    return tweetRecord;
  }

  async getTweet(id: string): Promise<Tweet> {
    const tweetString: string | null = await this.redisService
      .forConnection(TWEET_CACHE)
      .get(id);

    if (tweetString !== null) {
      return JSON.parse(tweetString);
    }

    const tweetRecord: Tweet = await this.tweetRepository.findOneBy({
      id,
    });

    this.cacheTweet(tweetRecord);

    return tweetRecord;
  }

  private cacheTweet(tweetRecord: Tweet): void {
    this.redisService
      .forConnection(TWEET_CACHE)
      .set(tweetRecord.id, JSON.stringify(tweetRecord, null, 0));
  }
}
