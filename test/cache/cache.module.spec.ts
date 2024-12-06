import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '@this/cache';
import { CacheModule } from '@this/cache/cache.module';

describe('CacheModule', () => {
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          redis: {
            host: 'test-host',
            port: 1234,
          },
        }),
      ],
    }).compile();

    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(cacheService).toBeDefined();
  });
});
