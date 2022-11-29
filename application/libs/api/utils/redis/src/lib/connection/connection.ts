import RedisClient from 'ioredis';

export class Connection {
  private client: RedisClient;

  constructor(connectionUrl: string, private keyPrefix: string | undefined) {
    this.client = new RedisClient(connectionUrl);
  }

  public getClient(): RedisClient {
    return this.client;
  }

  public async set(key: string, value: string, expiration?: number) {
    const cacheKey = `${this.keyPrefix}${key}`;

    if (expiration) {
      await this.client.setex(cacheKey, expiration, value);
    } else {
      await this.client.set(cacheKey, value);
    }
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(`${this.keyPrefix}${key}`);
  }

  public async getAndDelete(key: string): Promise<string | null> {
    return this.client.getdel(`${this.keyPrefix}${key}`);
  }

  public async delete(key: string): Promise<void> {
    await this.client.del([`${this.keyPrefix}${key}`]);
  }
}
