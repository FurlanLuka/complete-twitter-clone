import { WebSocket } from 'ws';

export class WebSocketExtended extends WebSocket {
  id: string;
}

export interface WebsocketTokenResponse {
  token: string;
}

export interface WebSocketMessage {
  key: string;
  payload: unknown;
}