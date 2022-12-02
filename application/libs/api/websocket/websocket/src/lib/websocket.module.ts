import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  imports: [],
  providers: [WebsocketService, WebsocketGateway],
  controllers: [WebsocketController],
  exports: [WebsocketService],
})
export class WebsocketModule {}
