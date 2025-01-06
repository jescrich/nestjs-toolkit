import KeyvRedis, { Keyv } from '@keyv/redis';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CacheManagerStore, createCache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private cache: any;
  private readonly config: { redis?: { host: string; port: number } };

  constructor(config: { redis?: { host: string; port: number } }) {
    this.config = config;
    this.logger.log(`Initializing Cache Service: ${this.config.redis?.host}:${this.config.redis?.port}`);
    this.cache = createCache({
      stores: [
        //  Redis Store
        new Keyv({
          store: new KeyvRedis(`redis://${this.config.redis?.host}:${this.config.redis?.port}`),
        }),
      ],
    });
    
    this.cache.on('error', (error: any) => {
      this.logger.error('Cache Error', error);
    });
    this.cache.on('reconnecting', () => {
      this.logger.warn('Cache Reconnecting');
    });
    this.cache.on('connected', () => {
      this.logger.log('Cache Connected');
    });
    this.cache.on('disconnected', () => {
      this.logger.warn('Cache Disconnected');
    });
    this.cache.on('ready', () => { 
      this.logger.log('Cache Ready');
    });

    this.logger.log('Cache Service Initialized');
  }

  async resolve<T>(key: string, resolver: () => Promise<any>, ttl?: number): Promise<Awaited<T>> {
    const cached = await this.cache?.get(key);
    if (cached) {
      return cached;
    } else {
      const result = await resolver();
      await this.cache?.set(key, result, ttl ? ttl * 1000 : undefined);
      return result;
    }
  }

  async invalidate(key: string) {
    await this.cache?.del(key);
  }

  async del(keys: string[]) {
    await this.cache?.del(keys);
  }

  async get<T>(key: string): Promise<T> {
    return this.cache?.get(key);
  }

  async set<T>(key: string, value: T, ttl?: number) {
    await this.cache?.set(key, value, ttl ? ttl * 1000 : undefined);
  }
}
