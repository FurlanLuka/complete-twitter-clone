import { WebSocket } from 'ws';

export class WebSocketExtended extends WebSocket {
  id: string;
  pingInterval: NodeJS.Timer;
  pingTimeout: NodeJS.Timer;
}

export interface WebsocketTokenResponse {
  token: string;
}

export interface WebSocketMessage {
  key: string;
  payload: unknown;
}