import * as Auth from './auth';
import * as Consumer from './consumer';
import * as Kafka from './kafka';
import * as NestJs from './nestjs';
import * as Filters from './nestjs/filters';
import * as Middlewares from './nestjs/middlewares';

import { AuthModule } from './auth';
import { CacheModule } from './cache/cache.module';
import { ConsumerModule } from './consumer';
import { KafkaModule } from './kafka';
import { NestJsModule } from './nestjs/nestjs.module';
import { Essentials } from './essentials';

const Modules = {
  KafkaModule,
  AuthModule,
  NestJsModule,
  ConsumerModule,
  CacheModule,
  Essentials,
};

const JESToolkit = {
  Modules,
  Auth,
  Consumer,
  Kafka,
  Middlewares,
  NestJs,
};

export { Auth, Consumer, Filters, Kafka, Middlewares, Modules, NestJs, JESToolkit };

