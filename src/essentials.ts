import { Type, DynamicModule, ForwardReference } from '@nestjs/common';
import { NestJsModule } from './nestjs/nestjs.module';
import { CacheModule } from './cache/cache.module';
import { KafkaModule } from './kafka';

const Essentials = {
  register: (config?: {
    cache?: {
      enabled: boolean;
      host?: string;
      port?: number;
    };
    kafka?: {
      enabled: boolean;
      clientId?: string;
      brokers?: string;
    };
  }): Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> => {
    return [
      NestJsModule,
      config?.cache?.enabled
        ? CacheModule.register({
            redis: { host: config?.cache?.host ?? 'localhost', port: config?.cache?.port ?? 6379 },
          })
        : null,
      config?.kafka?.enabled
        ? KafkaModule.register({
            clientId: config?.kafka?.clientId ?? 'client',
            brokers: config?.kafka?.brokers ?? 'localhost:9092',
          })
        : null,
    ].filter((module) => module !== null);
  },
};

export { Essentials };
