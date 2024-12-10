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
        ? { module: CacheModule, redis: { host: config.cache.host, port: config.cache.port } }
        : null,
      config?.kafka?.enabled
        ? { module: KafkaModule, clientId: config.kafka.clientId, brokers: config.kafka.brokers }
        : null,
    ].filter((module) => module !== null);
  },
};

export { Essentials };
