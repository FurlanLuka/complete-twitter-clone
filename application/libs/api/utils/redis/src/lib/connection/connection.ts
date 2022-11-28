import RedisClient from 'ioredis';

export class Connection {
  private client: RedisClient;

  constructor(connectionUrl: string, private keyPrefix: string) {
    this.client = new RedisClient(connectionUrl);
  }

  getClient(): RedisClient {
    return this.client;
  }
}
