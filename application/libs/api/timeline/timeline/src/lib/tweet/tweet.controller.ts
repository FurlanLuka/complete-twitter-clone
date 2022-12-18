import { Controller } from '@nestjs/common';
import { Subscribe } from '@twitr/api/utils/queue';
import { SERVICE_QUEUE_NAME } from '@twitr/api/timeline/constants';
import { TWEET_UPDATED_TOPIC } from '@twitr/api/tweet/constants';
import { TweetService } from './tweet.service';
import { RabbitPayload } from '@golevelup/nestjs-rabbitmq';
import { TweetUpdatedPayload } from '@twitr/api/tweet/data-transfer-objects/types';

@Controller()
export class TweetQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-tweet`;

  constructor(private tweetService: TweetService) {}

  @Subscribe(TWEET_UPDATED_TOPIC, TweetQueueController.CONTROLLER_QUEUE_NAME)
  async tweetUpdatedEventHandler(
    @RabbitPayload() payload: TweetUpdatedPayload
  ): Promise<void> {
    return this.tweetService.tweetUpdatedEventHandler(payload);
  }
}
