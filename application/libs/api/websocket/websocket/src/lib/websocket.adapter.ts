import { WsAdapter as BaseWsAdapter } from '@nestjs/platform-ws';
import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { WebSocketExtended } from './websocket.interfaces';
import { v4 } from 'uuid';

export class WsAdapter extends BaseWsAdapter {
  private PING_INTERVAL = 25_000;
  private PING_TIMEOUT = 30_000;

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

        this.setPingInterval(client);

        client.on('pong', () => {
          this.setPingInterval(client);
        });

        callback(client, message, ...args);
      }
    );
  }

  private setPingInterval(client: WebSocketExtended): void {
    this.clearPingTimeout(client);

    client.pingInterval = setTimeout(() => {
      client.ping();
      this.resetPingTimeout(client);
    }, this.PING_INTERVAL);
  }

  private resetPingTimeout(client: WebSocketExtended): void {
    this.clearPingTimeout(client);

    client.pingTimeout = setTimeout(() => {
      if (
        client.readyState !== client.CLOSING &&
        client.readyState !== client.CLOSED
      ) {
        client.terminate();
      }
    }, this.PING_TIMEOUT);
  }

  private clearPingTimeout(client: WebSocketExtended): void {
    clearTimeout(client.pingTimeout);
  }
}
