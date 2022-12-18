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

  public async mset()

  public async addToSet(key: string, value: string[]): Promise<void> {
    const cacheKey = `${this.keyPrefix}${key}`;

    await this.client.sadd(cacheKey, value);
  }

  public async addToSetWithExpiration(
    key: string,
    value: string[],
    expiration: number
  ): Promise<void> {
    const cacheKey = `${this.keyPrefix}${key}`;

    await this.client
      .multi()
      .sadd(cacheKey, value)
      .expire(cacheKey, expiration)
      .exec();
  }

  public async addToList(key: string, value: string[]): Promise<void> {
    const cacheKey = `${this.keyPrefix}${key}`;

    await this.client.lpush(cacheKey, ...value);
  }

  public async addToListWithExpiration(
    key: string,
    value: string[],
    expiration: number
  ): Promise<void> {
    const cacheKey = `${this.keyPrefix}${key}`;

    await this.client
      .multi()
      .lpush(cacheKey, ...value)
      .expire(cacheKey, expiration)
      .exec();
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

  public async getListRangeWithExpiration(
    key: string,
    startIdx: number,
    endIdx: number,
    expiration: number
  ): Promise<string[] | null> {
    const cacheKey = `${this.keyPrefix}${key}`;

    const result = await this.client
      .multi()
      .lrange(cacheKey, startIdx, endIdx)
      .expire(cacheKey, expiration)
      .exec();

    if (result[0][0] !== null) {
      return null;
    }

    return result[0][1] as string[];

    // try {
    //   return await this.client.lrange(cacheKey, startIdx, endIdx);
    // } catch {
    //   return null;
    // }
  }

  public async exists(key: string): Promise<boolean> {
    const cacheKey = `${this.keyPrefix}${key}`;

    const exists = await this.client.exists(cacheKey);

    return exists === 1;
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

  public async getSetWithExpiration(
    key: string,
    expiration: number
  ): Promise<string[] | null> {
    const cacheKey = `${this.keyPrefix}${key}`;

    const result = await this.client
      .multi()
      .smembers(cacheKey)
      .expire(cacheKey, expiration)
      .exec();

    if (result[0][0] !== null) {
      return null;
    }

    return result[0][1] as string[];
  }

  public async getSetSize(key: string): Promise<number | null> {
    const cacheKey = `${this.keyPrefix}${key}`;

    try {
      return await this.client.scard(cacheKey);
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

  public async getHashValue(
    key: string,
    field: string,
  ): Promise<string | null> {
    const cacheKey = `${this.keyPrefix}${key}`;

    try {
      return await this.client.hget(cacheKey, field);
    } catch {
      return null;
    }
  }

  public async setHashField(
    key: string,
    field: string,
    value: string
  ): Promise<void> {
    const cacheKey = `${this.keyPrefix}${key}`;

    try {
      await this.client.hset(cacheKey, field, value);
    } catch {
      return;
    }
  }
}
