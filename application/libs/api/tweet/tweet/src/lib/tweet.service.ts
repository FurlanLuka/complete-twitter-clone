import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>
  ) {}

  async createTweet(author: string, tweet: string): Promise<void> {
    await this.tweetRepository.save({
      tweet,
      author,
    });
  }
}
