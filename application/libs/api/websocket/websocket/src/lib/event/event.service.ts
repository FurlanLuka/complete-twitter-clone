import { Injectable } from '@nestjs/common';
import { TimelineResponse } from '@twitr/api/timeline-worker/data-transfer-objects';
import { WebsocketService } from '../websocket.service';

@Injectable()
export class WebSocketEventService {
  constructor(private websocketService: WebsocketService) {}

  public timelineUpdatedEventHandler(timeline: TimelineResponse): void {
    this.websocketService.send(timeline.userId, {
      name: 'TIMELINE_UPDATED',
      payload: timeline,
    });
  }
}
