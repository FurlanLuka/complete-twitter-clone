import { Injectable } from '@nestjs/common';
import { TimelineResponse } from '@twitr/api/timeline-worker/data-transfer-objects/types';
import { TIMELINE_EVENT } from '@twitr/api/timeline-worker/constants';
import { WebsocketService } from '../websocket.service';

@Injectable()
export class WebSocketEventService {
  constructor(private websocketService: WebsocketService) {}

  public timelineUpdatedEventHandler(timeline: TimelineResponse): void {
    this.websocketService.send(timeline.userId, {
      key: TIMELINE_EVENT.getRoutingKey(),
      payload: timeline,
    });
  }
}
