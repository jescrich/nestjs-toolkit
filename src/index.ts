import * as Auth from './auth';
import * as Kafka from './kafka';
import * as Consumer from './consumer';
import * as NestJs from './nestjs';
import * as Filters from './nestjs/filters';
import * as Middlewares from './nestjs/middlewares';
import * as Repository from './repository';
import * as Models from './repository/models';

import { AuthModule } from './auth';
import { KafkaClientModule } from './kafka';
import { NestJsModule } from './nestjs/nestjs.module';
import { RepositoryModule } from './repository';
import { SharedModule } from './shared.module';
import { ConsumerModule } from './consumer';

const Modules = {
  KafkaClientModule,
  RepositoryModule,
  AuthModule,
  NestJsModule,
  ConsumerModule,
};
export { Auth, Filters, Kafka, Middlewares, Models, Modules, NestJs, Repository, Consumer };
