import RedisClient from 'ioredis';

export class Connection {
  private client: RedisClient;

  constructor(connectionUrl: string, private keyPrefix: string | undefined) {
    this.client = new RedisClient(connectionUrl);
  }

  public getClient(): RedisClient {
    return this.client;
  }

  public async set(
    key: string,
    value: string,
    expiration?: number
  ): Promise<void> {
    const cacheKey = `${this.keyPrefix}${key}`;

    if (expiration) {
      await this.client.setex(cacheKey, expiration, value);
    } else {
      await this.client.set(cacheKey, value);
    }
  }

  public async setSet(
    key: string,
    value: string[],
    expiration?: number
  ): Promise<void> {
    const cacheKey = `${this.keyPrefix}${key}`;

    if (expiration) {
      await this.client
        .multi()
        .sadd(cacheKey, value)
        .expire(cacheKey, expiration)
        .exec();
    } else {
      await this.client.sadd(cacheKey, value);
    }
  }

  public async pushToList(
    key: string,
    value: string[] | string,
    expiration?: number
  ): Promise<void> {
    const cacheKey = `${this.keyPrefix}${key}`;

    if (expiration) {
      await this.client
        .multi()
        .lpush(cacheKey, ...value)
        .expire(cacheKey, expiration)
        .exec();
    } else {
      await this.client.lpush(cacheKey, ...value);
    }
  }

  pu;

  public async getListLength(key: string): Promise<number> {
    const cacheKey = `${this.keyPrefix}${key}`;

    return this.client.llen(cacheKey);
  }

  public async getListRange(
    key: string,
    startIdx: number,
    endIdx: number
  ): Promise<string[] | null> {
    const cacheKey = `${this.keyPrefix}${key}`;

    try {
      return await this.client.lrange(cacheKey, startIdx, endIdx);
    } catch {
      return null;
    }
  }

  public async getList(key: string): Promise<string[] | null> {
    const cacheKey = `${this.keyPrefix}${key}`;

    try {
      return await this.client.lrange(cacheKey, 0, -1);
    } catch {
      return null;
    }
  }

  public async getSet(key: string): Promise<string[] | null> {
    const cacheKey = `${this.keyPrefix}${key}`;

    try {
      return await this.client.smembers(cacheKey);
    } catch {
      return null;
    }
  }

  public async get(key: string): Promise<string | null> {
    const cacheKey = `${this.keyPrefix}${key}`;

    try {
      return await this.client.get(cacheKey);
    } catch {
      return null;
    }
  }

  public async getMulti(keys: string[]): Promise<string[] | null> {
    const cacheKeys = keys.map((key) => `${this.keyPrefix}${key}`);

    try {
      return await this.client.mget(cacheKeys);
    } catch {
      return null;
    }
  }

  public async getAndDelete(key: string): Promise<string | null> {
    const cacheKey = `${this.keyPrefix}${key}`;

    try {
      return await this.client.getdel(cacheKey);
    } catch {
      return null;
    }
  }

  public async delete(key: string): Promise<void> {
    await this.client.del([`${this.keyPrefix}${key}`]);
  }
}
