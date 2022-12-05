import { RabbitPayload } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { TimelineResponse } from '@twitr/api/timeline-worker/data-transfer-objects/types';
import {
  SERVICE_QUEUE_NAME,
  TIMELINE_EVENT,
} from '@twitr/api/timeline-worker/constants';
import { Subscribe } from '@twitr/api/utils/queue';
import { WebSocketEventService } from './event.service';

@Controller()
export class WebsocketEventController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-websocket`;

  constructor(private websocketEventService: WebSocketEventService) {}

  @Subscribe(TIMELINE_EVENT, WebsocketEventController.CONTROLLER_QUEUE_NAME)
  timelineUpdatedEventHandler(
    @RabbitPayload() payload: TimelineResponse
  ): void {
    return this.websocketEventService.timelineUpdatedEventHandler(payload);
  }
}
