import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '@this/cache';
import { CacheModule } from '@this/cache/cache.module';
import { chain } from 'lodash';

describe('CacheModule', () => {
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({  
          redis: {
            host: 'localhost',
            port: 6379,
          },
        }),
      ],
    }).compile();

    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(cacheService).toBeDefined();
  });

  it('should resolve', async () => {
    const result = await cacheService.resolve('test', async () => 'test', 1);
    expect(result).toBe('test');
  });

  it('should invalidate', async () => {
    await cacheService.set('test', 'test', 1);
    const result = await cacheService.get('test');
    expect(result).toBe('test');
    await cacheService.invalidate('test');
    const cached = await cacheService.get('test');
    expect(cached).toBeNull();
  });
});
