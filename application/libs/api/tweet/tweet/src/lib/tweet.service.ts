import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { TWEET_UPDATED_TOPIC } from '@twitr/api/tweet/constants';
import { RmqService } from '@twitr/api/utils/queue';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
    private rmqService: RmqService
  ) {}

  async createTweet(author: string, tweet: string): Promise<Tweet> {
    const tweetRecord = await this.tweetRepository.save({
      tweet,
      author,
    });

    this.rmqService.publishEvent(TWEET_UPDATED_TOPIC, {
      tweet: tweetRecord,
      author,
    });

    return tweetRecord;
  }

  async getTweet(id: string): Promise<Tweet> {
    const tweetRecord: Tweet | null = await this.tweetRepository.findOneBy({
      id,
    });

    if (tweetRecord == null) {
      throw new NotFoundException();
    }

    return tweetRecord;
  }

  async getTweetIdsForUserIds(userIds: string[]): Promise<string[]> {
    const results = await this.tweetRepository.find({
      where: {
        author: In(userIds),
      },
      take: 500,
      order: { createdAt: 'DESC' },
    });

    return results.map((tweet) => tweet.id);
  }
}
