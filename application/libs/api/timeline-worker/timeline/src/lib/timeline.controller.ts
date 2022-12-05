import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Subscribe } from '@twitr/api/utils/queue';
import {
  SERVICE_QUEUE_NAME,
  UPDATE_TIMELINE_COMMAND,
} from '@twitr/api/timeline-worker/constants';
import { TimelineService } from './timeline.service';
import { RabbitPayload } from '@golevelup/nestjs-rabbitmq';
import { UpdateTimelineCommandPayload } from '@twitr/api/timeline-worker/data-transfer-objects';
import { AuthenticationGuard } from '@twitr/api/user/authentication';
import { TweetDto } from '@twitr/api/tweet/data-transfer-objects';

@Controller('/v1/timeline')
export class TimelineController {
  constructor(private timelineService: TimelineService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async getTimeline(@Req() req): Promise<TweetDto[]> {
    return this.timelineService.getTimeline(req.user.sub);
  }
}

@Controller()
export class TimelineQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-timeline`;

  constructor(private timelineService: TimelineService) {}

  @Subscribe(
    UPDATE_TIMELINE_COMMAND,
    TimelineQueueController.CONTROLLER_QUEUE_NAME
  )
  async tweetUpdatedEventHandler(
    @RabbitPayload() payload: UpdateTimelineCommandPayload
  ): Promise<void> {
    return this.timelineService.updateTimelineCommandHandler(payload);
  }
}
