import axios, { AxiosResponse } from 'axios';
import { API_URL, WS_URL } from '../../constants';
import { TIMELINE_EVENT } from '@twitr/api/timeline/constants';
import { timelineUpdatedEventHandler } from '../timeline/timeline-updated-event';

interface GetWebsocketTokenResponse {
  token: string;
}

export class WebsocketTokenError extends Error {}

type Handler = (data: any) => void;

export class Websocket {
  private connection: WebSocket | undefined;

  private handlers: Map<string, Handler> = new Map();

  constructor(private apiUrl: string, private websocketUrl: string) {
    this.handlers.set(
      TIMELINE_EVENT.getRoutingKey(),
      timelineUpdatedEventHandler
    );
  }

  public async connect(
    accessToken: string,
    onConnect: () => void,
    onDisconnect: () => void
  ): Promise<void> {
    try {
      const websocketToken: string = await this.getWebsocketToken(accessToken);

      this.connection = new WebSocket(
        `${this.websocketUrl}?token=${websocketToken}`
      );

      this.connection.onopen = onConnect;
      this.connection.onclose = onDisconnect;
      this.connection.onmessage = (m) => {
        const payload = JSON.parse(m.data);
        const handler = this.handlers.get(payload.key);

        if (handler) {
          handler(payload.payload);
        }
      };
      this.connection.onerror = (e) => console.log(e);
    } catch {
      onDisconnect();
    }
  }

  private async getWebsocketToken(accessToken: string): Promise<string> {
    try {
      const getWebsocketTokenResponse: AxiosResponse<GetWebsocketTokenResponse> =
        await axios.post(
          `${this.apiUrl}/v1/websockets/auth`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

      return getWebsocketTokenResponse.data.token;
    } catch {
      throw new WebsocketTokenError();
    }
  }

  public addHandler(id: string, handler: Handler): void {
    this.handlers.set(id, handler);
  }

  public removeHandler(id: string): void {
    this.handlers.delete(id);
  }
}

export const websocketInstance = new Websocket(API_URL, WS_URL);
