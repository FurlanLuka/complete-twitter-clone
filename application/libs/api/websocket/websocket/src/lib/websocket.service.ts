import { Injectable } from '@nestjs/common';
import { WEBSOCKET_TOKEN_CACHE } from '@twitr/api/websocket/constants';
import { RedisService } from '@twitr/api/utils/redis';
import { WebSocketExtended, WebSocketMessage } from './websocket.interfaces';
import { WebsocketTokenResponse } from './websocket.interfaces';
import { RmqService } from '@twitr/api/utils/queue';
import { REQUEST_TIMELINE_COMMAND } from '@twitr/api/timeline-worker/constants';
import * as crypto from 'crypto';

@Injectable()
export class WebsocketService {
  private connectedClients: Map<string, WebSocketExtended[]> = new Map();
  private userClientMapping: Map<string, string> = new Map();

  constructor(
    private redisService: RedisService,
    private rmqService: RmqService
  ) {}

  public async createAccessToken(
    userId: string
  ): Promise<WebsocketTokenResponse> {
    const accessToken = crypto.randomBytes(20).toString('hex');

    await this.redisService
      .forConnection(WEBSOCKET_TOKEN_CACHE)
      .set(accessToken, userId, 15);

    return {
      token: accessToken,
    };
  }

  public async connect(
    client: WebSocketExtended,
    token: string
  ): Promise<void> {
    const userId: string | null = await this.redisService
      .forConnection(WEBSOCKET_TOKEN_CACHE)
      .getAndDelete(token);

    if (userId === null) {
      client.terminate();
    }

    const userClientInstances = this.connectedClients.get(userId);

    if (userClientInstances === undefined) {
      this.connectedClients.set(userId, [client]);
    } else {
      this.connectedClients.set(userId, [...userClientInstances, client]);
    }

    this.userClientMapping.set(client.id, userId);

    this.requestDataPreload(userId);
  }

  public disconnect(client: WebSocketExtended): void {
    const userId: string | undefined = this.userClientMapping.get(client.id);

    if (userId === undefined) {
      return;
    }

    const userClientInstances: WebSocketExtended[] =
      this.connectedClients.get(userId);

    if (userClientInstances === undefined) {
      return;
    }

    this.connectedClients.set(
      userId,
      userClientInstances.filter((instance) => instance.id === client.id)
    );
  }

  public send(userId: string, message: WebSocketMessage): void {
    const userClientInstances = this.connectedClients.get(userId);

    userClientInstances.forEach((instance) =>
      instance.send(JSON.stringify(message))
    );
  }

  private requestDataPreload(userId: string): void {
    this.rmqService.publishEvent(REQUEST_TIMELINE_COMMAND, {
      userId,
    })
  }
}
