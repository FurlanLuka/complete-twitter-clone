import { Module } from '@nestjs/common';
import { WebsocketModule } from '../websocket.module';
import { WebsocketEventController } from './event.controller';
import { WebSocketEventService } from './event.service';

@Module({
  imports: [WebsocketModule],
  controllers: [WebsocketEventController],
  providers: [WebSocketEventService],
})
export class WebsocketEventModule {}
