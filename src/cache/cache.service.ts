import KeyvRedis, { Keyv } from '@keyv/redis';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CacheManagerStore, createCache } from 'cache-manager';

@Injectable()
export class CacheService implements OnModuleInit {
  private cache: any;
  private readonly config: { redis?: { host: string; port: number } };

  constructor(config: { redis?: { host: string; port: number } }) {
    this.config = config;
  }

  async onModuleInit() {
    this.cache = await createCache({
      stores: [
        //  Redis Store
        new Keyv({
          store: new KeyvRedis(`redis://${this.config.redis?.host}:${this.config.redis?.port}`),
        }),
      ],
    });
  }

  async resolve<T>(key: string, resolver: () => Promise<any>, ttl?: number): Promise<Awaited<T>> {
    const cached = await this.cache.get(key);
    if (cached) {
      return cached;
    } else {
      const result = await resolver();
      await this.cache.set(key, result, ttl ? ttl * 1000 : undefined);
      return result;
    }
  }

  async invalidate(key: string) {
    await this.cache.del(key);
  }
}
