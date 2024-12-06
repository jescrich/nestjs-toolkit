import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({})
export class CacheModule {
  static register(params: { redis: { host: string; port: number } }) {
    return {
      module: CacheModule,
      providers: [CacheService],
      exports: [CacheService],
    };
  }
}