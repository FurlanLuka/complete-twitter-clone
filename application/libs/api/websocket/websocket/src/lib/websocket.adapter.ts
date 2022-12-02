import { WsAdapter as BaseWsAdapter } from '@nestjs/platform-ws';
import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { WebSocketExtended } from './websocket.interfaces';
import { v4 } from 'uuid';

export class WsAdapter extends BaseWsAdapter {
  public bindClientConnect(
    server: WebSocketServer,
    callback: (
      client: WebSocketExtended,
      message: IncomingMessage,
      ...args: unknown[]
    ) => void
  ): void {
    return super.bindClientConnect(
      server,
      (client: WebSocketExtended, message: IncomingMessage, ...args) => {
        client.id = v4();

        callback(client, message, ...args);
      }
    );
  }
}
