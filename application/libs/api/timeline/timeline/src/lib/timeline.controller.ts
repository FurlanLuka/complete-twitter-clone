import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Subscribe } from '@twitr/api/utils/queue';
import {
  REQUEST_TIMELINE_COMMAND,
  SERVICE_QUEUE_NAME,
  UPDATE_TIMELINE_COMMAND,
} from '@twitr/api/timeline/constants';
import { TimelineService } from './timeline.service';
import { RabbitPayload } from '@golevelup/nestjs-rabbitmq';
import {
  RequestTimelineCommandPayload,
  TimelineResponse,
  UpdateTimelineCommandPayload,
} from '@twitr/api/timeline/data-transfer-objects/types';
import { AuthenticationGuard } from '@twitr/api/user/authentication';

@Controller('/v1/timeline')
export class TimelineController {
  constructor(private timelineService: TimelineService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async getTimeline(
    @Req() req,
    @Param('page') page: string | undefined
  ): Promise<TimelineResponse> {
    const pageIndex = page ? Number(page) : 0;

    return this.timelineService.getTimeline(req.user.sub, pageIndex);
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

  @Subscribe(
    REQUEST_TIMELINE_COMMAND,
    TimelineQueueController.CONTROLLER_QUEUE_NAME
  )
  async requestTimelineHandler(
    @RabbitPayload() payload: RequestTimelineCommandPayload
  ): Promise<void> {
    const pageIndex = payload.page ? Number(payload.page) : 0;

    return this.timelineService.requestTimelineEventHandler(payload.userId, pageIndex);
  }
}
