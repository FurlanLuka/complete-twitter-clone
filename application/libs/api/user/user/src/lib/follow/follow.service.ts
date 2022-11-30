import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '@twitr/api/utils/redis';
import { UserService } from '../user.service';
import { Follow } from './follow.entity';
import {
  FOLLOWER_CACHE,
  FOLLOWER_CACHE_EXPIRATION,
} from '@twitr/api/user/constants';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
    private userService: UserService,
    private redisService: RedisService
  ) {}

  public async follow(userId: string, handle: string): Promise<void> {
    const followeeUser = await this.userService.getUserByHandle(handle);

    if (followeeUser === null) {
      throw new BadRequestException();
    }

    const existingFollowRelation: Follow | null =
      await this.followRepository.findOneBy({
        userId,
        followeeId: followeeUser.uuid,
      });

    if (existingFollowRelation !== null) {
      return;
    }

    await this.followRepository.save({
      userId,
      followeeId: followeeUser.uuid,
    });

    await this.redisService
      .forConnection(FOLLOWER_CACHE)
      .setSet(userId, [followeeUser.uuid], FOLLOWER_CACHE_EXPIRATION);
  }

  public async getFollowees(userId: string): Promise<string[]> {
    const followeeList: string[] | null = await this.redisService
      .forConnection(FOLLOWER_CACHE)
      .getSet(userId);

    if (followeeList === null) {
      const followRelations = await this.followRepository.findBy({
        userId,
      });

      const followeeIds = followRelations.map(
        (followRelation: Follow) => followRelation.followeeId
      );

      await this.redisService
        .forConnection(FOLLOWER_CACHE)
        .setSet(userId, followeeIds, FOLLOWER_CACHE_EXPIRATION);
    }

    return followeeList;
  }
}
