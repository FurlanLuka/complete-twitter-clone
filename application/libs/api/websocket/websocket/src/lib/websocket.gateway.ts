import { WebSocketGateway } from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { WebSocketExtended } from './websocket.interfaces';
import { WebsocketService } from './websocket.service';
import * as queryString from 'query-string';

@WebSocketGateway({
  transports: ['websocket'],
})
export class WebsocketGateway {
  constructor(private websocketService: WebsocketService) {}

  handleDisconnect(client: WebSocketExtended): void {
    this.websocketService.disconnect(client);
  }

  async handleConnection(
    client: WebSocketExtended,
    message: IncomingMessage
  ): Promise<void> {
    const parsedUrl = (<string>message.url).replace('/', '').replace('?', '');
    const queryParams: Record<string, unknown> = queryString.parse(parsedUrl);

    if (
      queryParams.token === undefined &&
      typeof queryParams.token !== 'string'
    ) {
      client.terminate();
      return;
    }

    await this.websocketService.connect(client, queryParams.token as string);
  }
}
