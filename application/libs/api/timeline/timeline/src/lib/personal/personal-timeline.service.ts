import { Injectable } from '@nestjs/common';
import { RedisService } from '@twitr/api/utils/redis';
import { UpdatePersonalTimelineCommandHandler } from '@twitr/api/timeline/data-transfer-objects/types';

@Injectable()
export class PersonalTimelineService {
  constructor(private redisService: RedisService) {}

  async updatePersonalTimelineCommandHandler({
    userId,
    tweetId,
  }: UpdatePersonalTimelineCommandHandler): Promise<void> {
    return;
  }
}
