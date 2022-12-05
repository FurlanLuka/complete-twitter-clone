import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '@twitr/api/utils/redis';
import { UserService } from '../user.service';
import { Relations } from './relations.entity';
import {
  FOLLOWER_CACHE,
  FOLLOWER_CACHE_EXPIRATION,
} from '@twitr/api/user/constants';

@Injectable()
export class RelationsService {
  constructor(
    @InjectRepository(Relations)
    private relationsRepository: Repository<Relations>,
    private userService: UserService,
    private redisService: RedisService
  ) {}

  public async follow(userId: string, handle: string): Promise<void> {
    const followeeUser = await this.userService.getUserByHandle(handle);

    if (followeeUser === null) {
      throw new BadRequestException();
    }

    const existingFollowRelation: Relations | null =
      await this.relationsRepository.findOneBy({
        userId,
        followeeId: followeeUser.uuid,
      });

    if (existingFollowRelation !== null) {
      return;
    }

    await this.relationsRepository.save({
      userId,
      followeeId: followeeUser.uuid,
    });

    await this.redisService
      .forConnection(FOLLOWER_CACHE)
      .setSet(followeeUser.uuid, [userId], FOLLOWER_CACHE_EXPIRATION);
  }

  public async getFollowees(userId: string): Promise<string[]> {
    const followRelations = await this.relationsRepository.findBy({
      userId,
    });

    const followeeList = followRelations.map(
      (followRelation: Relations) => followRelation.followeeId
    );

    return followeeList;
  }

  public async getFollowers(userId: string): Promise<string[]> {
    const followerList: string[] | null = await this.redisService
      .forConnection(FOLLOWER_CACHE)
      .getSet(userId);

    if (followerList !== null) {
      return followerList;
    }

    const followRelations: Relations[] = await this.relationsRepository.findBy({
      followeeId: userId,
    });

    if (followRelations.length === 0) {
      return [];
    }

    const followerIds: string[] = followRelations.map(
      (followRelation: Relations) => followRelation.userId
    );

    await this.redisService
      .forConnection(FOLLOWER_CACHE)
      .setSet(userId, followerIds, FOLLOWER_CACHE_EXPIRATION);

    return followerIds;
  }
}
