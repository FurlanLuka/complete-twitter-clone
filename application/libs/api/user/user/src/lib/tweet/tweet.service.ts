import { Injectable } from '@nestjs/common';
import { TweetUpdatedPayload } from '@twitr/api/tweet/data-transfer-objects/types';
import { RmqService } from '@twitr/api/utils/queue';
import { UPDATE_TIMELINE_COMMAND } from '@twitr/api/timeline-worker/constants';
import { RelationsService } from '../relations/relations.service';

@Injectable()
export class TweetService {
  static UPDATE_TIMELINE_BATCH_SIZE = 10;
  static FAMOUS_USER_THRESHOLD = 10_000;

  constructor(
    private rmqService: RmqService,
    private relationsService: RelationsService
  ) {}

  async tweetUpdatedEventHandler({
    tweet,
    author,
  }: TweetUpdatedPayload): Promise<void> {
    const followers: string[] = await this.relationsService.getFollowers(
      author
    );

    const usersToBeUpdated: string[] = [...followers, author];

    for (
      let i = 0;
      i < usersToBeUpdated.length;
      i += TweetService.UPDATE_TIMELINE_BATCH_SIZE
    ) {
      const userIds = usersToBeUpdated.splice(
        i,
        i + TweetService.UPDATE_TIMELINE_BATCH_SIZE
      );
      this.rmqService.publishEvent(UPDATE_TIMELINE_COMMAND, {
        tweetId: tweet.id,
        userIds,
      });
    }
  }
}
