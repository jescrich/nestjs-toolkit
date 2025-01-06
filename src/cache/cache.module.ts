import { DynamicModule, Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({})
export class CacheModule {
  static register(params: { redis: { host: string; port: number } }): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: CacheService,
          useFactory: () => new CacheService(params),
        }
      ],
      exports: [CacheService],
    };
  }
}
